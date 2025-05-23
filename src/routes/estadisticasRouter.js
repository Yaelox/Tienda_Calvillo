const express = require('express');
const router = express.Router();
const estadisticasController = require('../controllers/estadisticasControllers');


// Ruta para obtener las ventas por mes
router.get('/ventas-mes', estadisticasController.getVentasPorMes);

// Ruta para obtener las ventas por semana
router.get('/ventas-semana', estadisticasController.getVentasPorSemana);

// Ruta para obtener las ventas por año
router.get('/ventas-ano', estadisticasController.getVentasPorAnio);

// Ruta para obtener el producto más vendido
router.get('/producto-mas-vendido', estadisticasController.getProductoMasVendido);

// Ruta para obtener las ventas por día
router.get('/ventas-dia', estadisticasController.getVentasPorDia);


module.exports = router;
