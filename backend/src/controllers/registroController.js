const db = require('../config/database');

class RegistroController {
    async listar(req, res) {
        const { medicamento_id, data_inicio, data_fim } = req.query;
        try {
            let query = `
                SELECT r.*, m.nome as medicamento_nome, h.horario 
                FROM registros r
                JOIN medicamentos m ON r.medicamento_id = m.id
                LEFT JOIN horarios h ON r.horario_id = h.id
                WHERE 1=1
            `;
            let params = [];
            let paramCount = 1;

            if (medicamento_id) {
                query += ` AND r.medicamento_id = $${paramCount}`;
                params.push(medicamento_id);
                paramCount++;
            }

            if (data_inicio) {
                query += ` AND r.data_hora_tomada >= $${paramCount}`;
                params.push(data_inicio);
                paramCount++;
            }

            if (data_fim) {
                query += ` AND r.data_hora_tomada <= $${paramCount}`;
                params.push(data_fim);
                paramCount++;
            }

            query += ' ORDER BY r.data_hora_tomada DESC';
            
            const result = await db.query(query, params);
            res.json(result.rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async registrarTomada(req, res) {
        const { medicamento_id, horario_id, data_hora_tomada, observacao } = req.body;
        try {
            const result = await db.query(
                `INSERT INTO registros (medicamento_id, horario_id, data_hora_tomada, observacao) 
                 VALUES ($1, $2, COALESCE($3, CURRENT_TIMESTAMP), $4) RETURNING *`,
                [medicamento_id, horario_id, data_hora_tomada, observacao]
            );
            res.status(201).json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getHoje(req, res) {
        try {
            const result = await db.query(
                `SELECT r.*, m.nome as medicamento_nome, h.horario 
                 FROM registros r
                 JOIN medicamentos m ON r.medicamento_id = m.id
                 LEFT JOIN horarios h ON r.horario_id = h.id
                 WHERE DATE(r.data_hora_tomada) = CURRENT_DATE
                 ORDER BY r.data_hora_tomada DESC`
            );
            res.json(result.rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new RegistroController();
