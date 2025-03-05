const express = require('express');
const UsersController = require('../controllers/usuariosControllers');
const router = express.Router();


router.get('/usuarios',UsersController.getUsers);           // Obtener todos los productos
router.get('/usuarios/:id',UsersController.getUserById);
router.put('/usuarios/:id',UsersController.updateUser);
router.delete('/usuarios/:id',UsersController.deleteUser)


module.exports = router;