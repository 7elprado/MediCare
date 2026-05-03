const db = require('../config/database');

const medicamentoController = {
  async listar(req, res) {
    try {
      const result = await db.query('SELECT * FROM medicamentos ORDER BY id DESC');
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao listar:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async buscarPorId(req, res) {
    const { id } = req.params;
    try {
      const result = await db.query('SELECT * FROM medicamentos WHERE id = $1', [id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Medicamento não encontrado' });
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async criar(req, res) {
    const {
      nome, descricao, dosagem, fabricante, principio_ativo,
      tipo_embalagem, quantidade_por_embalagem, numero_embalagens,
      total_pilulas, estoque_minimo_embalagens, estoque_minimo_pilulas,
      lote, data_validade, bula, cuidados, contraindicacoes, interacoes
    } = req.body;

    try {
      const qtd = quantidade_por_embalagem || 10;
      const numEmb = numero_embalagens || 1;
      const total = total_pilulas || (qtd * numEmb);
      
      const result = await db.query(
        `INSERT INTO medicamentos 
         (nome, descricao, dosagem, fabricante, principio_ativo,
          tipo_embalagem, quantidade_por_embalagem, numero_embalagens,
          total_pilulas, pilulas_restantes, pilulas_por_cartela,
          estoque_minimo_embalagens, estoque_minimo_pilulas,
          lote, data_validade, bula, cuidados, contraindicacoes, interacoes) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) 
         RETURNING *`,
        [nome, descricao, dosagem, fabricante, principio_ativo,
         tipo_embalagem || 'cartela', qtd, numEmb, total, total, qtd,
         estoque_minimo_embalagens || 1, estoque_minimo_pilulas || 5,
         lote, data_validade, bula, cuidados, contraindicacoes, interacoes]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao criar:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async atualizar(req, res) {
    const { id } = req.params;
    const updates = req.body;
    
    try {
      const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 1}`).join(', ');
      const values = [...Object.values(updates), id];
      
      const result = await db.query(
        `UPDATE medicamentos SET ${fields}, updated_at = CURRENT_TIMESTAMP
         WHERE id = $${values.length} RETURNING *`,
        values
      );
      
      if (result.rows.length === 0) return res.status(404).json({ error: 'Medicamento não encontrado' });
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async deletar(req, res) {
    const { id } = req.params;
    try {
      const result = await db.query('DELETE FROM medicamentos WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Medicamento não encontrado' });
      res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async atualizarEstoque(req, res) {
    const { id } = req.params;
    const { operacao, quantidade } = req.body;

    try {
      const med = await db.query('SELECT total_pilulas, pilulas_por_cartela FROM medicamentos WHERE id = $1', [id]);
      if (med.rows.length === 0) return res.status(404).json({ error: 'Medicamento não encontrado' });

      let novoTotal;
      if (operacao === 'usar') {
        if (med.rows[0].total_pilulas < quantidade) {
          return res.status(400).json({ error: 'Estoque insuficiente' });
        }
        novoTotal = med.rows[0].total_pilulas - quantidade;
      } else {
        novoTotal = med.rows[0].total_pilulas + (quantidade * med.rows[0].pilulas_por_cartela);
      }

      const result = await db.query(
        `UPDATE medicamentos 
         SET total_pilulas = $1, pilulas_restantes = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2 RETURNING *`,
        [novoTotal, id]
      );
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = medicamentoController;
