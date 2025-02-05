const express = require('express');
const TiendaController = require('../controllers/tiendaControllers');
const router = express.Router();


router.get('/tiendas',TiendaController.getTiendas); 
router.get('/tiendas/:id',TiendaController.getTiendasbyId,);          // Obtener todos los productos
router.post('/tiendas',TiendaController.createTienda);
router.put('/tiendas/:id',TiendaController.updateTienda);
router.delete('/tiendas/:id',TiendaController.deleteTienda);


module.exports = router;