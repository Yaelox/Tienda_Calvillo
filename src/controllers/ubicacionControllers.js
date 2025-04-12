const { pool } = require("../../config/db");
const { updateFoto } = require("./fotosControllers");

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

  
  module.exports = {
    getUbicaciones,
    PostUbicacion,
    deleteUbicacion,
    updateUbicacion

  };
  