const { pool } = require("../../config/db");

// Obtener todos los eventos
const getCategorias = async (req, res) => {
  try {
    const [categorias] = await pool.query('SELECT * FROM categorias');
    res.status(200).json(categorias);
  } catch (error) {
    console.error('Error al obtener las Categorias:', error);
    res.status(500).json({ message: 'Error al obtener las Categorias' });
  }
};

const  getCategoriasById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM categorias WHERE id_categoria = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Categoria no encontrada' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error al obtener las Categorias:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};


const createCategoria= async (req, res) => {
    const { nombre,descripcion } = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO categorias (nombre, descripcion) VALUES (?,?)',
        [nombre, descripcion ]
      );
      res.status(201).json({
        id_categoria: result.insertId,
        nombre, descripcion
      });
    } catch (error) {
      console.error('Error al creaer la Categoria:', error);
      res.status(500).json({ message: 'Error al crear la categoria' });
    }
  };

// Actualizar un evento
const updateCategoria = async (req, res) => {
  const { id } = req.params;
  const { nombre,descripcion } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE categorias SET  nombre=?,descripcion=? WHERE id_categoria = ?',
      [nombre,descripcion, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Categoria no encontrada' });
    }
    res.status(200).json({
      id_categoria: id,
      nombre,descripcion
    });
  } catch (error) {
    console.error('Error al actualizar la Categoria:', error);
    res.status(500).json({ message: 'Error al actualizar la Categoria' });
  }
};


// Eliminar un evento
const deleteCategoria = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM categorias WHERE id_categoria = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Categoria no encontrada' });
    }
    res.status(200).json({ message: 'Categoria Eliminada' });
  } catch (error) {
    console.error('Error al eliminar la Categoria:', error);
    res.status(500).json({ message: 'Error al eliminar la Categoria' });
  }
};

module.exports = {
  deleteCategoria,
  updateCategoria,
  createCategoria,
  getCategorias,
  getCategoriasById
};
