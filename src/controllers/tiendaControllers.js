const { pool } = require('../../config/db');

// Obtener todas las tiendas
const getTiendas = async (req, res) => {
  try {
    const [tiendas] = await pool.query('SELECT * FROM tiendas');
    res.status(200).json(tiendas);
  } catch (error) {
    console.error('Error al obtener las tiendas:', error);
    res.status(500).json({ message: 'Error al obtener las tiendas' });
  }
};

// Obtener una tienda por ID
const getTiendaById = async (req, res) => {
  const { id } = req.params;
  try {
    const [tienda] = await pool.query('SELECT * FROM tiendas WHERE id_tienda = ?', [id]);
    if (tienda.length === 0) {
      return res.status(404).json({ message: 'Tienda no encontrada' });
    }
    res.status(200).json(tienda[0]);
  } catch (error) {
    console.error('Error al obtener la tienda:', error);
    res.status(500).json({ message: 'Error al obtener la tienda' });
  }
};

// Crear una nueva tienda
const createTienda = async (req, res) => {
  const { nombre_tienda, direccion, telefono, email,id_usuario} = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO tiendas (nombre_tienda, direccion, telefono, email,id_usuario) VALUES (?, ?, ?, ?,?)',
      [nombre_tienda, direccion, telefono, email,id_usuario]
    );
    res.status(201).json({
      id_tienda: result.insertId,
      nombre_tienda,
      direccion,
      telefono,
      email,
      id_usuario,
    });
  } catch (error) {
    console.error('Error al crear la tienda:', error);
    res.status(500).json({ message: 'Error al crear la tienda' });
  }
};

// Actualizar una tienda
const updateTienda = async (req, res) => {
  const { id } = req.params;
  const { nombre_tienda, direccion, telefono, email, fecha_registro } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE tiendas SET nombre_tienda = ?, direccion = ?, telefono = ?, email = ?, fecha_registro = ? WHERE id_tienda = ?',
      [nombre_tienda, direccion, telefono, email, fecha_registro, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Tienda no encontrada' });
    }
    res.status(200).json({
      id_tienda: id,
      nombre_tienda,
      direccion,
      telefono,
      email,
      fecha_registro,
    });
  } catch (error) {
    console.error('Error al actualizar la tienda:', error);
    res.status(500).json({ message: 'Error al actualizar la tienda' });
  }
};

// Eliminar una tienda
const deleteTienda = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM tiendas WHERE id_tienda = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Tienda no encontrada' });
    }
    res.status(200).json({ message: 'Tienda eliminada' });
  } catch (error) {
    console.error('Error al eliminar la tienda:', error);
    res.status(500).json({ message: 'Error al eliminar la tienda' });
  }
};

module.exports = {
  getTiendas,
  getTiendaById,
  createTienda,
  updateTienda,
  deleteTienda,
};
