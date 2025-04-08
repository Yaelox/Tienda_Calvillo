const express = require('express');
const router = express.Router();
const rechazoController = require('../controllers/rechazosControllers');

router.post('/rechazo',rechazoController.CreateRechazo);
router.post('/rechazo-repartidores',rechazoController.CreateRechazoRepartidores);

router.get('/rechazo',rechazoController.getRechazos);
router.get('/rechazo-repartidores',rechazoController.getRechazosRepartidores);

router.get('/rechazo/:id',rechazoController.getRechazosById);
router.get('/rechazo-repartidores/:id',rechazoController.getRechazosRepartidoreById)

router.put('/rechazo/:id',rechazoController.updateRechazo);
router.put('/rechazo-repartidores/:id',rechazoController.updateRechazoRepartidores);

router.delete('/rechazo/:id',rechazoController.deleteRechazos);
router.delete('/rechazo-repartidores/:id',rechazoController.deleteRechazosRepartidores);

module.exports = router;
