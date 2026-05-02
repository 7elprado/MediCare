const express = require('express');
const router = express.Router();
const horarioController = require('../controllers/horarioController');

router.get('/', horarioController.listar);
router.post('/', horarioController.criar);
router.put('/:id', horarioController.atualizar);
router.delete('/:id', horarioController.deletar);

module.exports = router;
