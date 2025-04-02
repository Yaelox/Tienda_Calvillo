const express = require('express');
const contactoController = require('../controllers/contactoControllers');
const router = express.Router();


router.post('/contacto', contactoController.createContacto);         // Crear producto
router.get('/contacto',contactoController.getContacto);           // Obtener todos los productos
router.get('/contacto/:id', contactoController.getContactoById);     // Obtener producto por ID
router.put('/contacto/:id', contactoController.updateContacto);      // Actualizar producto por ID
router.delete('/contacto/:id', contactoController.deleteContacto);   // Eliminar producto por ID

module.exports = router;