const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Rota de registros' });
});

router.post('/', (req, res) => {
    res.json({ message: 'Registro criado' });
});

module.exports = router;
