const Review = require('../models/Review');

exports.createReview = async (req, res) => {
    try {
        const review = await Review.create(req.body);
        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll();
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getReviewById = async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);
        if (review) {
            res.status(200).json(review);
        } else {
            res.status(404).json({ error: 'Review not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateReview = async (req, res) => {
    try {
        const [updated] = await Review.update(req.body, {
            where: { review_id: req.params.id },
        });
        if (updated) {
            const updatedReview = await Review.findByPk(req.params.id);
            res.status(200).json(updatedReview);
        } else {
            res.status(404).json({ error: 'Review not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const deleted = await Review.destroy({
            where: { review_id: req.params.id },
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Review not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
