const db = require('../config/database');

class HorarioController {
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
            res.status(500).json({ error: error.message });
        }
    }

    async criar(req, res) {
        const { medicamento_id, horario, dias_semana, ativo } = req.body;
        try {
            const result = await db.query(
                'INSERT INTO horarios (medicamento_id, horario, dias_semana, ativo) VALUES ($1, $2, $3, $4) RETURNING *',
                [medicamento_id, horario, dias_semana || '{0,1,2,3,4,5,6}', ativo !== false]
            );
            res.status(201).json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async atualizar(req, res) {
        const { id } = req.params;
        const { horario, dias_semana, ativo } = req.body;
        try {
            const result = await db.query(
                'UPDATE horarios SET horario = $1, dias_semana = $2, ativo = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
                [horario, dias_semana, ativo, id]
            );
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Horário não encontrado' });
            }
            res.json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deletar(req, res) {
        const { id } = req.params;
        try {
            const result = await db.query('DELETE FROM horarios WHERE id = $1 RETURNING *', [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Horário não encontrado' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new HorarioController();
