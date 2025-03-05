const express = require('express');
const posterController = require('../controllers/postControllers');
const router = express.Router();


router.post('/poster', posterController.createPoster);         // Crear producto
router.get('/poster',posterController.getPoster);           // Obtener todos los productos
router.get('/poster/:id', posterController.getPosterById);     // Obtener producto por ID
router.put('/poster/:id', posterController.updatePoster);      // Actualizar producto por ID
router.delete('/poster/:id', posterController.deletePoster);   // Eliminar producto por ID

module.exports = router;