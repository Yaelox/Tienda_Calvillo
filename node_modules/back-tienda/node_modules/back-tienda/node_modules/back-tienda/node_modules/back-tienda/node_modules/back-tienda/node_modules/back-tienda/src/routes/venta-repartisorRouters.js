const express = require('express');
const router = express.Router();
const repartidorController = require('../controllers/venta-repartidorControllers');

// Ruta para registrar una compra
router.post('/repartidor', repartidorController.registrarVenta);
router.get('/repartidor',repartidorController.obtenerTodasLasVentas);
router.get('/repartidor/:id',repartidorController.obtenerVentasPorRepartidor)
router.put('/repartidor/:id',repartidorController.actualizarVenta);
router.delete('/repartidor/:id',repartidorController.eliminarVenta)

module.exports = router;
