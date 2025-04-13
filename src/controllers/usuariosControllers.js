const { pool } = require('../../config/db');
const bcrypt = require('bcryptjs')

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
      [nombre,usuario,email,telefono, tipo_usuario, id]
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
    const [orders] = await pool.query('SELECT * FROM compras WHERE usuario_id = ?', [id]);

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


const actualizar = async (req, res) => {
  const { email, password } = req.body;

  console.log('Datos recibidos:', { email, password });

  // Validación de los campos requeridos
  if (!email || !password) {
    console.warn('Faltan datos: email o password');
    return res.status(400).json({ error: 'Email y nueva contraseña son requeridos.' });
  }

  try {
    // Verificar si el usuario con el email proporcionado existe
    const [results] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (results.length === 0) {
      console.warn('Usuario no encontrado con email:', email);
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    console.log('Usuario encontrado:', results[0]);

    // Encriptar la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Contraseña encriptada:', hashedPassword);

    // Actualizar la contraseña en la base de datos
    const [updateResult] = await pool.query(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, email]
    );

    // Verificar si la actualización fue exitosa
    if (updateResult.affectedRows === 0) {
      console.warn('No se actualizó ninguna fila para el email:', email);
      return res.status(500).json({ error: 'No se pudo actualizar la contraseña.' });
    }

    console.log('Contraseña actualizada correctamente para:', email);
    return res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
    
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud.' });
  }
};


module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  actualizar
};
