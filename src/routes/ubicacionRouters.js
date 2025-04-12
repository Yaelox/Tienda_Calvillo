const express = require('express');
const UBIControllers = require('../controllers/ubicacionControllers');
const router = express.Router();


router.post('/ubi', UBIControllers.PostUbicacion);         // Crear producto
router.get('/ubi',UBIControllers.getUbicaciones);           // Obtener todos los productos   
router.put('/ubi/:id', UBIControllers.updateUbicacion);      // Actualizar producto por ID
router.delete('/ubi/:id',UBIControllers.deleteUbicacion);   // Eliminar producto por ID

module.exports = router;