const express = require('express');
const router = express.Router();
const checadorController = require('../controllers/checadorControllers');

router.post('/checador/entrada', checadorController.registrarEntrada);
router.post('/checador/salida', checadorController.registrarSalida);
router.get('/checador/historial', checadorController.obtenerHistorial);
router.get('/checador/historial/:id', checadorController.obtenerPorId);
router.put('/checador/:id', checadorController.actualizarRegistro);
router.delete('/checador/:id', checadorController.eliminarRegistro);

module.exports = router;
