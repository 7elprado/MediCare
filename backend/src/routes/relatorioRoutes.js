const express = require('express');
const router = express.Router();

router.get('/adesao', (req, res) => {
    res.json({ message: 'Relatório de adesão' });
});

module.exports = router;
