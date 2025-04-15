const express = require('express');
const UBIControllers = require('../controllers/ubicacionControllers');
const router = express.Router();


router.post('/ubi', UBIControllers.PostUbicacion);         // Crear producto
router.get('/ubi',UBIControllers.getUbicaciones); 
router.get('/ubi/motivo',UBIControllers.getMotivosUbicacion);                // Obtener todos los productos   
router.put('/ubi/:id', UBIControllers.updateUbicacion);   
router.put ('/ubicacion/:id', UBIControllers.updatecolor);   // Actualizar producto por ID
router.delete('/ubi/:id',UBIControllers.deleteUbicacion);   // Eliminar producto por ID

module.exports = router;