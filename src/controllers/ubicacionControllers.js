const { pool } = require("../../config/db");


const PostUbicacion= async (req, res) => {
    const { nombre_tienda, latitud, longitud} = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO ubicaciones (nombre_tienda, latitud, longitud) VALUES (?, ?, ?)',
        [nombre_tienda, latitud, longitud]
      );
      res.status(201).json({
        id: result.insertId,
        nombre_tienda, latitud, longitud
      });
    } catch (error) {
      console.error('Error al registrar la ubicacion:', error);
      res.status(500).json({ message: 'Error al registrar la ubicacion' });
    }
  };

  const deleteUbicacion = async (req, res) => {
    const { id } = req.params;
  
    try {
      const [result] = await pool.query('DELETE FROM ubicaciones WHERE id = ?', [id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Ubicación no encontrada' });
      }
  
      res.status(200).json({ message: 'Ubicación eliminada exitosamente' });
    } catch (error) {
      console.error('Error al eliminar la ubicación:', error);
      res.status(500).json({ message: 'Error al eliminar la ubicación' });
    }
  };

  const updatecolor = async (req, res) => {
    const { id } = req.params;
    const { motivo } = req.body; // Motivo nuevo que recibimos desde el cuerpo de la solicitud
  
    // Validamos que el motivo esté dentro de las opciones permitidas
    const motivosValidos = ['Motivo_Azul', 'Motivo_Rojo', 'Motivo_Naranja', 'Motivo_Verde'];
  
    if (!motivosValidos.includes(motivo)) {
      return res.status(400).json({ error: 'Motivo inválido' });
    }
  
    try {
      // Consulta SQL para actualizar el motivo
      const [result] = await pool.query(
        'UPDATE ubicaciones SET motivo = ? WHERE id = ?',
        [motivo, id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Ubicación no encontrada' });
      }
  
      res.json({ message: 'Motivo actualizado con éxito' });
    } catch (err) {
      console.error('Error al actualizar motivo:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }


  const updateUbicacion = async (req, res) => {
    const { id } = req.params;
    const { nombre_tienda, latitud, longitud } = req.body;
  
    try {
      const [result] = await pool.query(
        'UPDATE ubicaciones SET nombre_tienda = ?, latitud = ?, longitud = ? WHERE id = ?',
        [nombre_tienda, latitud, longitud, id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Ubicación no encontrada para actualizar' });
      }
  
      res.status(200).json({ message: 'Ubicación actualizada exitosamente' });
    } catch (error) {
      console.error('Error al actualizar la ubicación:', error);
      res.status(500).json({ message: 'Error al actualizar la ubicación' });
    }
  };
  
const getUbicaciones = async (req, res) => {
    try {
      const [ubi] = await pool.query('SELECT * FROM ubicaciones');
      res.status(200).json(ubi);
    } catch (error) {
      console.error('Error al obtener la Ubicacion', error);
      res.status(500).json({ message: 'Error al obtener la ubicacion' });
    }
  };


const getMotivosUbicacion = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        u.id, 
        u.nombre_tienda, 
        u.latitud, 
        u.longitud, 
        u.fecha_registro, 
        vr.motivo
      FROM ubicaciones u
      LEFT JOIN ventas_repartidores vr 
        ON vr.id_ubicacion = u.id
        AND vr.fecha_venta = (
          SELECT MAX(fecha_venta)
          FROM ventas_repartidores
          WHERE id_ubicacion = u.id
        );
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener ubicaciones con motivo:', error);
    res.status(500).json({ error: 'Error al obtener ubicaciones' });
  }
}
  
  module.exports = {
    getUbicaciones,
    PostUbicacion,
    deleteUbicacion,
    updateUbicacion,
    getMotivosUbicacion,
    updatecolor

  };
  