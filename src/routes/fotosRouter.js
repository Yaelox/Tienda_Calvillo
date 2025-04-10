const express = require('express');
const router = express.Router();
const fotoController = require('../controllers/fotosControllers');

router.post('/foto',fotoController.postFoto);
router.get('/foto', fotoController.getFotos);

module.exports = router;
