import React from 'react';

const TimelineHoje = ({ horarios }) => {
    const agora = new Date();
    const horaAtual = agora.getHours();
    const minutoAtual = agora.getMinutes();

    if (!horarios || horarios.length === 0) {
        return (
            <div className="timeline-container">
                <h3>⏰ Linha do Tempo - Hoje</h3>
                <p className="sem-dados">Nenhum horário cadastrado para hoje</p>
            </div>
        );
    }

    return (
        <div className="timeline-container">
            <h3>⏰ Linha do Tempo - Hoje</h3>
            <div className="timeline">
                {horarios.map(horario => {
                    const horaHorario = parseInt(horario.horario.split(':')[0]);
                    const minutoHorario = parseInt(horario.horario.split(':')[1]);
                    const jaPassou = (horaHorario < horaAtual) || 
                        (horaHorario === horaAtual && minutoHorario < minutoAtual);
                    const proximo = (horaHorario === horaAtual && Math.abs(minutoHorario - minutoAtual) <= 30);
                    
                    return (
                        <div key={horario.id} className={`timeline-item ${jaPassou ? 'passado' : ''} ${proximo ? 'proximo' : ''}`}>
                            <div className="timeline-time">
                                <span className="time-icon">⏰</span>
                                {horario.horario.substring(0, 5)}
                            </div>
                            <div className="timeline-content">
                                <strong>{horario.medicamento_nome}</strong>
                                <span className="dosagem">{horario.dosagem}</span>
                                {jaPassou && <span className="badge-passado">✅ Já passou</span>}
                                {proximo && <span className="badge-proximo">🔔 Próximo</span>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TimelineHoje;
