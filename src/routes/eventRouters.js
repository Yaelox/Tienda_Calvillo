const express = require('express');
const eventoController = require('../controllers/eventControllers');
const router = express.Router();


router.post('/evento', eventoController.createEvento);         // Crear producto
router.get('/evento',eventoController.getEventos);           // Obtener todos los productos
router.get('/evento/:id', eventoController.getEventoById);     // Obtener producto por ID
router.put('/evento/:id', eventoController.updateEvento);      // Actualizar producto por ID
router.delete('/evento/:id', eventoController.deleteEvento);   // Eliminar producto por ID

module.exports = router;