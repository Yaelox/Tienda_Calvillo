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


  const postFoto= async (req, res) => {
    const { titulo,imagen,  id_usuario} = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO fotos (titulo,foto,  id_usuario) VALUES (?,?,?)',
        [titulo,imagen, id_usuario]
      );
      res.status(201).json({
        foto_id : result.insertId,
        titulo,imagen, id_usuario
      });
    } catch (error) {
      console.error('Error al crear el Poster:', error);
      res.status(500).json({ message: 'Error al crear el Poster' });
    }
  };


  module.exports = {

    getFotos,
    postFoto
};
