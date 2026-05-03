const db = require('../config/database');

class AlertaService {
    async verificarHorariosProximos() {
        try {
            const agora = new Date();
            const horaAtual = agora.getHours();
            const minutoAtual = agora.getMinutes();
            const diaSemana = agora.getDay();
            
            console.log(`🔍 Verificando alertas - Data: ${agora.toLocaleString()}`);
            console.log(`🔍 Hora atual: ${horaAtual}:${minutoAtual}`);
            console.log(`🔍 Dia da semana: ${diaSemana} (0=Domingo, 6=Sábado)`);

            // Buscar TODOS os horários ativos
            const todosHorarios = await db.query(`
                SELECT h.*, m.nome as medicamento_nome, m.dosagem,
                       (CASE WHEN $1 = ANY(h.dias_semana) THEN true ELSE false END) as ativo_hoje
                FROM horarios h
                JOIN medicamentos m ON h.medicamento_id = m.id
                WHERE h.ativo = true
                ORDER BY h.horario
            `, [diaSemana]);

            console.log(`📊 Total de horários cadastrados: ${todosHorarios.rows.length}`);
            console.log(`📊 Horários ativos hoje: ${todosHorarios.rows.filter(h => h.ativo_hoje).length}`);

            // Filtrar horários que estão ativos hoje E próximos (até 15 minutos)
            const horariosProximos = todosHorarios.rows.filter(h => {
                if (!h.ativo_hoje) return false;
                
                const [horas, minutos] = h.horario.split(':');
                const horaHorario = parseInt(horas);
                const minutoHorario = parseInt(minutos);
                
                const diffMinutos = (horaHorario * 60 + minutoHorario) - (horaAtual * 60 + minutoAtual);
                return diffMinutos >= -5 && diffMinutos <= 15;
            });

            console.log(`📊 Horários próximos (até 15 min): ${horariosProximos.length}`);

            for (const horario of horariosProximos) {
                // Verificar se já foi notificado hoje
                const jaNotificado = await db.query(
                    `SELECT id FROM alertas 
                     WHERE horario_id = $1 AND DATE(data_envio) = CURRENT_DATE`,
                    [horario.id]
                );

                if (jaNotificado.rows.length === 0) {
                    console.log(`🔔 ALERTA GERADO: ${horario.medicamento_nome} às ${horario.horario.substring(0,5)}`);
                    
                    await db.query(`
                        INSERT INTO alertas (medicamento_id, horario_id, tipo, enviado, data_envio)
                        VALUES ($1, $2, 'lembrete', true, CURRENT_TIMESTAMP)
                    `, [horario.medicamento_id, horario.id]);
                }
            }
            
            return horariosProximos;
        } catch (error) {
            console.error('Erro no serviço de alertas:', error.message);
            return [];
        }
    }
}

module.exports = new AlertaService();
