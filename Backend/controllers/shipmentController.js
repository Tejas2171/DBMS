const Shipment = require('../models/Shipment');

exports.createShipment = async (req, res) => {
    try {
        const shipment = await Shipment.create(req.body);
        res.status(201).json(shipment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllShipments = async (req, res) => {
    try {
        const shipments = await Shipment.findAll();
        res.status(200).json(shipments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getShipmentById = async (req, res) => {
    try {
        const shipment = await Shipment.findByPk(req.params.id);
        if (shipment) {
            res.status(200).json(shipment);
        } else {
            res.status(404).json({ error: 'Shipment not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateShipment = async (req, res) => {
    try {
        const [updated] = await Shipment.update(req.body, {
            where: { shipment_id: req.params.id },
        });
        if (updated) {
            const updatedShipment = await Shipment.findByPk(req.params.id);
            res.status(200).json(updatedShipment);
        } else {
            res.status(404).json({ error: 'Shipment not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteShipment = async (req, res) => {
    try {
        const deleted = await Shipment.destroy({
            where: { shipment_id: req.params.id },
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Shipment not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
