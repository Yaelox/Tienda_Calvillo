const { pool } = require('../../config/db');

// Obtener todos los contactos
const getUsers = async () => {
    try {
      const [users] = await pool.query("SELECT * FROM users");
      return users;
    } catch (error) {
      throw error;
    }
  };

    // Obtener un producto por ID
const getUsersbyId = async (id) => {
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE id_usuario = ?', [id]);
    return users.length ? users[0] : null;
  } catch (error) {
    throw error;
  }
};

// Actualizar una tienda
const updateUsers= async (id,usuario, email, password,tipo_usuario,fecha_registro) => {
  try {
    await pool.query(
      'UPDATE users SET id,usuario=?, email=?, password=?,tipo_usuario=?,fecha_registro=? WHERE id_usuario = ?', 
      [usuario, email, password,tipo_usuario,fecha_registro,id]
    );
    return { id,usuario, email, password,tipo_usuario,fecha_registro };
  } catch (error) {
    throw error;
  }
};

// Eliminar un producto
const deleteUsers = async (id) => {
  try {
    await pool.query('DELETE FROM users WHERE id_usuario = ?', [id]);
  } catch (error) {
    throw error;
  }
};

  module.exports = {
    getUsers,
    getUsersbyId,
    updateUsers,
    deleteUsers
  };