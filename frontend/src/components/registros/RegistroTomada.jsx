import React, { useState, useEffect } from 'react';
import registroService from '../../services/registroService';
import relatorioService from '../../services/relatorioService';

const RegistroTomada = () => {
  const [horariosHoje, setHorariosHoje] = useState([]);
  const [registrosHoje, setRegistrosHoje] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [horarios, registros] = await Promise.all([
        relatorioService.getHorariosHoje(),
        registroService.getHoje()
      ]);
      setHorariosHoje(horarios);
      setRegistrosHoje(registros);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrarTomada = async (medicamentoId, horarioId) => {
    try {
      await registroService.registrarTomada({
        medicamento_id: medicamentoId,
        horario_id: horarioId
      });
      await carregarDados();
      alert('✅ Tomada registrada com sucesso!');
    } catch (error) {
      console.error('Erro ao registrar tomada:', error);
      alert('Erro ao registrar tomada');
    }
  };

  const isTomado = (horarioId) => {
    return registrosHoje.some(r => r.horario_id === horarioId);
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="registro-tomada">
      <h3>💊 Medicamentos para Hoje</h3>
      <div className="horarios-hoje">
        {horariosHoje.length === 0 ? (
          <p>Nenhum medicamento agendado para hoje</p>
        ) : (
          horariosHoje.map(horario => {
            const tomado = isTomado(horario.id);
            return (
              <div key={horario.id} className={`tomada-card ${tomado ? 'tomado' : 'pendente'}`}>
                <div className="medicamento-info">
                  <h4>{horario.medicamento_nome}</h4>
                  <p>Dosagem: {horario.dosagem}</p>
                  <p>Horário: <strong>{horario.horario}</strong></p>
                </div>
                {tomado ? (
                  <div className="tomado-badge">✅ Já tomado</div>
                ) : (
                  <button
                    onClick={() => handleRegistrarTomada(horario.medicamento_id, horario.id)}
                    className="btn-tomar"
                  >
                    💊 Registrar Tomada
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RegistroTomada;
