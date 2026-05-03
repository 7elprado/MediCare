import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Notificacao = () => {
  const [proximosHorarios, setProximosHorarios] = useState([]);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    buscarHorarios();
    const interval = setInterval(buscarHorarios, 30000);
    return () => clearInterval(interval);
  }, []);

  const buscarHorarios = async () => {
    try {
      const response = await api.get('/horarios/proximos');
      setProximosHorarios(response.data || []);
      
      if (response.data && response.data.length > 0) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 10000);
      }
    } catch (error) {
      console.error('Erro ao buscar horários:', error);
    }
  };

  return (
    <>
      {showToast && proximosHorarios.length > 0 && (
        <div className="toast-notification">
          <div className="toast-header">
            <span>🔔 Lembrete de Medicamento!</span>
            <button onClick={() => setShowToast(false)}>×</button>
          </div>
          <div className="toast-body">
            {proximosHorarios.slice(0, 3).map(horario => (
              <div key={horario.id} className="toast-item">
                <div>
                  <strong>{horario.medicamento_nome}</strong>
                  <br />
                  <small>{horario.dosagem}</small>
                  <br />
                  <small>Horário: {horario.horario?.substring(0,5)}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="widget-horarios">
        <h3>🔔 Próximos Horários</h3>
        {proximosHorarios.length === 0 ? (
          <p>✅ Nenhum horário próximo</p>
        ) : (
          proximosHorarios.map(horario => (
            <div key={horario.id} className="horario-proximo">
              <span>⏰ {horario.horario?.substring(0,5)}</span>
              <span>{horario.medicamento_nome} - {horario.dosagem}</span>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Notificacao;