const express = require('express');
const router = express.Router();
const alertaController = require('../controllers/alertaController');

router.get('/pendentes', alertaController.getPendentes);
router.post('/verificar', alertaController.verificar);

module.exports = router;
