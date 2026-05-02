const db = require('../config/database');

class MedicamentoController {
  async listar(req, res) {
    try {
      const result = await db.query('SELECT * FROM medicamentos ORDER BY id DESC');
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao listar:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async criar(req, res) {
    const { nome, descricao, dosagem } = req.body;
    try {
      const result = await db.query(
        'INSERT INTO medicamentos (nome, descricao, dosagem) VALUES ($1, $2, $3) RETURNING *',
        [nome, descricao, dosagem]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao criar:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async atualizar(req, res) {
    const { id } = req.params;
    const { nome, descricao, dosagem } = req.body;
    try {
      const result = await db.query(
        'UPDATE medicamentos SET nome = $1, descricao = $2, dosagem = $3 WHERE id = $4 RETURNING *',
        [nome, descricao, dosagem, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Medicamento não encontrado' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async deletar(req, res) {
    const { id } = req.params;
    try {
      const result = await db.query('DELETE FROM medicamentos WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Medicamento não encontrado' });
      }
      res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new MedicamentoController();
