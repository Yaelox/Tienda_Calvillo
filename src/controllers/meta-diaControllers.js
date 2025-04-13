const { pool } = require("../../config/db");


const getMetaDelDia = async (req, res) => {
  try {
    // Llamar al procedimiento almacenado para verificar o crear la meta del día
    await pool.query('CALL CrearMetaDelDia()');

    // Obtener la meta del día después de ejecutar el procedimiento
    const [metaRows] = await pool.query(`
      SELECT meta_contenedores FROM metas_ventas WHERE fecha = CURDATE()
    `);

    let meta = metaRows[0]?.meta_contenedores;

    // Obtener contenedores vendidos hoy
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

const setMetaDelDia = async (req, res) => {
  try {
    const { meta_contenedores } = req.body;

    // Verificar que meta_contenedores sea un número válido
    if (!meta_contenedores || isNaN(meta_contenedores)) {
      return res.status(400).json({ error: 'meta_contenedores es requerido y debe ser un número válido' });
    }

    // Insertar o actualizar la meta del día para la fecha actual
    const result = await pool.query(`
      INSERT INTO metas_ventas (fecha, meta_contenedores)
      VALUES (CURDATE(), ?)
      ON DUPLICATE KEY UPDATE meta_contenedores = VALUES(meta_contenedores)
    `, [meta_contenedores]);

    // Respuesta exitosa
    return res.json({ message: 'Meta del día guardada correctamente', meta_contenedores });

  } catch (err) {
    console.error('Error al guardar la meta del día:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

  module.exports = {
    getMetaDelDia,
    setMetaDelDia
  };
  

  