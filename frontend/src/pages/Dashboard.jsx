import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Dashboard = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [horariosHoje, setHorariosHoje] = useState([]);
  const [registrosHoje, setRegistrosHoje] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState('todos');
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalItems, setModalItems] = useState([]);
  const [horariosFuturos, setHorariosFuturos] = useState([]);
  const [notificacoes, setNotificacoes] = useState([]);
  const [showNotificacao, setShowNotificacao] = useState(false);
  const [estatisticasAvancadas, setEstatisticasAvancadas] = useState({
    adesaoSemanal: [],
    medicamentosMaisTomados: [],
    horarioMaisComum: '',
    streakAtual: 0,
    melhorDiaSemana: ''
  });

  // Efeito para buscar notificações a cada 30 segundos
  useEffect(() => {
    const buscarNotificacoes = async () => {
      try {
        const response = await api.get('/alertas/pendentes');
        if (response.data && response.data.length > 0) {
          setNotificacoes(response.data);
          setShowNotificacao(true);
          setTimeout(() => setShowNotificacao(false), 8000);
        }
      } catch (error) {
        console.error('Erro ao buscar notificações:', error);
      }
    };
    
    buscarNotificacoes();
    const interval = setInterval(buscarNotificacoes, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    carregarTodosDados();
    const interval = setInterval(carregarTodosDados, 30000);
    return () => clearInterval(interval);
  }, []);

  const carregarTodosDados = async () => {
    try {
      const [medRes, horariosRes, registrosRes, futuroRes] = await Promise.all([
        api.get('/medicamentos'),
        api.get('/horarios/hoje'),
        api.get('/registros/hoje'),
        api.get('/horarios/proximos')
      ]);
      
      setMedicamentos(medRes.data || []);
      setHorariosHoje(horariosRes.data || []);
      setRegistrosHoje(registrosRes.data || []);
      setHorariosFuturos(futuroRes.data || []);
      
      calcularEstatisticasAvancadas(registrosRes.data || [], medicamentos);
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setCarregando(false);
    }
  };

  // Função para calcular estatísticas avançadas
  const calcularEstatisticasAvancadas = (registros, meds) => {
    // Calcular adesão semanal
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const adesaoPorDia = diasSemana.map((dia, i) => {
      const registrosDia = registros.filter(r => new Date(r.data_hora_tomada).getDay() === i);
      return {
        dia,
        total: registrosDia.length,
        percentual: Math.min(100, Math.round((registrosDia.length / (registros.length || 1)) * 100))
      };
    });
    
    // Calcular medicamentos mais tomados
    const medCount = {};
    registros.forEach(r => {
      const med = meds.find(m => m.id === r.medicamento_id);
      if (med) medCount[med.nome] = (medCount[med.nome] || 0) + 1;
    });
    const maisTomados = Object.entries(medCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([nome, qtd]) => ({ nome, qtd }));
    
    setEstatisticasAvancadas({
      adesaoSemanal: adesaoPorDia,
      medicamentosMaisTomados: maisTomados,
      horarioMaisComum: calcularHorarioMaisComum(registros),
      streakAtual: calcularStreak(registros),
      melhorDiaSemana: calcularMelhorDia(registros)
    });
  };

  const calcularHorarioMaisComum = (registros) => {
    const horas = {};
    registros.forEach(r => {
      const hora = new Date(r.data_hora_tomada).getHours();
      horas[hora] = (horas[hora] || 0) + 1;
    });
    const horaMaisComum = Object.entries(horas).sort((a, b) => b[1] - a[1])[0];
    return horaMaisComum ? `${horaMaisComum[0]}:00` : 'N/A';
  };

  const calcularStreak = (registros) => {
    const diasUnicos = [...new Set(registros.map(r => new Date(r.data_hora_tomada).toDateString()))];
    return diasUnicos.length;
  };

  const calcularMelhorDia = (registros) => {
    const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const contagem = [0, 0, 0, 0, 0, 0, 0];
    registros.forEach(r => {
      const dia = new Date(r.data_hora_tomada).getDay();
      contagem[dia]++;
    });
    const melhorIndice = contagem.indexOf(Math.max(...contagem));
    return dias[melhorIndice];
  };

  const registrarTomada = async (horarioId, medicamentoId, horarioStr) => {
    const jaTomou = registrosHoje.some(r => r.horario_id === horarioId);
    
    if (jaTomou) {
      alert(`⚠️ Você já registrou a dose das ${horarioStr}!`);
      return;
    }

    const med = medicamentos.find(m => m.id === medicamentoId);
    if (med?.pilulas_restantes <= 0) {
      alert(`⚠️ Estoque esgotado de ${med.nome}! Compre mais.`);
      return;
    }

    try {
      await api.post('/registros', { 
        horario_id: horarioId,
        medicamento_id: medicamentoId,
        data_hora_tomada: new Date().toISOString()
      });
      
      const novaQuantidade = med.pilulas_restantes - 1;
      alert(`✅ Dose das ${horarioStr} registrada! Restam ${novaQuantidade} ${med.tipo_embalagem === 'frasco' ? 'ml' : 'comprimidos'}.`);
      carregarTodosDados();
      
    } catch (error) {
      alert('❌ Erro ao registrar tomada');
    }
  };

  const comprarMedicamento = async (med) => {
    const qtdPorEmbalagem = med.quantidade_por_embalagem || med.pilulas_por_cartela || 10;
    const novaQuantidade = med.pilulas_restantes + qtdPorEmbalagem;
    try {
      await api.put(`/medicamentos/${med.id}`, { 
        pilulas_restantes: novaQuantidade,
        numero_embalagens: (med.numero_embalagens || 1) + 1
      });
      alert(`✅ Compra registrada! Agora você tem ${novaQuantidade} ${med.tipo_embalagem === 'frasco' ? 'ml' : 'comprimidos'}.`);
      carregarTodosDados();
    } catch (error) {
      alert('❌ Erro ao registrar compra');
    }
  };

  const mostrarDetalhesMedicamentos = () => {
    setModalTitle('💊 Todos os Medicamentos');
    setModalItems(medicamentos.map(med => ({
      label: med.nome,
      value: `${med.dosagem} - ${med.descricao || 'Sem descrição'} | Estoque: ${med.pilulas_restantes}/${med.pilulas_por_cartela || med.quantidade_por_embalagem} ${med.tipo_embalagem === 'frasco' ? 'ml' : 'comp'}`
    })));
    setShowModal(true);
  };

  const mostrarDosesTomadas = () => {
    const tomadas = registrosHoje.map(reg => {
      const med = medicamentos.find(m => m.id === reg.medicamento_id);
      const horario = horariosHoje.find(h => h.id === reg.horario_id);
      return {
        label: med?.nome || 'Desconhecido',
        value: `Tomado às ${new Date(reg.data_hora_tomada).toLocaleTimeString()} - Dose das ${horario?.horario?.substring(0,5) || 'horário desconhecido'}`
      };
    });
    setModalTitle('✅ Doses Tomadas Hoje');
    setModalItems(tomadas);
    setShowModal(true);
  };

  const mostrarDosesPendentes = () => {
    const pendentes = horariosHoje.filter(h => !registrosHoje.some(r => r.horario_id === h.id));
    const pendentesList = pendentes.map(h => {
      const med = medicamentos.find(m => m.id === h.medicamento_id);
      const tempoRestante = calcularTempoRestante(h.horario);
      return {
        label: med?.nome || 'Desconhecido',
        value: `Horário: ${h.horario?.substring(0,5)} | ${tempoRestante} | ${med?.dosagem || ''}`
      };
    });
    setModalTitle(`⏰ Doses Pendentes (${pendentesList.length})`);
    setModalItems(pendentesList);
    setShowModal(true);
  };

  const mostrarDetalhesCompletos = (med) => {
    const detalhes = [
      { label: '💊 Nome', value: med.nome },
      { label: '📦 Dosagem', value: med.dosagem || 'Não informado' },
      { label: '🏭 Fabricante', value: med.fabricante || 'Não informado' },
      { label: '🔬 Princípio Ativo', value: med.principio_ativo || 'Não informado' },
      { label: '📦 Tipo Embalagem', value: med.tipo_embalagem || 'Cartela' },
      { label: '💊 Quantidade por Embalagem', value: `${med.quantidade_por_embalagem || med.pilulas_por_cartela} ${med.tipo_embalagem === 'frasco' ? 'ml' : 'unidades'}` },
      { label: '📦 Embalagens em Estoque', value: med.numero_embalagens || 1 },
      { label: '📦 Total em Estoque', value: `${med.pilulas_restantes} ${med.tipo_embalagem === 'frasco' ? 'ml' : 'unidades'}` },
      { label: '⚠️ Estoque Mínimo', value: `${med.estoque_minimo || med.estoque_minimo_pilulas || 5} unidades` },
      { label: '📋 Descrição', value: med.descricao || 'Não informado' },
      { label: '📄 Bula', value: med.bula || 'Não informado' },
      { label: '⚠️ Cuidados', value: med.cuidados || 'Não informado' },
      { label: '🚫 Contraindicações', value: med.contraindicacoes || 'Não informado' },
      { label: '⚠️ Interações', value: med.interacoes || 'Não informado' },
      { label: '🏷️ Lote', value: med.lote || 'Não informado' },
      { label: '📅 Validade', value: med.data_validade ? new Date(med.data_validade).toLocaleDateString() : 'Não informado' }
    ];
    setModalTitle(`📋 Informações Completas - ${med.nome}`);
    setModalItems(detalhes);
    setShowModal(true);
  };

  const calcularTempoRestante = (horarioStr) => {
    if (!horarioStr) return 'Horário não definido';
    const agora = new Date();
    const [horas, minutos] = horarioStr.split(':');
    const horarioDate = new Date();
    horarioDate.setHours(parseInt(horas), parseInt(minutos), 0);
    const diff = horarioDate - agora;
    if (diff < 0) return 'Já passou';
    const horasRest = Math.floor(diff / 3600000);
    const minutosRest = Math.floor((diff % 3600000) / 60000);
    return `${horasRest}h ${minutosRest}min`;
  };

  const agruparHorariosPorMedicamento = () => {
    const grupos = {};
    horariosHoje.forEach(horario => {
      if (!grupos[horario.medicamento_id]) {
        grupos[horario.medicamento_id] = [];
      }
      grupos[horario.medicamento_id].push(horario);
    });
    return grupos;
  };

  const horariosPorMedicamento = agruparHorariosPorMedicamento();
  const dosesTomadas = registrosHoje.length;
  const totalDoses = horariosHoje.length;
  const dosesPendentes = totalDoses - dosesTomadas;
  const taxaAdesao = totalDoses > 0 ? Math.round((dosesTomadas / totalDoses) * 100) : 0;
  const estoqueCritico = medicamentos.filter(m => m.pilulas_restantes <= (m.estoque_minimo || m.estoque_minimo_pilulas || 5));

  if (carregando) {
    return <div className="loading">🔄 Carregando dados...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modalTitle}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {modalItems.length === 0 ? (
                <p>Nenhum item encontrado</p>
              ) : (
                modalItems.map((item, i) => (
                  <div key={i} className="modal-info-item">
                    <strong>{item.label}:</strong>
                    <span>{item.value}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICAÇÃO FLUTUANTE DE MEDICAMENTOS */}
      {showNotificacao && notificacoes.length > 0 && (
        <div className="toast-notification">
          <div className="toast-header">
            <span>🔔 Lembrete de Medicamento!</span>
            <button onClick={() => setShowNotificacao(false)}>×</button>
          </div>
          <div className="toast-body">
            {notificacoes.slice(0, 3).map(alerta => (
              <div key={alerta.id} className="toast-item">
                <div>
                  <strong>💊 {alerta.medicamento_nome}</strong>
                  <br />
                  <small>⏰ Horário: {alerta.horario?.substring(0,5)}</small>
                  <br />
                  <small>🔔 Está na hora de tomar seu medicamento!</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="dashboard-header">
        <h1>📊 Dashboard de Saúde</h1>
        <p className="saudacao">🌟 Continue cuidando da sua saúde!</p>
        {taxaAdesao > 0 && (
          <div className="taxa-adesao-destaque">
            <span className="taxa-valor">{taxaAdesao}%</span>
            <span className="taxa-label">de adesão hoje</span>
          </div>
        )}
      </div>

      {/* Cards de Estatísticas CLICÁVEIS */}
      <div className="stats-grid">
        <div className="stat-card clickable" onClick={mostrarDetalhesMedicamentos}>
          <div className="stat-icon">💊</div>
          <div className="stat-value">{medicamentos.length}</div>
          <div className="stat-label">Medicamentos</div>
          <div className="stat-detail">Clique para ver todos</div>
        </div>
        
        <div className="stat-card clickable" onClick={mostrarDosesTomadas}>
          <div className="stat-icon">✅</div>
          <div className="stat-value">{dosesTomadas}</div>
          <div className="stat-label">Doses Tomadas</div>
          <div className="stat-detail">de {totalDoses} doses hoje</div>
        </div>
        
        <div className="stat-card clickable" onClick={mostrarDosesPendentes}>
          <div className="stat-icon">⏰</div>
          <div className="stat-value">{dosesPendentes}</div>
          <div className="stat-label">Doses Pendentes</div>
          <div className="stat-detail">Clique para ver detalhes</div>
        </div>
      </div>

      {/* Estatísticas Avançadas */}
      <div className="stats-avancadas">
        <div className="stat-avancada">
          <span className="stat-avancada-icon">🔥</span>
          <div className="stat-avancada-info">
            <span className="stat-avancada-valor">{estatisticasAvancadas.streakAtual}</span>
            <span className="stat-avancada-label">dias consecutivos</span>
          </div>
        </div>
        <div className="stat-avancada">
          <span className="stat-avancada-icon">⭐</span>
          <div className="stat-avancada-info">
            <span className="stat-avancada-valor">{estatisticasAvancadas.horarioMaisComum}</span>
            <span className="stat-avancada-label">horário mais comum</span>
          </div>
        </div>
        <div className="stat-avancada">
          <span className="stat-avancada-icon">📅</span>
          <div className="stat-avancada-info">
            <span className="stat-avancada-valor">{estatisticasAvancadas.melhorDiaSemana}</span>
            <span className="stat-avancada-label">melhor dia</span>
          </div>
        </div>
      </div>

      {/* Medicamentos Mais Tomados */}
      {estatisticasAvancadas.medicamentosMaisTomados.length > 0 && (
        <div className="top-medicamentos">
          <h3>🏆 Top Medicamentos Mais Tomados</h3>
          <div className="top-lista">
            {estatisticasAvancadas.medicamentosMaisTomados.map((med, i) => (
              <div key={i} className="top-item">
                <span className="top-posicao">{i + 1}º</span>
                <span className="top-nome">{med.nome}</span>
                <span className="top-qtd">{med.qtd} doses</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gráfico de Adesão Semanal */}
      <div className="graph-section">
        <h3>📊 Adesão Semanal</h3>
        <div className="graph-bars">
          {estatisticasAvancadas.adesaoSemanal.map((dia, i) => (
            <div key={i} className="graph-bar-container">
              <div className="graph-bar" style={{height: `${dia.percentual}%`}}>
                <span className="graph-value">{dia.percentual}%</span>
              </div>
              <div className="graph-label">{dia.dia}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Alertas de Estoque Crítico */}
      {estoqueCritico.length > 0 && (
        <div className="alertas-container">
          <h3>⚠️ Alertas de Estoque Crítico</h3>
          {estoqueCritico.map(med => (
            <div key={med.id} className="alerta-item">
              <div className="alerta-info">
                <span>💊 {med.nome} - Restam apenas {med.pilulas_restantes} {med.tipo_embalagem === 'frasco' ? 'ml' : 'comprimidos'}</span>
                <button className="btn-comprar" onClick={() => comprarMedicamento(med)}>
                  ➕ Comprar Agora
                </button>
              </div>
              <div className="progress-bar-small">
                <div className="progress-fill-small danger" style={{ width: `${Math.min(100, (med.pilulas_restantes / (med.pilulas_por_cartela || med.quantidade_por_embalagem || 10)) * 100)}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Próximos Horários Futuros */}
      {horariosFuturos.length > 0 && (
        <div className="proximos-horarios">
          <h3>⏰ Próximos Horários (Próximas 24h)</h3>
          <div className="proximos-lista">
            {horariosFuturos.slice(0, 5).map(horario => {
              const med = medicamentos.find(m => m.id === horario.medicamento_id);
              const jaTomou = registrosHoje.some(r => r.horario_id === horario.id);
              return (
                <div key={horario.id} className="proximo-item">
                  <span className="proximo-horario">⏰ {horario.horario?.substring(0,5)}</span>
                  <span className="proximo-medicamento">{med?.nome}</span>
                  <span className="proximo-tempo">{calcularTempoRestante(horario.horario)}</span>
                  {!jaTomou && (
                    <button 
                      className="btn-proximo" 
                      onClick={() => registrarTomada(horario.id, med?.id, horario.horario?.substring(0,5))}
                    >
                      Registrar
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tabs de Filtro */}
      <div className="tabs-container">
        <div className="tabs">
          <button className={`tab ${filtro === 'todos' ? 'active' : ''}`} onClick={() => setFiltro('todos')}>
            📋 Todos os Medicamentos
          </button>
          <button className={`tab ${filtro === 'pendentes' ? 'active' : ''}`} onClick={() => setFiltro('pendentes')}>
            ⏰ Pendentes ({dosesPendentes})
          </button>
          <button className={`tab ${filtro === 'concluidos' ? 'active' : ''}`} onClick={() => setFiltro('concluidos')}>
            ✅ Concluídos ({dosesTomadas})
          </button>
        </div>

        {/* Lista de Medicamentos */}
        <div className="medicamentos-lista">
          {medicamentos.length === 0 ? (
            <div className="empty-state">
              <p>📭 Nenhum medicamento cadastrado</p>
              <button className="btn-primary" onClick={() => window.location.href = '/medicamentos'}>
                + Cadastrar medicamento
              </button>
            </div>
          ) : (
            medicamentos.map(med => {
              const horariosDoMed = horariosPorMedicamento[med.id] || [];
              const registrosDoMed = registrosHoje.filter(r => r.medicamento_id === med.id);
              const pendentes = horariosDoMed.filter(h => !registrosHoje.some(r => r.horario_id === h.id));
              const qtdPorEmbalagem = med.quantidade_por_embalagem || med.pilulas_por_cartela || 10;
              const percentualEstoque = Math.min(100, (med.pilulas_restantes / qtdPorEmbalagem) * 100);
              const estoqueBaixo = med.pilulas_restantes <= (med.estoque_minimo || med.estoque_minimo_pilulas || 5);
              const percentualDoses = horariosDoMed.length > 0 ? (registrosDoMed.length / horariosDoMed.length) * 100 : 0;
              const todasTomadas = registrosDoMed.length === horariosDoMed.length && horariosDoMed.length > 0;
              
              let mostrar = true;
              if (filtro === 'pendentes') mostrar = pendentes.length > 0;
              if (filtro === 'concluidos') mostrar = todasTomadas;
              
              if (!mostrar) return null;
              
              return (
                <div key={med.id} className={`medicamento-card-expanded ${estoqueBaixo ? 'estoque-baixo' : ''} ${todasTomadas ? 'completo' : ''}`}>
                  <div className="medicamento-header-expanded">
                    <div className="medicamento-status">{todasTomadas ? '✅' : '⏰'}</div>
                    <div className="medicamento-info-expanded">
                      <div className="medicamento-titulo">
                        <h4>💊 {med.nome}</h4>
                        <button className="btn-info" onClick={() => mostrarDetalhesCompletos(med)}>
                          📋 Ver todas informações
                        </button>
                      </div>
                      <p className="medicamento-detalhes">
                        {med.dosagem} | {med.fabricante || 'Fabricante não informado'}
                      </p>
                      <p className="medicamento-descricao">{med.descricao}</p>
                      
                      {/* Estoque com barra de progresso */}
                      <div className="estoque-info">
                        <div className="estoque-texto">
                          <span>📦 Estoque: {med.pilulas_restantes} {med.tipo_embalagem === 'frasco' ? 'ml' : 'comprimidos'}</span>
                          {estoqueBaixo && <span className="estoque-baixo-texto">⚠️ Estoque Baixo!</span>}
                          {med.numero_embalagens && (
                            <span className="estoque-embalagens">{med.numero_embalagens} {med.tipo_embalagem || 'embalagem(ens)'}</span>
                          )}
                        </div>
                        <div className="progress-bar-small">
                          <div className={`progress-fill-small ${estoqueBaixo ? 'danger' : ''}`} style={{ width: `${percentualEstoque}%` }}></div>
                        </div>
                        {estoqueBaixo && (
                          <button className="btn-comprar-pequeno" onClick={() => comprarMedicamento(med)}>
                            ➕ Comprar mais {med.tipo_embalagem === 'frasco' ? 'ml' : 'comprimidos'}
                          </button>
                        )}
                      </div>
                      
                      {/* Progresso de Doses do Dia */}
                      {horariosDoMed.length > 0 && (
                        <div className="progresso-doses">
                          <span>📊 Progresso hoje: {registrosDoMed.length}/{horariosDoMed.length} doses</span>
                          <div className="progress-bar-small">
                            <div className="progress-fill-small" style={{ width: `${percentualDoses}%` }}></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Horários do Medicamento (Múltiplas Doses) */}
                  {horariosDoMed.length > 0 && (
                    <div className="horarios-do-dia">
                      <div className="horarios-label">
                        ⏰ Horários de hoje ({horariosDoMed.length} doses no total):
                      </div>
                      <div className="horarios-grid">
                        {horariosDoMed.map(horario => {
                          const jaTomou = registrosHoje.some(r => r.horario_id === horario.id);
                          const tempoRestante = calcularTempoRestante(horario.horario);
                          return (
                            <div key={horario.id} className={`horario-dose ${jaTomou ? 'tomada' : 'pendente'}`}>
                              <div className="dose-info">
                                <span className="dose-horario">⏰ {horario.horario?.substring(0,5)}</span>
                                <span className="dose-status">{jaTomou ? '✅ Dose tomada' : `⏳ Pendente (${tempoRestante})`}</span>
                              </div>
                              {!jaTomou && (
                                <button 
                                  onClick={() => registrarTomada(horario.id, med.id, horario.horario?.substring(0,5))}
                                  className="btn-dose"
                                  disabled={estoqueBaixo && med.pilulas_restantes <= 0}
                                >
                                  💊 Registrar Dose
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;