const express = require('express');
const router = express.Router();
const metaControllers = require('../controllers/meta-diaControllers');

// Ruta para obtener las ventas por zona
router.get('/meta', metaControllers.getMetaDelDia);
router.post('/meta', metaControllers.setMetaDelDia)

module.exports = router;
