const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const registerUser = async (req, res) => {
  const { nombre,usuario, email, password,telefono, tipo_usuario } = req.body;

  try {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await User.createUser(nombre,usuario, email, passwordHash,telefono,tipo_usuario);

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    // Verifica que 'user' tiene el campo 'id' antes de generar el token
    console.log('User recibido:', user);

    const token = jwt.sign({ 
      id: user.id, // Asegúrate de que 'id' sea el campo correcto
      tipo_usuario: user.tipo_usuario
    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Verifica que 'user.id' esté presente
    if (!user.id_usuario) {
      console.error('Error: id_usuario está indefinido en el objeto usuario.');
    }

    res.json({
      token,
      user: {
        id_usuario: user.id_usuario, // Asegúrate de que 'id' se mapea correctamente a 'id_usuario'
        nombre: user.nombre,
        usuario: user.usuario,
        email: user.email,
        telefono: user.telefono,
        tipo_usuario: user.tipo_usuario, // Pasar el tipo_usuario también
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};



module.exports = { registerUser, loginUser };
