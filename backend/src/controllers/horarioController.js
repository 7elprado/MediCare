const db = require('../config/database');

const horarioController = {
  async listar(req, res) {
    const { medicamento_id } = req.query;
    try {
      let query = 'SELECT * FROM horarios';
      let params = [];
      if (medicamento_id) {
        query += ' WHERE medicamento_id = $1';
        params.push(medicamento_id);
      }
      query += ' ORDER BY horario';
      const result = await db.query(query, params);
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao listar horários:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async getHorariosHoje(req, res) {
    try {
      const diaSemana = new Date().getDay();
      const result = await db.query(`
        SELECT h.*, m.nome as medicamento_nome, m.dosagem, m.pilulas_restantes,
               m.pilulas_por_cartela, m.quantidade_por_embalagem, m.numero_embalagens,
               m.estoque_minimo, m.estoque_minimo_pilulas, m.fabricante, m.descricao,
               m.tipo_embalagem
        FROM horarios h
        JOIN medicamentos m ON h.medicamento_id = m.id
        WHERE h.ativo = true AND $1 = ANY(h.dias_semana)
        ORDER BY m.nome, h.horario
      `, [diaSemana]);
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao buscar horários de hoje:', error);
      res.json([]);
    }
  },

  async getProximosHorarios(req, res) {
    try {
      const agora = new Date();
      const horaAtual = agora.getHours();
      const minutoAtual = agora.getMinutes();
      const diaSemana = agora.getDay();
      
      const result = await db.query(`
        SELECT h.*, m.nome as medicamento_nome, m.dosagem,
               (EXTRACT(EPOCH FROM (h.horario - $2::time)) / 60) as minutos_restantes
        FROM horarios h
        JOIN medicamentos m ON h.medicamento_id = m.id
        WHERE h.ativo = true AND $1 = ANY(h.dias_semana) AND h.horario > $2::time
        ORDER BY h.horario ASC LIMIT 10
      `, [diaSemana, `${horaAtual}:${minutoAtual}:00`]);
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao buscar próximos horários:', error);
      res.json([]);
    }
  },

  async criar(req, res) {
    const { medicamento_id, horario, dias_semana, ativo } = req.body;
    if (!medicamento_id || !horario) {
      return res.status(400).json({ error: 'Medicamento e horário são obrigatórios' });
    }
    try {
      const diasArray = dias_semana || [0, 1, 2, 3, 4, 5, 6];
      const result = await db.query(
        `INSERT INTO horarios (medicamento_id, horario, dias_semana, ativo) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [medicamento_id, horario, diasArray, ativo !== false]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao criar horário:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async atualizar(req, res) {
    const { id } = req.params;
    const { horario, dias_semana, ativo } = req.body;
    try {
      const result = await db.query(
        `UPDATE horarios SET horario = $1, dias_semana = $2, ativo = $3, updated_at = CURRENT_TIMESTAMP
         WHERE id = $4 RETURNING *`,
        [horario, dias_semana, ativo, id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Horário não encontrado' });
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deletar(req, res) {
    const { id } = req.params;
    try {
      const result = await db.query('DELETE FROM horarios WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Horário não encontrado' });
      res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar horário:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = horarioController;
