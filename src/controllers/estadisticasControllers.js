const { pool } = require('../../config/db'); // Importa el pool de conexiones

// Ventas por zona
const getVentasPorZona = async (req, res) => {
    try {
        const [result] = await pool.query(`
            SELECT 
                SUBSTRING_INDEX(SUBSTRING_INDEX(t.direccion, ',', -2), ',', 1) AS ciudad,
                SUM(vr.total) AS total_ventas 
            FROM ventas_repartidores vr
            JOIN tiendas t ON t.id_tienda = vr.tienda_id
            GROUP BY ciudad
            ORDER BY total_ventas DESC
        `);
        res.json(result);
    } catch (err) {
        manejarError(err, res, 'Error al obtener las ventas por zona.');
    }
};

// Ventas por mes
const getVentasPorMes = async (req, res) => {
    try {
        const [result] = await pool.query(`
            SELECT 
                EXTRACT(YEAR FROM fecha_venta) AS año, 
                MONTHNAME(fecha_venta) AS mes, 
                MONTH(fecha_venta) AS mes_numero,  -- Incluimos el número del mes para ordenar
                SUM(total) AS total_ventas
            FROM ventas_repartidores
            GROUP BY año, mes, mes_numero  -- Incluimos mes_numero en GROUP BY
            ORDER BY año, mes_numero  -- Ordenamos usando el número del mes
        `);

        // Traducimos los meses si es necesario
        const resultTraducido = result.map(row => ({
            año: row.año,
            mes: traducirMes(row.mes),
            total_ventas: row.total_ventas
        }));

        res.json(resultTraducido);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener las ventas por mes.' });
    }
};

const traducirMes = (mesIngles) => {
    const meses = {
        "January": "Enero",
        "February": "Febrero",
        "March": "Marzo",
        "April": "Abril",
        "May": "Mayo",
        "June": "Junio",
        "July": "Julio",
        "August": "Agosto",
        "September": "Septiembre",
        "October": "Octubre",
        "November": "Noviembre",
        "December": "Diciembre"
    };
    return meses[mesIngles] || mesIngles;
};

// Ventas por semana y mes
const getVentasPorSemana = async (req, res) => {
    try {
        const [result] = await pool.query(`
            SELECT 
                MONTHNAME(fecha_venta) AS mes, 
                EXTRACT(WEEK FROM fecha_venta) AS semana_del_mes,  -- Semana dentro del mes
                SUM(total) AS total_ventas
            FROM ventas_repartidores
            GROUP BY mes, semana_del_mes  -- Agrupamos por mes y semana
            ORDER BY FIELD(mes, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'), semana_del_mes
        `);

        // Ahora transformamos el resultado para separar las ventas por mes y semana
        const resultFormateado = result.reduce((acc, row) => {
            // Creamos el mes si no existe en el acumulador
            if (!acc[row.mes]) {
                acc[row.mes] = [];
            }
            // Añadimos las ventas por semana dentro de cada mes
            acc[row.mes].push({
                semana: `Semana ${row.semana_del_mes}`,
                ventas: row.total_ventas
            });
            return acc;
        }, {});

        // Transformamos el objeto a un array de meses con sus semanas y ventas
        const resultFinal = Object.keys(resultFormateado).map(mes => ({
            mes,
            semanas: resultFormateado[mes]
        }));

        res.json(resultFinal);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener las ventas por semana.' });
    }
};

// Ventas por año
const getVentasPorAnio = async (req, res) => {
    try {
        const [result] = await pool.query(`
            SELECT EXTRACT(YEAR FROM fecha_venta) AS año, SUM(total) AS total_ventas
            FROM ventas_repartidores
            GROUP BY año
            ORDER BY año
        `);

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener las ventas por año.' });
    }
};

// Producto más vendido
const getProductoMasVendido = async (req, res) => {
    try {
        const [result] = await pool.query(`
            SELECT p.nombre AS producto, SUM(vd.cantidad) AS total_vendido
            FROM ventas_detalles vd
            JOIN productos p ON vd.producto_id = p.id_producto
            GROUP BY p.nombre
            ORDER BY total_vendido DESC
        `);

        res.json(result.length > 0 ? result : { error: 'No se encontraron productos vendidos.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los productos más vendidos.' });
    }
};


// Función para traducir el día de la semana
const traducirDiaSemana = (diaIngles) => {
    const dias = {
        "Monday": "Lunes",
        "Tuesday": "Martes",
        "Wednesday": "Miércoles",
        "Thursday": "Jueves",
        "Friday": "Viernes",
        "Saturday": "Sábado",
        "Sunday": "Domingo"
    };
    return dias[diaIngles] || diaIngles;
};

// Ventas por día
const getVentasPorDia = async (req, res) => {
    try {
        const [result] = await pool.query(`
            SELECT 
                DATE(fecha_venta) AS dia, 
                DAYNAME(fecha_venta) AS dia_semana,  -- Agregamos el nombre del día de la semana
                SUM(total) AS total_ventas
            FROM ventas_repartidores
            GROUP BY dia, dia_semana  -- Agrupamos también por el día de la semana
            ORDER BY dia DESC
        `);

        // Traducimos los días de la semana
        const resultTraducido = result.map(row => ({
            dia: row.dia,
            dia_semana: traducirDiaSemana(row.dia_semana),  // Traducimos el nombre del día
            total_ventas: row.total_ventas
        }));

        res.json(resultTraducido);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener las ventas por día.' });
    }
};

const getProductoMasVendidoPorZona = async (req, res) => {
    try {
        const [result] = await pool.query(`
            SELECT 
                -- Zona es la ciudad (penúltima parte de la dirección)
                SUBSTRING_INDEX(SUBSTRING_INDEX(t.direccion, ',', -2), ',', 1) AS zona,  
                p.nombre AS producto, 
                SUM(vd.cantidad) AS total_vendido,
                -- Colonia se renombra como calle (primera parte de la dirección)
                SUBSTRING_INDEX(t.direccion, ',', 1) AS calle
            FROM ventas_repartidores vr
            JOIN ventas_detalles vd ON vr.id_venta = vd.venta_id
            JOIN productos p ON vd.producto_id = p.id_producto
            JOIN tiendas t ON vr.tienda_id = t.id_tienda
            GROUP BY zona, p.nombre, calle
            ORDER BY zona, calle, total_vendido DESC
        `);

        // Si no hay resultados, se devuelve un error
        if (!result || result.length === 0) {
            return res.json({ error: 'No se encontraron productos más vendidos por zona.' });
        }

        // Devolver los resultados
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener el producto más vendido por zona.' });
    }
};


module.exports = {
    getVentasPorZona,
    getVentasPorMes,
    getVentasPorSemana,
    getVentasPorAnio,
    getProductoMasVendido,
    getVentasPorDia,
    getProductoMasVendidoPorZona
};
