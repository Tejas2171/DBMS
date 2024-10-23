const Payment = require('../models/Payment');

exports.createPayment = async (req, res) => {
    try {
        const payment = await Payment.create(req.body);
        res.status(201).json(payment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.findAll();
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findByPk(req.params.id);
        if (payment) {
            res.status(200).json(payment);
        } else {
            res.status(404).json({ error: 'Payment not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePayment = async (req, res) => {
    try {
        const [updated] = await Payment.update(req.body, {
            where: { payment_id: req.params.id },
        });
        if (updated) {
            const updatedPayment = await Payment.findByPk(req.params.id);
            res.status(200).json(updatedPayment);
        } else {
            res.status(404).json({ error: 'Payment not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deletePayment = async (req, res) => {
    try {
        const deleted = await Payment.destroy({
            where: { payment_id: req.params.id },
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Payment not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
