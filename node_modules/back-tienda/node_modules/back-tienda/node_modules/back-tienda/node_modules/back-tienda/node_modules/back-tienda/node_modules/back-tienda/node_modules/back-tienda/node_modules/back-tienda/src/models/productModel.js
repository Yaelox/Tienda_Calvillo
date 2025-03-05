// models/productModel.js
const { pool } = require('../../config/db');

// Obtener todos los productos
const getProductos = async () => {
  try {
    const [productos] = await pool.query('SELECT * FROM productos');
    return productos;
  } catch (error) {
    throw error;
  }
};

// Obtener un producto por ID
const getProductoById = async (id) => {
  try {
    const [producto] = await pool.query('SELECT * FROM productos WHERE id_producto = ?', [id]);
    return producto.length ? producto[0] : null;
  } catch (error) {
    throw error;
  }
};

// Crear un nuevo producto
const createProducto = async (nombre, descripcion, precio, stock, categoria_id, imagen) => {
  try {
    const [result] = await pool.query(
      'INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, imagen) VALUES (?, ?, ?, ?, ?, ?)', 
      [nombre, descripcion, precio, stock, categoria_id, imagen]
    );
    return { id_producto: result.insertId, nombre, descripcion, precio, stock, categoria_id, imagen };
  } catch (error) {
    throw error;
  }
};

// Actualizar un producto
const updateProducto = async (id, nombre, descripcion, precio, stock, categoria_id, imagen) => {
  try {
    await pool.query(
      'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, categoria_id = ?, imagen = ? WHERE id_producto = ?', 
      [nombre, descripcion, precio, stock, categoria_id, imagen, id]
    );
    return { id, nombre, descripcion, precio, stock, categoria_id, imagen };
  } catch (error) {
    throw error;
  }
};

// Eliminar un producto
const deleteProducto = async (id) => {
  try {
    await pool.query('DELETE FROM productos WHERE id_producto = ?', [id]);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto
};
