const db = require('../config/database');

class RegistroController {
  async listar(req, res) {
    try {
      const result = await db.query(`
        SELECT r.*, m.nome as medicamento_nome 
        FROM registros r
        JOIN medicamentos m ON r.medicamento_id = m.id
        ORDER BY r.data_hora_tomada DESC
      `);
      res.json(result.rows);
    } catch (error) {
      res.json([]);
    }
  }

  async getHoje(req, res) {
    try {
      const result = await db.query(`
        SELECT r.*, m.nome as medicamento_nome 
        FROM registros r
        JOIN medicamentos m ON r.medicamento_id = m.id
        WHERE DATE(r.data_hora_tomada) = CURRENT_DATE
      `);
      res.json(result.rows);
    } catch (error) {
      res.json([]);
    }
  }

  async registrar(req, res) {
    const { medicamento_id } = req.body;
    try {
      const result = await db.query(
        `INSERT INTO registros (medicamento_id, data_hora_tomada) 
         VALUES ($1, CURRENT_TIMESTAMP) RETURNING *`,
        [medicamento_id]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getEstatisticas(req, res) {
    try {
      const result = await db.query(`
        SELECT 
          COUNT(DISTINCT medicamento_id) as total_tomados,
          COUNT(*) as total_registros
        FROM registros 
        WHERE data_hora_tomada >= CURRENT_DATE - INTERVAL '30 days'
      `);
      res.json(result.rows[0]);
    } catch (error) {
      res.json({ total_tomados: 0, total_registros: 0 });
    }
  }
}

module.exports = new RegistroController();