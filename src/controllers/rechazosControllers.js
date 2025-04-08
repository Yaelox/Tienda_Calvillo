const { pool } = require("../../config/db");

const getRechazos = async (req, res) => {
    try {
      const [rechazos] = await pool.query('SELECT * FROM rechazos');
      res.status(200).json(rechazos);
    } catch (error) {
      console.error('Error al obtener los rechazos', error);
      res.status(500).json({ message: 'Error al obtener los rechazos' });
    }
  };

  const getRechazosRepartidores = async (req, res) => {
    try {
      const [rechazoss] = await pool.query('SELECT * FROM rechazos_repartidores');
      res.status(200).json(rechazoss);
    } catch (error) {
      console.error('Error al obtener los rechazos de los repartidores', error);
      res.status(500).json({ message: 'Error al obtener los rechazos de los repartidores' });
    }
  };


  const  getRechazosById = async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await pool.query('SELECT * FROM rechazos WHERE id_rechazo = ?', [id]);
  
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Rechazo no encontrado' });
      }
  
      res.status(200).json(rows[0]);
    } catch (error) {
      console.error('Error al obtener el rechazo:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  };


  
  const  getRechazosRepartidoreById = async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await pool.query('SELECT * FROM rechazos_repartidores WHERE id_rechazo_repartidores= ?', [id]);
  
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Rechazo no encontrado' });
      }
  
      res.status(200).json(rows[0]);
    } catch (error) {
      console.error('Error al obtener el rechazo:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  };


  
const CreateRechazo= async (req, res) => {
    const { id_compranormal, descripcion } = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO rechazos (id_compranormal, descripcion) VALUES (?,?)',
        [id_compranormal, descripcion ]
      );
      res.status(201).json({
        id_rechazo: result.insertId,
        id_compranormal, descripcion
      });
    } catch (error) {
      console.error('Error al registrar el rechazo:', error);
      res.status(500).json({ message: 'Error al registrar el rechazo' });
    }
  };

  const CreateRechazoRepartidores = async (req, res) => {
    const { id_ventarepartidor, descripcion } = req.body;
  
    try {
      // Insertamos el rechazo en la tabla rechazos_repartidores
      const [result] = await pool.query(
        'INSERT INTO rechazos_repartidores (id_ventarepartidor, descripcion) VALUES (?, ?)',
        [id_ventarepartidor, descripcion]
      );
  
      // Actualizamos el estado de 'rechazado' a 'true' en la tabla ventas_repartidores
      await pool.query(
        'UPDATE ventas_repartidores SET rechazado = TRUE WHERE id_venta = ?',
        [id_ventarepartidor]
      );
  
      // Respondemos con el resultado del rechazo
      res.status(201).json({
        id_rechazo_repartidores: result.insertId,
        id_ventarepartidor, 
        descripcion
      });
    } catch (error) {
      console.error('Error al registrar el rechazo:', error);
      res.status(500).json({ message: 'Error al registrar el rechazo' });
    }
  };


// Actualizar un evento
const updateRechazo = async (req, res) => {
    const { id } = req.params;
    const { id_compranormal,descripcion } = req.body;
    try {
      const [result] = await pool.query(
        'UPDATE rechazos SET id_compranormal=? ,descripcion=? WHERE id_rechazo = ?',
        [id_compranormal,descripcion, id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Rechazo no encontrado' });
      }
      res.status(200).json({
        id_rechazo: id,
        id_compranormal,descripcion
      });
    } catch (error) {
      console.error('Error al actualizar el rechazo:', error);
      res.status(500).json({ message: 'Error al actualizar el rechazo' });
    }
  };

   
// Actualizar un evento
const updateRechazoRepartidores = async (req, res) => {
    const { id } = req.params;
    const { id_ventarepartidor,descripcion } = req.body;
    try {
      const [result] = await pool.query(
        'UPDATE rechazos_repartidores SET id_ventarepartidor=? ,descripcion=? WHERE id_rechazo_repartidores = ?',
        [id_ventarepartidor,descripcion, id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Rechazo no encontrado' });
      }
      res.status(200).json({
        id_rechazo_repartidores: id,
        id_ventarepartidor,descripcion
      });
    } catch (error) {
      console.error('Error al actualizar el rechazo:', error);
      res.status(500).json({ message: 'Error al actualizar el rechazo' });
    }
  };


  

// Eliminar un evento
const deleteRechazos = async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await pool.query('DELETE FROM rechazo WHERE id_rechazo = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Rechazo no encontrado' });
      }
      res.status(200).json({ message: 'Rechazo Eliminado' });
    } catch (error) {
      console.error('Error al eliminar el Rechazo:', error);
      res.status(500).json({ message: 'Error al eliminar el Rechazo' });
    }
  };

  // Eliminar un evento
const deleteRechazosRepartidores = async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await pool.query('DELETE FROM rechazos_repartidores WHERE id_rechazo_repartidores = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Rechazo no encontrado' });
      }
      res.status(200).json({ message: 'Rechazo Eliminado' });
    } catch (error) {
      console.error('Error al eliminar el Rechazo:', error);
      res.status(500).json({ message: 'Error al eliminar el Rechazo' });
    }
  };


  module.exports = {
    getRechazos,
    getRechazosRepartidores,
    getRechazosById,
    getRechazosRepartidoreById,
    CreateRechazo,
    CreateRechazoRepartidores,
    updateRechazo,
    updateRechazoRepartidores,
    deleteRechazos,
    deleteRechazosRepartidores,

  };
  