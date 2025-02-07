
const {pool} = require("../../config/db")

// Obtener todos los contactos
const getContactos = async () => {
  try {
    const [contactos] = await pool.query("SELECT * FROM contacto");
    return contactos;
  } catch (error) {
    throw error;
  }
};

// Obtener un contacto por ID
const getContactoById = async (id) => {
  try {
    const [contacto] = await pool.query(
      "SELECT * FROM contacto WHERE contacto_id = ?",
      [id]
    );
    return contacto.length ? contacto[0] : null;
  } catch (error) {
    throw error;
  }
};

// Crear un nuevo contacto
const createContacto = async (nombre, email,telefono, descripcion, id_usuario) => {
  try {
    const [result] = await pool.query(
      "INSERT INTO contacto (nombre, email,telefono, descripcion, id_usuario) VALUES (?, ?, ?,?, ?)",
      [nombre, email,telefono, descripcion, id_usuario]
    );
    return { contacto_id: result.insertId, nombre, email,telefono, descripcion, id_usuario };
  } catch (error) {
    throw error;
  }
};

// Actualizar un contacto
const updateContacto = async (contacto_id, nombre, email,telefono, descripcion) => {
  try {
    await pool.query(
      "UPDATE contacto SET nombre = ?, email = ?,telefono=?, descripcion = ? WHERE contacto_id = ?",
      [nombre, email, descripcion, contacto_id]
    );
    return { contacto_id, nombre, email,telefono, descripcion };
  } catch (error) {
    throw error;
  }
};

// Eliminar un contacto
const deleteContacto = async (id) => {
  try {
    await pool.query("DELETE FROM contacto WHERE contacto_id = ?", [id]);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getContactos,
  getContactoById,
  createContacto,
  updateContacto,
  deleteContacto,
};