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
      // Consulta SQL para actualizar el motivo en la tabla `ubicaciones`
      const [result] = await pool.query(
        'UPDATE ubicaciones SET motivo = ? WHERE id = ?',
        [motivo, id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Ubicación no encontrada' });
      }
  
      // Asegurarse de que el cambio se refleje correctamente al responder
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
    const { id, motivo } = req.params; // Obtener el ID y el motivo de los parámetros de la solicitud
    
    try {
      // Si se recibe un motivo en la solicitud, actualizamos la ubicación y las ventas
      if (motivo) {
        // Verificar si el motivo es válido
        const motivosValidos = ['Motivo_Azul', 'Motivo_Rojo', 'Motivo_Naranja', 'Motivo_Verde'];
        if (!motivosValidos.includes(motivo)) {
          return res.status(400).json({ error: 'Motivo inválido' });
        }
  
        // Realizar la actualización de los motivos en la tabla 'ubicaciones' y 'ventas_repartidores'
        const [updateResult] = await pool.query(`
          UPDATE ubicaciones u
          JOIN ventas_repartidores vr ON u.id = vr.id_ubicacion
          SET 
            u.motivo = ?,
            vr.motivo = ?
          WHERE u.id = ?;
        `, [motivo, motivo, id]);
  
        if (updateResult.affectedRows === 0) {
          return res.status(404).json({ error: 'Ubicación no encontrada o no se pudo actualizar' });
        }
  
        res.json({ message: 'Motivo actualizado con éxito' });
      }
      
      // Obtener las ubicaciones con el motivo correspondiente
      const [rows] = await pool.query(`
        SELECT 
          u.id, 
          u.nombre_tienda, 
          u.latitud, 
          u.longitud, 
          u.fecha_registro, 
          COALESCE(vr.motivo, u.motivo) AS motivo_final
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
      console.error('Error al obtener o actualizar ubicaciones:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
  
  
  
  module.exports = {
    getUbicaciones,
    PostUbicacion,
    deleteUbicacion,
    updateUbicacion,
    getMotivosUbicacion,
    updatecolor

  };
  