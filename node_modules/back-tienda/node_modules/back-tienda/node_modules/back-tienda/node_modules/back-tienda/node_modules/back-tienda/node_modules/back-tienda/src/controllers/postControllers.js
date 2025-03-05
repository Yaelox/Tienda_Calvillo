const { pool } = require("../../config/db");

// Obtener todos los eventos
const getPoster = async (req, res) => {
  try {
    const [eventos] = await pool.query('SELECT * FROM poster');
    res.status(200).json(eventos);
  } catch (error) {
    console.error('Error al obtener los Posters:', error);
    res.status(500).json({ message: 'Error al obtener los Posters' });
  }
};

const  getPosterById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM poster WHERE id_eventos = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Poster no encontrado' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error al obtener el Posters:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};


const createPoster= async (req, res) => {
    const { nombre, fecha, ubicacion,descripcion } = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO poster (nombre, fecha, ubicacion,descripcion) VALUES (?, ?,?,?)',
        [nombre, fecha, ubicacion,descripcion ]
      );
      res.status(201).json({
        id_eventos: result.insertId,
        nombre, fecha, ubicacion,descripcion
      });
    } catch (error) {
      console.error('Error al crear el Poster:', error);
      res.status(500).json({ message: 'Error al crear el Poster' });
    }
  };

// Actualizar un evento
const updatePoster = async (req, res) => {
  const { id } = req.params;
  const { nombre, fecha, ubicacion,descripcion } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE poster SET  nombre=?, fecha =?, ubicacion=?,descripcion=? WHERE id_eventos = ?',
      [nombre, fecha, ubicacion,descripcion, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Poster no encontrado' });
    }
    res.status(200).json({
      id_eventos: id,
      nombre, fecha, ubicacion,descripcion
    });
  } catch (error) {
    console.error('Error al actualizar el Poster:', error);
    res.status(500).json({ message: 'Error al actualizar el Poster' });
  }
};


// Eliminar un evento
const deletePoster = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM poster WHERE id_eventos = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Poster no encontrado' });
    }
    res.status(200).json({ message: 'Poster Eliminado' });
  } catch (error) {
    console.error('Error al eliminar el Poster:', error);
    res.status(500).json({ message: 'Error al eliminar el poster' });
  }
};

module.exports = {
  getPoster,
  getPosterById,
  createPoster,
  updatePoster,
  deletePoster,
};
