const { pool } = require('../../config/db'); // Importa el pool de conexiones

// Ventas por mes
const getVentasPorMes = async (req, res) => {
    try {
        const [result] = await pool.query(`
            SELECT 
                EXTRACT(YEAR FROM vr.fecha_venta) AS año,
                MONTHNAME(vr.fecha_venta) AS mes,
                MONTH(vr.fecha_venta) AS mes_numero,
                p.nombre AS producto,
                SUM(vr.total) AS total_ventas,
                SUM(vd.cantidad) AS total_unidades,
                SUM(vd.subtotal) AS total_por_producto
            FROM ventas_repartidores vr
            JOIN ventas_detalles vd ON vr.id_venta = vd.venta_id
            JOIN productos p ON vd.producto_id = p.id_producto
            GROUP BY año, mes, mes_numero, p.nombre
            ORDER BY año, mes_numero, p.nombre;
        `);

        // Mapeamos los resultados para incluir todos los datos necesarios
        const resultTraducido = result.map(row => ({
            año: row.año,
            mes: row.mes,
            mes_numero: row.mes_numero,
            producto: row.producto,
            total_unidades: Number(row.total_unidades),  // Convierte a número
            total_por_producto: Number(row.total_por_producto),  // Convierte a número
            total_ventas: Number(row.total_ventas),  // Convierte a número
          }));
          

        // Enviamos la respuesta con todos los datos
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

const getVentasPorSemana = async (req, res) => {
    try {
        const [result] = await pool.query(`
            SELECT 
                MONTHNAME(vr.fecha_venta) AS mes,
                EXTRACT(WEEK FROM vr.fecha_venta) AS semana_del_mes,
                p.nombre AS producto,
                SUM(vd.cantidad) AS cantidad_vendida,
                SUM(vd.subtotal) AS total_por_producto
            FROM ventas_repartidores vr
            JOIN ventas_detalles vd ON vr.id_venta = vd.venta_id
            JOIN productos p ON vd.producto_id = p.id_producto
            GROUP BY mes, semana_del_mes, p.nombre
            ORDER BY 
                FIELD(mes, 'January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'), 
                semana_del_mes,
                p.nombre;
        `);

        // Formateamos los resultados para incluir las semanas con la información de los productos
        const resultFormateado = result.reduce((acc, row) => {
            if (!acc[row.mes]) {
                acc[row.mes] = [];
            }
            
            // Encontramos la semana correspondiente dentro del mes
            let semanaExistente = acc[row.mes].find(semana => semana.semana === `Semana ${row.semana_del_mes}`);
            
            if (!semanaExistente) {
                // Si la semana no existe aún, la creamos
                semanaExistente = {
                    semana: `Semana ${row.semana_del_mes}`,
                    productos: []
                };
                acc[row.mes].push(semanaExistente);
            }

            // Añadimos la información del producto a la semana correspondiente
            semanaExistente.productos.push({
                producto: row.producto,
                cantidad_vendida: row.cantidad_vendida,
                total_por_producto: row.total_por_producto
            });

            return acc;
        }, {});

        // Convertimos el objeto a un formato adecuado para enviar
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
                    SELECT 
                EXTRACT(YEAR FROM vr.fecha_venta) AS año,
                p.nombre AS producto,
                SUM(vd.cantidad) AS cantidad_total,
                SUM(vd.subtotal) AS total_por_producto
            FROM ventas_repartidores vr
            JOIN ventas_detalles vd ON vr.id_venta = vd.venta_id
            JOIN productos p ON vd.producto_id = p.id_producto
            GROUP BY año, p.nombre
            ORDER BY año, p.nombre;

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
const getVentasPorDia = async (req, res) => {
    try {
        const [result] = await pool.query(`
            SELECT 
                DATE(vr.fecha_venta) AS dia, 
                DAYNAME(vr.fecha_venta) AS dia_semana,
                p.nombre AS producto,
                SUM(vd.cantidad) AS cantidad_vendida,
                SUM(vd.subtotal) AS total_por_producto
            FROM ventas_repartidores vr
            JOIN ventas_detalles vd ON vr.id_venta = vd.venta_id
            JOIN productos p ON vd.producto_id = p.id_producto
            GROUP BY dia, dia_semana, p.nombre
            ORDER BY dia DESC, p.nombre;
        `);

        const datosAgrupados = result.reduce((acc, row) => {
            const diaKey = row.dia;
            if (!acc[diaKey]) {
                acc[diaKey] = {
                    dia: row.dia,
                    dia_semana: traducirDiaSemana(row.dia_semana),
                    productos: []
                };
            }

            acc[diaKey].productos.push({
                producto: row.producto,
                cantidad_vendida: row.cantidad_vendida,
                total_por_producto: row.total_por_producto
            });

            return acc;
        }, {});

        const resultadoFinal = Object.values(datosAgrupados);

        res.json(resultadoFinal);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener las ventas por día.' });
    }
};

module.exports = {
    getVentasPorMes,
    getVentasPorSemana,
    getVentasPorAnio,
    getProductoMasVendido,
    getVentasPorDia
};
