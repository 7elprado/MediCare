const db = require('../config/database');

const alertaController = {
  async getPendentes(req, res) {
    try {
      const result = await db.query(`
        SELECT a.*, m.nome as medicamento_nome, h.horario
        FROM alertas a
        JOIN medicamentos m ON a.medicamento_id = m.id
        JOIN horarios h ON a.horario_id = h.id
        WHERE a.enviado = true AND DATE(a.data_envio) = CURRENT_DATE
        ORDER BY a.data_envio DESC
      `);
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao buscar alertas:', error);
      res.json([]);
    }
  },

  async verificar(req, res) {
    try {
      const agora = new Date();
      const horaAtual = agora.getHours();
      const minutoAtual = agora.getMinutes();
      const diaSemana = agora.getDay();

      const horarios = await db.query(`
        SELECT h.*, m.nome as medicamento_nome, m.dosagem
        FROM horarios h
        JOIN medicamentos m ON h.medicamento_id = m.id
        WHERE h.ativo = true AND $1 = ANY(h.dias_semana)
          AND h.horario BETWEEN ($2::time - interval '15 minutes') AND ($2::time + interval '5 minutes')
      `, [diaSemana, `${horaAtual}:${minutoAtual}:00`]);

      const alertasGerados = [];
      for (const horario of horarios.rows) {
        const jaNotificado = await db.query(
          `SELECT id FROM alertas WHERE horario_id = $1 AND DATE(data_envio) = CURRENT_DATE`,
          [horario.id]
        );
        if (jaNotificado.rows.length === 0) {
          const result = await db.query(
            `INSERT INTO alertas (medicamento_id, horario_id, tipo, enviado, data_envio) 
             VALUES ($1, $2, 'lembrete', true, CURRENT_TIMESTAMP) RETURNING *`,
            [horario.medicamento_id, horario.id]
          );
          alertasGerados.push(result.rows[0]);
          console.log(`🔔 ALERTA: ${horario.medicamento_nome} às ${horario.horario.substring(0,5)}`);
        }
      }
      res.json({ message: 'Verificação concluída', alertas: alertasGerados });
    } catch (error) {
      console.error('Erro ao verificar alertas:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = alertaController;
