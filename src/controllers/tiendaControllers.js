const { pool } = require('../../config/db');

// Obtener todas las tiendas
const getTiendas = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM tiendas', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Tienda no encontrada' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error al obtener la tienda:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const   getTiendasbyId = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM tiendas WHERE id_tienda = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Tienda no encontrada' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error al obtener la tienda:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};


// Crear una nueva tienda
const createTienda = async (req, res) => {
  const { nombre_tienda, direccion, telefono, email,id_usuario,frecuencia_visitas } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO tiendas (nombre_tienda, direccion, telefono, email ,id_usuario,frecuencia_visitas) VALUES (?, ?, ?, ?,?,?)',
      [nombre_tienda, direccion, telefono, email,id_usuario,frecuencia_visitas ]
    );
    res.status(201).json({
      id_tienda: result.insertId,
      nombre_tienda,
      direccion,
      telefono,
      email,
      id_usuario,
      frecuencia_visitas 
    });
  } catch (error) {
    console.error('Error al crear la tienda:', error);
    res.status(500).json({ message: 'Error al crear la tienda' });
  }
};

// Actualizar una tienda
const updateTienda = async (req, res) => {
  const { id } = req.params;
  const { nombre_tienda, direccion, telefono, email,frecuencia_visitas } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE tiendas SET nombre_tienda = ?, direccion = ?, telefono = ?, email = ?, frecuencia_visitas=? WHERE id_tienda = ?',
      [nombre_tienda, direccion, telefono, email,frecuencia_visitas, id]
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
      frecuencia_visitas 
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
  getTiendasbyId,
  createTienda,
  updateTienda,
  deleteTienda,
};
