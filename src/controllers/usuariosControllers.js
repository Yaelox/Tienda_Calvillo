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
  const { usuario, nuevaContrasena } = req.body;

  console.log('Datos recibidos:', { usuario, nuevaContrasena });

  if (!usuario || !nuevaContrasena) {
    console.warn('Faltan datos: usuario o nueva contraseña');
    return res.status(400).json({ error: 'Usuario y nueva contraseña son requeridos.' });
  }

  // Verificar si el usuario existe
  pool.query('SELECT * FROM users WHERE usuario = ?', [usuario], async (err, results) => {
    if (err) {
      console.error('Error al consultar el usuario:', err);
      return res.status(500).json({ error: 'Error en la base de datos.' });
    }

    if (results.length === 0) {
      console.warn('Usuario no encontrado:', usuario);
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    console.log('Usuario encontrado:', results[0]);

    try {
      // Encriptar la nueva contraseña
      const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);
      console.log('Contraseña encriptada:', hashedPassword);

      // Actualizar la contraseña
      pool.query('UPDATE users SET password = ? WHERE usuario = ?', [hashedPassword, usuario], (err) => {
        if (err) {
          console.error('Error al actualizar la contraseña:', err);
          return res.status(500).json({ error: 'Error al actualizar la contraseña.' });
        }

        console.log('Contraseña actualizada correctamente para el usuario:', usuario);
        return res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
      });

    } catch (hashError) {
      console.error('Error al encriptar la contraseña:', hashError);
      return res.status(500).json({ error: 'Error al procesar la contraseña.' });
    }
  });
};


module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  actualizar
};
