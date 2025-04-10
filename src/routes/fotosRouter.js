const express = require('express');
const router = express.Router();
const fotoController = require('../controllers/fotosControllers');

router.post('/foto',fotoController.getFotos);
router.get('/foto', fotoController.postFoto);

module.exports = router;
