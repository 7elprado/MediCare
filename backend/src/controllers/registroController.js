const db = require('../config/database');

const registroController = {
  async listar(req, res) {
    try {
      const result = await db.query(`
        SELECT r.*, m.nome as medicamento_nome, m.dosagem, h.horario
        FROM registros r
        JOIN medicamentos m ON r.medicamento_id = m.id
        LEFT JOIN horarios h ON r.horario_id = h.id
        ORDER BY r.data_hora_tomada DESC LIMIT 100
      `);
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao listar registros:', error);
      res.json([]);
    }
  },

  async getHoje(req, res) {
    try {
      const result = await db.query(`
        SELECT r.*, m.nome as medicamento_nome, m.dosagem, h.horario,
               m.pilulas_restantes, m.pilulas_por_cartela
        FROM registros r
        JOIN medicamentos m ON r.medicamento_id = m.id
        LEFT JOIN horarios h ON r.horario_id = h.id
        WHERE DATE(r.data_hora_tomada) = CURRENT_DATE
        ORDER BY r.data_hora_tomada DESC
      `);
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao buscar registros de hoje:', error);
      res.json([]);
    }
  },

  async registrar(req, res) {
    const { medicamento_id, horario_id, data_hora_tomada } = req.body;
    
    if (!medicamento_id) {
      return res.status(400).json({ error: 'ID do medicamento é obrigatório' });
    }
    
    try {
      // Buscar medicamento
      const medicamento = await db.query(
        'SELECT id, nome, total_pilulas, pilulas_restantes, pilulas_por_cartela FROM medicamentos WHERE id = $1',
        [medicamento_id]
      );
      
      if (medicamento.rows.length === 0) {
        return res.status(404).json({ error: 'Medicamento não encontrado' });
      }
      
      if (medicamento.rows[0].total_pilulas <= 0) {
        return res.status(400).json({ error: 'Estoque insuficiente' });
      }

      // Verificar se já registrou esta dose hoje (se tiver horario_id)
      if (horario_id) {
        const existe = await db.query(
          `SELECT * FROM registros 
           WHERE medicamento_id = $1 AND horario_id = $2 
           AND DATE(data_hora_tomada) = CURRENT_DATE`,
          [medicamento_id, horario_id]
        );
        
        if (existe.rows.length > 0) {
          return res.status(400).json({ error: 'Dose já registrada hoje' });
        }
      }
      
      // Registrar a tomada
      const result = await db.query(
        `INSERT INTO registros (medicamento_id, horario_id, data_hora_tomada, status) 
         VALUES ($1, $2, COALESCE($3, CURRENT_TIMESTAMP), 'tomado') 
         RETURNING *`,
        [medicamento_id, horario_id, data_hora_tomada]
      );
      
      // Atualizar estoque
      const novoEstoque = medicamento.rows[0].total_pilulas - 1;
      await db.query(
        `UPDATE medicamentos 
         SET total_pilulas = $1, pilulas_restantes = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [novoEstoque, medicamento_id]
      );
      
      res.status(201).json({ 
        ...result.rows[0], 
        medicamento_nome: medicamento.rows[0].nome,
        estoque_restante: novoEstoque
      });
      
    } catch (error) {
      console.error('Erro ao registrar tomada:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = registroController;
