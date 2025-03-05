const { pool } = require('../../config/db');  

const Contacto = require('../models/contactoModel');

// Crear un nuevo contacto
exports.createContacto = async (req, res) => {
  try {
    const { nombre, email,telefono, descripcion } = req.body;

    // Buscar el id_usuario basado en el email
    const [usuario] = await pool.query('SELECT id_usuario FROM users WHERE email = ?', [email]);

    if (!usuario.length) {
      return res.status(404).json({ error: 'Usuario no encontrado con el correo proporcionado' });
    }

    const id_usuario = usuario[0].id_usuario;

    // Crear el contacto con el id_usuario obtenido
    const nuevoContacto = await Contacto.createContacto(nombre, email,telefono,  descripcion, id_usuario);

    res.status(201).json(nuevoContacto);
  } catch (error) {
    console.error('Error al crear el contacto:', error);
    res.status(500).json({ error: 'Error al crear el contacto', details: error.message });
  }
};

// Obtener todos los contactos
exports.getContacto = async (req, res) => {
  try {
    const contactos = await Contacto.getContactos();
    res.status(200).json(contactos);
  } catch (error) {
    console.error('Error al obtener los contactos:', error);
    res.status(500).json({ error: 'Error al obtener los contactos', details: error.message });
  }
};

// Obtener un contacto por ID
exports.getContactoById = async (req, res) => {
  try {
    const { id } = req.params;
    const contacto = await Contacto.getContactoById(id);
    if (!contacto) {
      return res.status(404).json({ error: 'Contacto no encontrado' });
    }
    res.status(200).json(contacto);
  } catch (error) {
    console.error('Error al obtener el contacto:', error);
    res.status(500).json({ error: 'Error al obtener el contacto', details: error.message });
  }
};

// Actualizar un contacto
exports.updateContacto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, telefono,descripcion} = req.body;
    const contacto = await Contacto.getContactoById(id);

    if (!contacto) {
      return res.status(404).json({ error: 'Contacto no encontrado' });
    }

    const updatedContacto = await Contacto.updateContacto(id, nombre, email,telefono, descripcion);
    res.status(200).json(updatedContacto);
  } catch (error) {
    console.error('Error al actualizar el contacto:', error);
    res.status(500).json({ error: 'Error al actualizar el contacto', details: error.message });
  }
};

// Eliminar un contacto
exports.deleteContacto = async (req, res) => {
  try {
    const { id } = req.params;
    const contacto = await Contacto.getContactoById(id);
    if (!contacto) {
      return res.status(404).json({ error: 'Contacto no encontrado' });
    }
    await Contacto.deleteContacto(id);
    res.status(200).json({ message: 'Contacto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el contacto:', error);
    res.status(500).json({ error: 'Error al eliminar el contacto', details: error.message });
  }
};