
const express = require('express');
const multer = require('multer');
const { reviews } = require('./review');
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

let contracts = [];

router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Invalid file format' });
    const contractId = Date.now().toString();
    contracts.push({
        contractId,
        userId: req.user.id,
        fileName: req.file.originalname,
        filePath: `/uploads/${req.file.originalname}`,
        uploadedAt: new Date(),
        status: 'Pending'
    });
    res.status(201).json({ message: 'Contract uploaded successfully', contractId });
});

router.get('/', (req, res) => {
    const userContracts = contracts.filter(c => c.userId === req.user.id);
    res.json(userContracts);
});

router.delete('/:id', (req, res) => {
    contracts = contracts.filter(c => c.contractId !== req.params.id);
    for (let i = reviews.length - 1; i >= 0; i--) {
        if (reviews[i].contractId === req.params.id) reviews.splice(i, 1);
    }
    res.json({ message: 'Contract deleted successfully' });
});

module.exports = { router, contracts };
