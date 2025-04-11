const { pool } = require('../../config/db'); // Importa el pool de conexiones

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
            GROUP BY año, mes, mes_numero
            ORDER BY año, mes_numero
        `);

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
                EXTRACT(WEEK FROM fecha_venta) AS semana_del_mes,
                SUM(total) AS total_ventas
            FROM ventas_repartidores
            GROUP BY mes, semana_del_mes
            ORDER BY FIELD(mes, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'), semana_del_mes
        `);

        const resultFormateado = result.reduce((acc, row) => {
            if (!acc[row.mes]) {
                acc[row.mes] = [];
            }
            acc[row.mes].push({
                semana: `Semana ${row.semana_del_mes}`,
                ventas: row.total_ventas
            });
            return acc;
        }, {});

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
                DAYNAME(fecha_venta) AS dia_semana,
                SUM(total) AS total_ventas
            FROM ventas_repartidores
            GROUP BY dia, dia_semana
            ORDER BY dia DESC
        `);

        const resultTraducido = result.map(row => ({
            dia: row.dia,
            dia_semana: traducirDiaSemana(row.dia_semana),
            total_ventas: row.total_ventas
        }));

        res.json(resultTraducido);
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
