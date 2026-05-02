const db = require('../config/database');

class RelatorioController {
    async getAdesao(req, res) {
        const { dias = 30 } = req.query;
        try {
            const result = await db.query(
                `WITH dias_avaliacao AS (
                    SELECT generate_series(
                        CURRENT_DATE - ($1 || ' days')::INTERVAL,
                        CURRENT_DATE,
                        '1 day'::INTERVAL
                    )::DATE as data
                ),
                tomadas_esperadas AS (
                    SELECT m.id as medicamento_id, m.nome, COUNT(h.id) as total_esperado
                    FROM medicamentos m
                    JOIN horarios h ON m.id = h.medicamento_id
                    WHERE h.ativo = true
                    GROUP BY m.id, m.nome
                ),
                tomadas_realizadas AS (
                    SELECT r.medicamento_id, COUNT(*) as total_realizado
                    FROM registros r
                    WHERE r.data_hora_tomada >= CURRENT_DATE - ($1 || ' days')::INTERVAL
                    GROUP BY r.medicamento_id
                )
                SELECT 
                    te.medicamento_id,
                    te.nome as medicamento,
                    te.total_esperado * $1 as esperado_total,
                    COALESCE(tr.total_realizado, 0) as realizado_total,
                    ROUND(
                        (COALESCE(tr.total_realizado, 0)::DECIMAL / (te.total_esperado * $1) * 100), 
                        2
                    ) as percentual_adesao
                FROM tomadas_esperadas te
                LEFT JOIN tomadas_realizadas tr ON te.medicamento_id = tr.medicamento_id
                ORDER BY percentual_adesao DESC
                `,
                [dias]
            );
            res.json(result.rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getHorariosHoje(req, res) {
        const hoje = new Date();
        const diaSemana = hoje.getDay();
        
        try {
            const result = await db.query(
                `SELECT h.*, m.nome as medicamento_nome, m.dosagem
                 FROM horarios h
                 JOIN medicamentos m ON h.medicamento_id = m.id
                 WHERE h.ativo = true 
                 AND $1 = ANY(h.dias_semana)
                 ORDER BY h.horario`,
                [diaSemana]
            );
            res.json(result.rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new RelatorioController();
