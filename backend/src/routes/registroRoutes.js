const express = require('express');
const router = express.Router();
const registroController = require('../controllers/registroController');

router.get('/', registroController.listar);
router.get('/hoje', registroController.getHoje);
router.post('/', registroController.registrar);

module.exports = router;
