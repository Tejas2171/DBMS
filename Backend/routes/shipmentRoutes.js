const express = require('express');
const shipmentController = require('../controllers/shipmentController');
const router = express.Router();

router.post('/', shipmentController.createShipment);
router.get('/', shipmentController.getAllShipments);
router.get('/:id', shipmentController.getShipmentById);
router.put('/:id', shipmentController.updateShipment);
router.delete('/:id', shipmentController.deleteShipment);

module.exports = router;
