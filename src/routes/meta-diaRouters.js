const express = require('express');
const router = express.Router();
const metaControllers = require('../controllers/meta-diaControllers');

// Ruta para obtener las ventas por zona
router.get('/meta', metaControllers.getMetaDelDia);

module.exports = router;
