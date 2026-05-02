import React, { useState, useEffect } from 'react';
import horarioService from '../../services/horarioService';

const HorariosForm = ({ medicamentoId, onHorarioAdicionado }) => {
  const [horarios, setHorarios] = useState([]);
  const [novoHorario, setNovoHorario] = useState({
    horario: '08:00',
    dias_semana: [1, 2, 3, 4, 5],
    ativo: true
  });
  const [loading, setLoading] = useState(false);

  const diasSemana = [
    { id: 0, nome: 'Domingo' },
    { id: 1, nome: 'Segunda' },
    { id: 2, nome: 'Terça' },
    { id: 3, nome: 'Quarta' },
    { id: 4, nome: 'Quinta' },
    { id: 5, nome: 'Sexta' },
    { id: 6, nome: 'Sábado' }
  ];

  useEffect(() => {
    if (medicamentoId) {
      carregarHorarios();
    }
  }, [medicamentoId]);

  const carregarHorarios = async () => {
    try {
      const data = await horarioService.listar(medicamentoId);
      setHorarios(data);
    } catch (error) {
      console.error('Erro ao carregar horários:', error);
    }
  };

  const handleAddHorario = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await horarioService.criar({
        medicamento_id: medicamentoId,
        ...novoHorario
      });
      setNovoHorario({ horario: '08:00', dias_semana: [1, 2, 3, 4, 5], ativo: true });
      await carregarHorarios();
      if (onHorarioAdicionado) onHorarioAdicionado();
    } catch (error) {
      console.error('Erro ao adicionar horário:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHorario = async (id) => {
    if (window.confirm('Remover este horário?')) {
      try {
        await horarioService.deletar(id);
        await carregarHorarios();
      } catch (error) {
        console.error('Erro ao remover horário:', error);
      }
    }
  };

  const toggleDia = (diaId) => {
    setNovoHorario(prev => ({
      ...prev,
      dias_semana: prev.dias_semana.includes(diaId)
        ? prev.dias_semana.filter(d => d !== diaId)
        : [...prev.dias_semana, diaId]
    }));
  };

  return (
    <div className="horarios-container">
      <h4>Horários do Medicamento</h4>
      
      <form onSubmit={handleAddHorario} className="horario-form">
        <div className="form-row">
          <div className="form-group">
            <label>Horário:</label>
            <input
              type="time"
              value={novoHorario.horario}
              onChange={(e) => setNovoHorario({ ...novoHorario, horario: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Dias da Semana:</label>
            <div className="dias-semana">
              {diasSemana.map(dia => (
                <button
                  key={dia.id}
                  type="button"
                  className={`dia-btn ${novoHorario.dias_semana.includes(dia.id) ? 'active' : ''}`}
                  onClick={() => toggleDia(dia.id)}
                >
                  {dia.nome.substring(0, 3)}
                </button>
              ))}
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Adicionando...' : '+ Adicionar Horário'}
          </button>
        </div>
      </form>

      <div className="horarios-list">
        {horarios.map(horario => (
          <div key={horario.id} className="horario-card">
            <div className="horario-info">
              <strong>{horario.horario}</strong>
              <span className="dias">
                {horario.dias_semana.map(d => {
                  const dia = diasSemana.find(ds => ds.id === d);
                  return dia ? dia.nome.substring(0, 3) : '';
                }).join(', ')}
              </span>
              <span className={`status ${horario.ativo ? 'active' : 'inactive'}`}>
                {horario.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <button onClick={() => handleDeleteHorario(horario.id)} className="btn-danger">
              Remover
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorariosForm;
