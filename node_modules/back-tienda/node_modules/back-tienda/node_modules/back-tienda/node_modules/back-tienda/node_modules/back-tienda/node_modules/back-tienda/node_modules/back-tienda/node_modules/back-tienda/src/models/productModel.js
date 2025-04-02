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

const updateProducto = async (id, nombre, descripcion, precio, stock, categoria_id, imagen) => {
  try {
    // Verifica que al menos algunos de los campos estén presentes
    if (!nombre || !precio || !stock || !categoria_id) {
      throw new Error('Faltan datos obligatorios para actualizar el producto');
    }

    // Si no se recibe una nueva imagen, mantén la imagen anterior (si es que existe)
    if (!imagen) {
      const producto = await pool.query('SELECT imagen FROM productos WHERE id_producto = ?', [id]);
      imagen = producto[0]?.imagen; // Si no se encuentra la imagen, mantén la anterior
    }

    // Ejecuta la actualización del producto en la base de datos
    const result = await pool.query(
      'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, categoria_id = ?, imagen = ? WHERE id_producto = ?',
      [nombre, descripcion, precio, stock, categoria_id, imagen, id]
    );

    if (result.affectedRows === 0) {
      throw new Error('No se actualizó ningún producto. Verifique que el ID sea correcto.');
    }

    // Recupera el producto actualizado desde la base de datos para devolverlo
    const updatedProduct = await pool.query('SELECT * FROM productos WHERE id_producto = ?', [id]);
    
    // Retorna el producto actualizado
    return updatedProduct[0];
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    throw new Error('Error al actualizar el producto: ' + error.message);
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
