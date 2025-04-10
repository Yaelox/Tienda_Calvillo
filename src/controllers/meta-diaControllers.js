const { pool } = require("../../config/db");


const getMetaDelDia = async (req, res) => {
    try {
      // 1. Buscar meta del día
      const [metaRows] = await pool.query(`
        SELECT meta_contenedores FROM metas_ventas WHERE fecha = CURDATE()
      `);
  
      let meta = metaRows[0]?.meta_contenedores;
  
      // 2. Si no existe, crear nueva meta (+10 que la anterior o 50 si no hay)
      if (!meta) {
        const [lastMetaRow] = await pool.query(`
          SELECT meta_contenedores FROM metas_ventas ORDER BY fecha DESC LIMIT 1
        `);
  
        const nuevaMeta = (lastMetaRow[0]?.meta_contenedores || 50) + 10;
  
        await db.query(`
          INSERT INTO metas_ventas (fecha, meta_contenedores)
          VALUES (CURDATE(), ?)
        `, [nuevaMeta]);
  
        meta = nuevaMeta;
      }
  
      // 3. Obtener contenedores vendidos hoy
      const [ventasRow] = await pool.query(`
        SELECT SUM(vd.cantidad) AS contenedores_vendidos
        FROM ventas_repartidores vr
        JOIN ventas_detalles vd ON vr.id_venta = vd.venta_id
        WHERE DATE(vr.fecha_venta) = CURDATE()
      `);
  
      const vendidos = ventasRow[0].contenedores_vendidos || 0;
      const progreso = Math.min(100, Math.round((vendidos / meta) * 100));
  
      res.json({
        meta,
        vendidos,
        progreso
      });
  
    } catch (err) {
      console.error('Error al obtener la meta del día:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
  
  module.exports = {
    getMetaDelDia
  };
  