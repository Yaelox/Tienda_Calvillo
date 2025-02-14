const { pool } = require('../../config/db');

// Obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT * FROM users');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
};

// Obtener un usuario por ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE id_usuario = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(users[0]);
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
};

// Actualizar un usuario
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nombre,usuario, email,telefono,tipo_usuario} = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE users SET nombre=?,usuario = ?, email = ?,telefono=?, tipo_usuario = ? WHERE id_usuario = ?',
      [usuario, email, tipo_usuario, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json({
      id_usuario: id,
      nombre,
      usuario,
      email,
      telefono,
      tipo_usuario
    });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
};

// Eliminar un usuario
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    // Verificar si el usuario tiene órdenes asociadas
    const [orders] = await pool.query('SELECT * FROM ordenes WHERE id_usuario = ?', [id]);

    if (orders.length > 0) {
      return res.status(400).json({ message: 'No se puede eliminar el usuario porque tiene pedidos activos.' });
    }

    // Si no tiene órdenes, proceder con la eliminación
    const [result] = await pool.query('DELETE FROM users WHERE id_usuario = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
