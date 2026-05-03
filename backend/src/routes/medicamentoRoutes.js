const express = require('express');
const router = express.Router();
const medicamentoController = require('../controllers/medicamentoController');

router.get('/', medicamentoController.listar);
router.get('/:id', medicamentoController.buscarPorId);
router.post('/', medicamentoController.criar);
router.put('/:id', medicamentoController.atualizar);
router.put('/:id/estoque', medicamentoController.atualizarEstoque);
router.delete('/:id', medicamentoController.deletar);

module.exports = router;
