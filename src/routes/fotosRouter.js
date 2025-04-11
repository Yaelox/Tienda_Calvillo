const express = require('express');
const router = express.Router();
const fotoController = require('../controllers/fotosControllers');

router.post('/foto',fotoController.postFoto);
router.get('/foto', fotoController.getFotos);
router.get('/foto/:id', fotoController.getFotosbyId);
router.get('/fotos', fotoController.getFotosAgrupadasPorFecha)
router.put('/foto/:id', fotoController.updateFoto);
router.delete('/foto/:id', fotoController.deleteFoto);

module.exports = router;
