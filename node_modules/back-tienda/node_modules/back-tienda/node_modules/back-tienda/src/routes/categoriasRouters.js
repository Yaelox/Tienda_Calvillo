const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

router.post('/categoria',categoriaController.createCategoria);
router.get('/categoria', categoriaController.getCategorias);
router.get('/categoria/:id', categoriaController.getCategoriasById);
router.put('/categoria/:id', categoriaController.updateCategoria);
router.delete('/categoria/:id', categoriaController.deleteCategoria);

module.exports = router;
