
const express = require('express');
const router = express.Router();

let reviews = [];

router.get('/:id/review', (req, res) => {
    const review = reviews.find(r => r.contractId === req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json(review);
});

router.post('/:id/review', (req, res) => {
    const review = {
        contractId: req.params.id,
        riskScore: 85,
        issues: [
            {
                clause: 'Termination',
                risk: 'Unclear notice period',
                recommendation: 'Specify notice period of at least 30 days.'
            }
        ]
    };
    reviews.push(review);
    res.json(review);
});

module.exports = { router, reviews };
