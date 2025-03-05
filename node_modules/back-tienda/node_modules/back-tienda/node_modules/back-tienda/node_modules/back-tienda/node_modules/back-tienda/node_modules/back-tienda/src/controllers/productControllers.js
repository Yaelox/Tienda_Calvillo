const { pool } = require('../../config/db');  // Asegúrate de que esta sea la configuración correcta de tu base de datos
// controllers/productControllers.js
const Producto = require('../models/productModel');

// Crear un nuevo producto
exports.createProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, categoria_id, imagen } = req.body;
    const nuevoProducto = await Producto.createProducto(nombre, descripcion, precio, stock, categoria_id, imagen);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ error: 'Error al crear el producto', details: error.message });
  }
};

// Obtener todos los productos
exports.getProductos = async (req, res) => {
  try {
    const productos = await Producto.getProductos();
    res.status(200).json(productos);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ error: 'Error al obtener los productos', details: error.message });
  }
};

// Obtener un producto por ID
exports.getProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.getProductoById(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(producto);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).json({ error: 'Error al obtener el producto', details: error.message });
  }
};

// Actualizar un producto
exports.updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, categoria_id, imagen } = req.body;
    const producto = await Producto.getProductoById(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    const updatedProduct = await Producto.updateProducto(id, nombre, descripcion, precio, stock, categoria_id, imagen);
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ error: 'Error al actualizar el producto', details: error.message });
  }
};

// Eliminar un producto
exports.deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.getProductoById(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    await Producto.deleteProducto(id);
    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ error: 'Error al eliminar el producto', details: error.message });
  }
};
