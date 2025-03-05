const express = require('express');
const productosController = require('../controllers/productControllers');
const router = express.Router();

router.post('/products', productosController.createProducto);         // Crear producto
router.get('/products', productosController.getProductos);           // Obtener todos los productos
router.get('/products/:id', productosController.getProductoById);     // Obtener producto por ID
router.put('/products/:id', productosController.updateProducto);      // Actualizar producto por ID
router.delete('/products/:id', productosController.deleteProducto);   // Eliminar producto por ID

module.exports = router;
