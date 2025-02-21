// routes/compras.js
const express = require('express');
const router = express.Router();
const comprasdetallesController = require('../controllers/compras-detallesControllers');

// Ruta para registrar una compra
router.post('/detalles',comprasdetallesController.registrarCompraDetalle);
router.get('/detalles',comprasdetallesController.getCompraDetalles);
router.get('/detalles/:id',comprasdetallesController.getCompraDetalleById)
router.put('/detalles/:id',comprasdetallesController.actualizarCompraDetalle);
router.delete('/detalles/:id',comprasdetallesController.eliminarCompraDetalle)

module.exports = router;
