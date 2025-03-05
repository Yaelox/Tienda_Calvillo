// routes/compras.js
const express = require('express');
const router = express.Router();
const comprasController = require('../controllers/comprasControllers');

// Ruta para registrar una compra
router.post('/compras', comprasController.registrarCompra);
router.get('/compras',comprasController.getCompras);
router.get('/compras/:id',comprasController.getComprasById)
router.put('/compras/:id',comprasController.actualizarEstadoCompra);
router.delete('/compras/:id',comprasController.eliminarCompra)

module.exports = router;
