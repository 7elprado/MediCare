const express = require('express');
const router = express.Router();

// Dados de exemplo
let estoque = [
  { medicamento_id: 1, medicamento_nome: 'Paracetamol', quantidade: 5, quantidade_minima: 10 },
  { medicamento_id: 2, medicamento_nome: 'Ibuprofeno', quantidade: 3, quantidade_minima: 10 }
];

router.get('/', (req, res) => {
  res.json(estoque);
});

router.post('/atualizar', (req, res) => {
  const { medicamento_id, quantidade } = req.body;
  const item = estoque.find(e => e.medicamento_id === medicamento_id);
  if (item) {
    item.quantidade = quantidade;
  }
  res.json(item);
});

module.exports = router;