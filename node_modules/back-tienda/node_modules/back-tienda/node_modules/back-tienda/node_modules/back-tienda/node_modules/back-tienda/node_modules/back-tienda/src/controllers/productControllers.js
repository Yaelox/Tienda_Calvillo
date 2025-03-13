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

exports.updateProducto = async (req, res) => {
  try {
    console.log('Datos recibidos en la solicitud:', req.body); // Verifica los datos que recibes
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, categoria_id, imagen } = req.body;

    // Verifica si los datos son correctos
    if (!nombre || !precio || !stock || !categoria_id) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    // Obtén el producto actual
    const producto = await Producto.getProductoById(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Si no se recibe una nueva imagen, mantiene la existente
    const updatedImagen = imagen || producto.imagen;

    // Actualiza el producto con la nueva información
    const updatedProduct = await Producto.updateProducto(id, nombre, descripcion, precio, stock, categoria_id, updatedImagen);

    // Devuelve el producto actualizado
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
