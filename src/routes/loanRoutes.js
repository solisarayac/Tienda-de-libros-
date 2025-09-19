const express = require('express');
const router = express.Router();

// Rutas de préstamos (las implementaremos después)
router.get('/', (req, res) => {
    res.json({ message: 'Get loans endpoint' });
});

router.post('/', (req, res) => {
    res.json({ message: 'Create loan endpoint' });
});

module.exports = router;