const { pool } = require('../../config/db'); // Importa el pool de conexiones


const getFotos = async (req, res) => {
    try {
      const [fotos] = await pool.query('SELECT * FROM fotos');
      res.status(200).json(fotos);
    } catch (error) {
      console.error('Error al obtener las fotos', error);
      res.status(500).json({ message: 'Error al obtener las fotos' });
    }
  };


  
const getFotosporfecha = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = 'SELECT * FROM fotos';
    const params = [];

    if (startDate && endDate) {
      query += ' WHERE fecha BETWEEN ? AND ?';
      params.push(startDate, endDate);
    } else if (startDate) {
      query += ' WHERE fecha >= ?';
      params.push(startDate);
    } else if (endDate) {
      query += ' WHERE fecha <= ?';
      params.push(endDate);
    }

    const [fotos] = await pool.query(query, params);

    res.status(200).json(fotos);
  } catch (error) {
    console.error('Error al obtener las fotos', error);
    res.status(500).json({ message: 'Error al obtener las fotos' });
  }
};

  const postFoto= async (req, res) => {
    const { titulo,imagen,  id_usuario} = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO fotos (titulo,imagen,id_usuario) VALUES (?,?,?)',
        [titulo,imagen, id_usuario]
      );
      res.status(201).json({
        foto_id : result.insertId,
        titulo,imagen, id_usuario
      });
    } catch (error) {
      console.error('Error al subir la foto:', error);
      res.status(500).json({ message: 'Error al subir la foto' });
    }
  };

  
// Eliminar un evento
const deleteFoto = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM fotos WHERE foto_id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Foto no encontrada' });
    }
    res.status(200).json({ message: 'Foto Eliminada' });
  } catch (error) {
    console.error('Error al eliminar la Foto:', error);
    res.status(500).json({ message: 'Error al eliminar la Foto' });
  }
};



const updateFoto = async (req, res) => {
  const { id } = req.params;
  const { id_usuario,titulo,imagen } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE fotos SET  titulo=?,imagen=?,id_usuario=? WHERE foto_id = ?',
      [id_usuario,titulo,imagen, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Foto no encontrada' });
    }
    res.status(200).json({
      foto_id: id,
      titulo,
      imagen,
      id_usuario
    });
  } catch (error) {
    console.error('Error al actualizar el evento:', error);
    res.status(500).json({ message: 'Error al actualizar el evento' });
  }
};


const  getFotosbyId = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM fotos WHERE foto_id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Foto no encontrada' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error al obtener la Foto:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
  module.exports = {

    getFotos,
    postFoto,
    deleteFoto,
    getFotosbyId,
    updateFoto,
    getFotosporfecha

};
