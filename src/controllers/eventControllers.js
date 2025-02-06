const { pool } = require("../../config/db");

// Obtener todos los eventos
const getEventos = async (req, res) => {
  try {
    const [eventos] = await pool.query('SELECT * FROM events');
    res.status(200).json(eventos);
  } catch (error) {
    console.error('Error al obtener los eventos:', error);
    res.status(500).json({ message: 'Error al obtener los eventos' });
  }
};

const  getEventoById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM events WHERE id_evento = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error al obtener el evento:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};


const createEvento = async (req, res) => {
  const { nombre, fecha, telefono, email, ubicacion, descripcion } = req.body;
  try {
    // Obtener el id_usuario a partir del email
    const [usuarios] = await pool.query("SELECT id_usuario FROM users WHERE email = ?", [email]);
    
    if (usuarios.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    const id_usuario = usuarios[0].id_usuario;

    // Crear el evento en la base de datos
    const [result] = await pool.query(
      "INSERT INTO events (id_usuario, nombre, fecha, telefono, email, ubicacion, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id_usuario, nombre, fecha, telefono, email, ubicacion, descripcion]
    );

    return res.status(201).json({
      id_evento: result.insertId,
      id_usuario,
      nombre,
      fecha,
      telefono,
      email,
      ubicacion,
      descripcion,
    });
  } catch (error) {
    console.error('Error al crear evento:', error);
    return res.status(500).json({ message: "Error al crear el evento" });
  }
};

// Actualizar un evento
const updateEvento = async (req, res) => {
  const { id } = req.params;
  const { id_usuario, nombre, fecha, telefono, email, ubicacion, descripcion } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE events SET  id_usuario=?,nombre = ?, fecha = ?, telefono = ?, email = ?, ubicacion = ?, descripcion = ? WHERE id_evento = ?',
      [id_usuario,nombre, fecha, telefono, email, ubicacion, descripcion, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    res.status(200).json({
      id_evento: id,
      id_usuario,
      nombre,
      fecha,
      telefono,
      email,
      ubicacion,
      descripcion,
    });
  } catch (error) {
    console.error('Error al actualizar el evento:', error);
    res.status(500).json({ message: 'Error al actualizar el evento' });
  }
};


// Eliminar un evento
const deleteEvento = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM events WHERE id_evento = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    res.status(200).json({ message: 'Evento Eliminado' });
  } catch (error) {
    console.error('Error al eliminar el evento:', error);
    res.status(500).json({ message: 'Error al eliminar el evento' });
  }
};

module.exports = {
  getEventos,
  getEventoById,
  createEvento,
  updateEvento,
  deleteEvento,
};
