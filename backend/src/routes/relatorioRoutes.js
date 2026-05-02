const express = require('express');
const router = express.Router();
const relatorioController = require('../controllers/relatorioController');

router.get('/adesao', relatorioController.getAdesao);
router.get('/horarios-hoje', relatorioController.getHorariosHoje);

module.exports = router;
