import React, { useState, useEffect } from 'react';
import api from '../services/api';

const MedicamentosPage = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [selectedMed, setSelectedMed] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    dosagem: '',
    fabricante: '',
    principio_ativo: '',
    tipo_embalagem: 'cartela',
    quantidade_por_embalagem: 10,
    numero_embalagens: 1,
    total_pilulas: 10,
    estoque_minimo_embalagens: 1,
    estoque_minimo_pilulas: 5,
    lote: '',
    data_validade: '',
    bula: '',
    cuidados: '',
    contraindicacoes: '',
    interacoes: ''
  });
  const [horarios, setHorarios] = useState([]);
  const [novoHorario, setNovoHorario] = useState({
    horario: '08:00',
    dias_semana: [1, 2, 3, 4, 5],
    ativo: true
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('informacoes');

  const diasSemana = [
    { id: 0, nome: 'Domingo', cor: '#e74c3c', abreviado: 'Dom' },
    { id: 1, nome: 'Segunda', cor: '#3498db', abreviado: 'Seg' },
    { id: 2, nome: 'Terça', cor: '#3498db', abreviado: 'Ter' },
    { id: 3, nome: 'Quarta', cor: '#3498db', abreviado: 'Qua' },
    { id: 4, nome: 'Quinta', cor: '#3498db', abreviado: 'Qui' },
    { id: 5, nome: 'Sexta', cor: '#3498db', abreviado: 'Sex' },
    { id: 6, nome: 'Sábado', cor: '#2ecc71', abreviado: 'Sáb' }
  ];

  const tiposEmbalagem = [
    { value: 'cartela', label: '📦 Cartela', unidade: 'comprimidos', icon: '💊' },
    { value: 'frasco', label: '🏺 Frasco', unidade: 'ml', icon: '💧' },
    { value: 'caixa', label: '📦 Caixa', unidade: 'unidades', icon: '📦' },
    { value: 'ampola', label: '💉 Ampola', unidade: 'ml', icon: '💉' },
    { value: 'sache', label: '📄 Sache', unidade: 'g', icon: '📄' }
  ];

  useEffect(() => {
    carregarMedicamentos();
  }, []);

  const carregarMedicamentos = async () => {
    try {
      const response = await api.get('/medicamentos');
      setMedicamentos(response.data);
    } catch (error) {
      console.error('Erro ao carregar medicamentos:', error);
    }
  };

  const carregarHorarios = async (medicamentoId) => {
    try {
      const response = await api.get(`/horarios?medicamento_id=${medicamentoId}`);
      setHorarios(response.data);
    } catch (error) {
      console.error('Erro ao carregar horários:', error);
    }
  };

  const calcularTotais = (tipo, qtdPorEmbalagem, numEmbalagens, pilulasAtuais) => {
    if (tipo === 'cartela') {
      const totalPilulas = qtdPorEmbalagem * numEmbalagens;
      return {
        total_pilulas: totalPilulas,
        embalagens_restantes: numEmbalagens,
        pilulas_restantes: totalPilulas,
        status_estoque: totalPilulas <= 0 ? 'esgotado' : totalPilulas <= (numEmbalagens * 0.2) ? 'critico' : 'normal'
      };
    } else if (tipo === 'frasco') {
      return {
        total_pilulas: pilulasAtuais,
        embalagens_restantes: Math.ceil(pilulasAtuais / qtdPorEmbalagem),
        pilulas_restantes: pilulasAtuais,
        status_estoque: pilulasAtuais <= 0 ? 'esgotado' : pilulasAtuais <= (qtdPorEmbalagem * 0.2) ? 'critico' : 'normal'
      };
    }
    return {};
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const totais = calcularTotais(
        formData.tipo_embalagem,
        formData.quantidade_por_embalagem,
        formData.numero_embalagens,
        formData.total_pilulas
      );

      const payload = {
        ...formData,
        ...totais
      };

      if (editingMed) {
        await api.put(`/medicamentos/${editingMed.id}`, payload);
      } else {
        await api.post('/medicamentos', payload);
      }

      setFormData({
        nome: '', descricao: '', dosagem: '', fabricante: '', principio_ativo: '',
        tipo_embalagem: 'cartela', quantidade_por_embalagem: 10, numero_embalagens: 1,
        total_pilulas: 10, estoque_minimo_embalagens: 1, estoque_minimo_pilulas: 5,
        lote: '', data_validade: '', bula: '', cuidados: '', contraindicacoes: '', interacoes: ''
      });
      setEditingMed(null);
      setShowForm(false);
      carregarMedicamentos();
      alert('✅ Medicamento salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar medicamento');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (medicamento) => {
    setEditingMed(medicamento);
    setFormData({
      nome: medicamento.nome || '',
      descricao: medicamento.descricao || '',
      dosagem: medicamento.dosagem || '',
      fabricante: medicamento.fabricante || '',
      principio_ativo: medicamento.principio_ativo || '',
      tipo_embalagem: medicamento.tipo_embalagem || 'cartela',
      quantidade_por_embalagem: medicamento.quantidade_por_embalagem || 10,
      numero_embalagens: medicamento.numero_embalagens || 1,
      total_pilulas: medicamento.total_pilulas || 10,
      estoque_minimo_embalagens: medicamento.estoque_minimo_embalagens || 1,
      estoque_minimo_pilulas: medicamento.estoque_minimo_pilulas || 5,
      lote: medicamento.lote || '',
      data_validade: medicamento.data_validade || '',
      bula: medicamento.bula || '',
      cuidados: medicamento.cuidados || '',
      contraindicacoes: medicamento.contraindicacoes || '',
      interacoes: medicamento.interacoes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este medicamento?')) {
      try {
        await api.delete(`/medicamentos/${id}`);
        carregarMedicamentos();
        if (selectedMed?.id === id) setSelectedMed(null);
        alert('✅ Medicamento excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao deletar:', error);
        alert('Erro ao deletar medicamento');
      }
    }
  };

  const handleAddHorario = async (medicamentoId) => {
    if (!novoHorario.horario) {
      alert('Selecione um horário');
      return;
    }
    if (novoHorario.dias_semana.length === 0) {
      alert('Selecione pelo menos um dia da semana');
      return;
    }
    
    try {
      await api.post('/horarios', {
        medicamento_id: medicamentoId,
        horario: novoHorario.horario,
        dias_semana: novoHorario.dias_semana,
        ativo: true
      });
      setNovoHorario({ horario: '08:00', dias_semana: [1, 2, 3, 4, 5], ativo: true });
      carregarHorarios(medicamentoId);
      alert('Horário adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar horário:', error);
      alert('Erro ao adicionar horário');
    }
  };

  const handleDeleteHorario = async (horarioId, medicamentoId) => {
    if (window.confirm('Remover este horário?')) {
      try {
        await api.delete(`/horarios/${horarioId}`);
        carregarHorarios(medicamentoId);
        alert('Horário removido com sucesso!');
      } catch (error) {
        console.error('Erro ao remover horário:', error);
        alert('Erro ao remover horário');
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

  const selecionarMedicamento = (med) => {
    setSelectedMed(med);
    carregarHorarios(med.id);
  };

  const atualizarEstoque = async (medicamentoId, operacao, quantidade) => {
    try {
      const med = medicamentos.find(m => m.id === medicamentoId);
      
      if (operacao === 'usar' && med.total_pilulas <= 0) {
        alert('⚠️ Estoque vazio! Compre mais unidades.');
        return;
      }

      let novaQuantidade = med.total_pilulas;
      let novasEmbalagens = med.numero_embalagens;

      if (operacao === 'usar') {
        novaQuantidade = med.total_pilulas - quantidade;
        novasEmbalagens = Math.ceil(novaQuantidade / med.quantidade_por_embalagem);
      } else if (operacao === 'comprar') {
        novaQuantidade = med.total_pilulas + (med.quantidade_por_embalagem * quantidade);
        novasEmbalagens = med.numero_embalagens + quantidade;
      }

      await api.put(`/medicamentos/${medicamentoId}`, {
        total_pilulas: novaQuantidade,
        numero_embalagens: novasEmbalagens
      });

      carregarMedicamentos();
      if (selectedMed?.id === medicamentoId) {
        setSelectedMed({ ...selectedMed, total_pilulas: novaQuantidade, numero_embalagens: novasEmbalagens });
      }
      
      const mensagem = operacao === 'usar' 
        ? `✅ Usado ${quantidade} ${med.tipo_embalagem === 'frasco' ? 'ml' : 'comprimido(s)'}! Restam ${novaQuantidade} unidades.`
        : `✅ Comprado ${quantidade} ${med.tipo_embalagem === 'frasco' ? 'frasco(s)' : 'cartela(s)'}! Total: ${novaQuantidade} unidades.`;
      alert(mensagem);
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      alert('Erro ao atualizar estoque');
    }
  };

  const getStatusEstoque = (med) => {
    const percentual = (med.total_pilulas / (med.quantidade_por_embalagem * med.numero_embalagens_original)) * 100;
    if (med.total_pilulas <= 0) return { status: 'esgotado', cor: '#dc3545', texto: '⚠️ ESGOTADO' };
    if (percentual <= 20) return { status: 'critico', cor: '#ffc107', texto: '⚠️ ESTOQUE CRÍTICO' };
    if (percentual <= 50) return { status: 'baixo', cor: '#fd7e14', texto: '⚠️ ESTOQUE BAIXO' };
    return { status: 'normal', cor: '#28a745', texto: '✅ ESTOQUE NORMAL' };
  };

  const getTipoEmbalagemInfo = (tipo) => {
    return tiposEmbalagem.find(t => t.value === tipo) || tiposEmbalagem[0];
  };

  return (
    <div className="medicamentos-page">
      <div className="page-header">
        <h1>💊 Meus Medicamentos</h1>
        <button className="btn-primary" onClick={() => { 
          setShowForm(!showForm); 
          setEditingMed(null); 
          setFormData({
            nome: '', descricao: '', dosagem: '', fabricante: '', principio_ativo: '',
            tipo_embalagem: 'cartela', quantidade_por_embalagem: 10, numero_embalagens: 1,
            total_pilulas: 10, estoque_minimo_embalagens: 1, estoque_minimo_pilulas: 5,
            lote: '', data_validade: '', bula: '', cuidados: '', contraindicacoes: '', interacoes: ''
          });
        }}>
          {showForm ? '✖ Cancelar' : '+ Novo Medicamento'}
        </button>
      </div>

      {/* Formulário de Medicamento com Gestão de Estoque Avançada */}
      {showForm && (
        <div className="form-card">
          <h3>{editingMed ? '✏️ Editar Medicamento' : '➕ Novo Medicamento'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row-grid">
              <div className="form-group">
                <label>Nome do Medicamento *</label>
                <input
                  type="text"
                  placeholder="Ex: Paracetamol"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Dosagem</label>
                <input
                  type="text"
                  placeholder="Ex: 500mg"
                  value={formData.dosagem}
                  onChange={(e) => setFormData({ ...formData, dosagem: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Fabricante</label>
                <input
                  type="text"
                  placeholder="Ex: EMS, Neo Química"
                  value={formData.fabricante}
                  onChange={(e) => setFormData({ ...formData, fabricante: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Princípio Ativo</label>
                <input
                  type="text"
                  placeholder="Ex: Paracetamol"
                  value={formData.principio_ativo}
                  onChange={(e) => setFormData({ ...formData, principio_ativo: e.target.value })}
                />
              </div>
            </div>

            {/* Gestão de Estoque - Seção Principal */}
            <div className="estoque-section">
              <h4>📦 Gestão de Estoque Avançada</h4>
              <div className="form-row-grid">
                <div className="form-group">
                  <label>Tipo de Embalagem</label>
                  <select
                    value={formData.tipo_embalagem}
                    onChange={(e) => setFormData({ ...formData, tipo_embalagem: e.target.value })}
                  >
                    {tiposEmbalagem.map(tipo => (
                      <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Quantidade por Embalagem</label>
                  <input
                    type="number"
                    value={formData.quantidade_por_embalagem}
                    onChange={(e) => setFormData({ ...formData, quantidade_por_embalagem: parseInt(e.target.value) })}
                  />
                  <small>{getTipoEmbalagemInfo(formData.tipo_embalagem).unidade}</small>
                </div>
                <div className="form-group">
                  <label>Número de Embalagens</label>
                  <input
                    type="number"
                    value={formData.numero_embalagens}
                    onChange={(e) => setFormData({ ...formData, numero_embalagens: parseInt(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Total em Estoque</label>
                  <input
                    type="number"
                    value={formData.total_pilulas}
                    onChange={(e) => setFormData({ ...formData, total_pilulas: parseInt(e.target.value) })}
                  />
                  <small>{getTipoEmbalagemInfo(formData.tipo_embalagem).unidade}</small>
                </div>
              </div>

              <div className="form-row-grid">
                <div className="form-group">
                  <label>⚠️ Alerta Mínimo (Embalagens)</label>
                  <input
                    type="number"
                    value={formData.estoque_minimo_embalagens}
                    onChange={(e) => setFormData({ ...formData, estoque_minimo_embalagens: parseInt(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>⚠️ Alerta Mínimo (Unidades)</label>
                  <input
                    type="number"
                    value={formData.estoque_minimo_pilulas}
                    onChange={(e) => setFormData({ ...formData, estoque_minimo_pilulas: parseInt(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>🏷️ Lote</label>
                  <input
                    type="text"
                    placeholder="Número do lote"
                    value={formData.lote}
                    onChange={(e) => setFormData({ ...formData, lote: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>📅 Data de Validade</label>
                  <input
                    type="date"
                    value={formData.data_validade}
                    onChange={(e) => setFormData({ ...formData, data_validade: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>📋 Descrição</label>
              <textarea
                placeholder="Descrição do medicamento..."
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                rows="2"
              />
            </div>

            <div className="form-group">
              <label>📄 Bula / Informações</label>
              <textarea
                placeholder="Informações sobre o medicamento, indicações..."
                value={formData.bula}
                onChange={(e) => setFormData({ ...formData, bula: e.target.value })}
                rows="3"
              />
            </div>

            <div className="form-row-grid">
              <div className="form-group">
                <label>⚠️ Cuidados</label>
                <textarea
                  placeholder="Cuidados ao tomar..."
                  value={formData.cuidados}
                  onChange={(e) => setFormData({ ...formData, cuidados: e.target.value })}
                  rows="2"
                />
              </div>
              <div className="form-group">
                <label>🚫 Contraindicações</label>
                <textarea
                  placeholder="Quando não tomar..."
                  value={formData.contraindicacoes}
                  onChange={(e) => setFormData({ ...formData, contraindicacoes: e.target.value })}
                  rows="2"
                />
              </div>
            </div>

            <div className="form-group">
              <label>⚠️ Interações Medicamentosas</label>
              <textarea
                placeholder="Medicamentos que não devem ser tomados junto..."
                value={formData.interacoes}
                onChange={(e) => setFormData({ ...formData, interacoes: e.target.value })}
                rows="2"
              />
            </div>

            <button type="submit" className="btn-success" disabled={loading}>
              {loading ? '💾 Salvando...' : (editingMed ? '✏️ Atualizar' : '💾 Salvar')}
            </button>
          </form>
        </div>
      )}

      {/* Lista de Medicamentos com Gestão de Estoque Visual */}
      <div className="medicamentos-grid">
        {medicamentos.length === 0 ? (
          <div className="empty-state">
            <p>📭 Nenhum medicamento cadastrado</p>
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              + Cadastrar primeiro medicamento
            </button>
          </div>
        ) : (
          medicamentos.map(med => {
            const statusEstoque = getStatusEstoque(med);
            const tipoInfo = getTipoEmbalagemInfo(med.tipo_embalagem);
            const percentualEstoque = (med.total_pilulas / (med.quantidade_por_embalagem * med.numero_embalagens)) * 100;
            
            return (
              <div 
                key={med.id} 
                className={`medicamento-card ${selectedMed?.id === med.id ? 'selected' : ''} ${statusEstoque.status}`}
                onClick={() => selecionarMedicamento(med)}
              >
                <div className="medicamento-header">
                  <h3>{tipoInfo.icon} {med.nome}</h3>
                  <div className="card-actions">
                    <button className="btn-edit" onClick={(e) => { e.stopPropagation(); handleEdit(med); }}>
                      ✏️
                    </button>
                    <button className="btn-delete" onClick={(e) => { e.stopPropagation(); handleDelete(med.id); }}>
                      🗑️
                    </button>
                  </div>
                </div>
                
                {med.dosagem && <p className="dosagem">💊 {med.dosagem}</p>}
                {med.fabricante && <p className="fabricante">🏭 {med.fabricante}</p>}
                
                {/* Widget de Estoque Visual */}
                <div className="estoque-widget">
                  <div className="estoque-header">
                    <span className="estoque-titulo">{tipoInfo.label}</span>
                    <span className={`estoque-status ${statusEstoque.status}`}>{statusEstoque.texto}</span>
                  </div>
                  <div className="estoque-detalhes">
                    <div className="estoque-item">
                      <span>📦 Embalagens:</span>
                      <strong>{med.numero_embalagens}</strong>
                    </div>
                    <div className="estoque-item">
                      <span>{tipoInfo.icon} Total:</span>
                      <strong>{med.total_pilulas} {tipoInfo.unidade}</strong>
                    </div>
                    <div className="estoque-item">
                      <span>📊 Porcentagem:</span>
                      <strong>{Math.round(percentualEstoque)}%</strong>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className={`progress-fill ${statusEstoque.status}`}
                      style={{ width: `${Math.min(100, percentualEstoque)}%` }}
                    />
                  </div>
                  {statusEstoque.status === 'critico' && (
                    <button className="btn-comprar-rapido" onClick={(e) => { e.stopPropagation(); atualizarEstoque(med.id, 'comprar', 1); }}>
                      ➕ Comprar 1 {tipoInfo.label}
                    </button>
                  )}
                </div>

                {/* Detalhes expandidos do medicamento selecionado */}
                {selectedMed?.id === med.id && (
                  <div className="medicamento-detalhes">
                    <div className="detalhes-tabs">
                      <button className={`tab-detalhe ${activeTab === 'informacoes' ? 'active' : ''}`} onClick={() => setActiveTab('informacoes')}>
                        📋 Informações
                      </button>
                      <button className={`tab-detalhe ${activeTab === 'horarios' ? 'active' : ''}`} onClick={() => setActiveTab('horarios')}>
                        ⏰ Horários
                      </button>
                      <button className={`tab-detalhe ${activeTab === 'estoque' ? 'active' : ''}`} onClick={() => setActiveTab('estoque')}>
                        📦 Estoque Avançado
                      </button>
                      <button className={`tab-detalhe ${activeTab === 'bula' ? 'active' : ''}`} onClick={() => setActiveTab('bula')}>
                        📄 Bula
                      </button>
                    </div>

                    {/* Aba Informações */}
                    {activeTab === 'informacoes' && (
                      <div className="tab-content">
                        {med.principio_ativo && <p><strong>Princípio Ativo:</strong> {med.principio_ativo}</p>}
                        {med.cuidados && <p><strong>⚠️ Cuidados:</strong> {med.cuidados}</p>}
                        {med.contraindicacoes && <p><strong>🚫 Contraindicações:</strong> {med.contraindicacoes}</p>}
                        {med.interacoes && <p><strong>⚠️ Interações:</strong> {med.interacoes}</p>}
                        {med.lote && <p><strong>🏷️ Lote:</strong> {med.lote}</p>}
                        {med.data_validade && <p><strong>📅 Validade:</strong> {new Date(med.data_validade).toLocaleDateString()}</p>}
                      </div>
                    )}

                    {/* Aba Horários */}
                    {activeTab === 'horarios' && (
                      <div className="tab-content">
                        <div className="novo-horario-form">
                          <div className="form-row">
                            <input
                              type="time"
                              value={novoHorario.horario}
                              onChange={(e) => setNovoHorario({ ...novoHorario, horario: e.target.value })}
                              className="horario-input"
                            />
                            <div className="dias-semana-grid">
                              {diasSemana.map(dia => (
                                <button
                                  key={dia.id}
                                  type="button"
                                  className={`dia-btn ${novoHorario.dias_semana.includes(dia.id) ? 'active' : ''}`}
                                  style={{
                                    backgroundColor: novoHorario.dias_semana.includes(dia.id) ? dia.cor : '#f0f0f0',
                                    color: novoHorario.dias_semana.includes(dia.id) ? 'white' : '#333'
                                  }}
                                  onClick={() => toggleDia(dia.id)}
                                >
                                  {dia.abreviado}
                                </button>
                              ))}
                            </div>
                            <button className="btn-add-horario" onClick={() => handleAddHorario(med.id)}>
                              + Adicionar
                            </button>
                          </div>
                        </div>

                        <div className="horarios-list">
                          {horarios.length === 0 ? (
                            <p className="sem-horarios">Nenhum horário cadastrado</p>
                          ) : (
                            horarios.map(horario => (
                              <div key={horario.id} className="horario-card">
                                <div className="horario-info">
                                  <span className="horario-tempo">⏰ {horario.horario?.substring(0,5)}</span>
                                  <div className="dias-marcados">
                                    {horario.dias_semana?.map(diaId => {
                                      const dia = diasSemana.find(d => d.id === diaId);
                                      return dia ? (
                                        <span key={diaId} className="dia-marcado" style={{ backgroundColor: dia.cor }}>
                                          {dia.abreviado}
                                        </span>
                                      ) : null;
                                    })}
                                  </div>
                                  <span className={`status ${horario.ativo ? 'active' : 'inactive'}`}>
                                    {horario.ativo ? '✓ Ativo' : '✗ Inativo'}
                                  </span>
                                </div>
                                <button className="btn-remove-horario" onClick={() => handleDeleteHorario(horario.id, med.id)}>
                                  🗑️
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}

                    {/* Aba Estoque Avançado */}
                    {activeTab === 'estoque' && (
                      <div className="tab-content">
                        <div className="estoque-control-avancado">
                          <div className="estoque-info-completa">
                            <h4>📊 Informações Completas de Estoque</h4>
                            <div className="info-grid">
                              <div className="info-item">
                                <span>Tipo de Embalagem:</span>
                                <strong>{tipoInfo.label}</strong>
                              </div>
                              <div className="info-item">
                                <span>Quantidade por Embalagem:</span>
                                <strong>{med.quantidade_por_embalagem} {tipoInfo.unidade}</strong>
                              </div>
                              <div className="info-item">
                                <span>Embalagens em Estoque:</span>
                                <strong>{med.numero_embalagens}</strong>
                              </div>
                              <div className="info-item">
                                <span>Total em {tipoInfo.unidade}:</span>
                                <strong>{med.total_pilulas}</strong>
                              </div>
                              <div className="info-item">
                                <span>Alerta Mínimo (Unidades):</span>
                                <strong>{med.estoque_minimo_pilulas || 5}</strong>
                              </div>
                              <div className="info-item">
                                <span>Status:</span>
                                <strong className={`status-${statusEstoque.status}`}>{statusEstoque.texto}</strong>
                              </div>
                            </div>
                          </div>

                          <div className="estoque-actions-avancado">
                            <h4>⚡ Ações Rápidas</h4>
                            <div className="action-buttons">
                              <div className="action-group">
                                <label>Usar 1 {tipoInfo.unidade}</label>
                                <button className="btn-small" onClick={() => atualizarEstoque(med.id, 'usar', 1)}>
                                  ➖ Usar 1 unidade
                                </button>
                              </div>
                              <div className="action-group">
                                <label>Usar quantidade personalizada</label>
                                <div className="qtd-custom">
                                  <input type="number" id={`qtd-${med.id}`} defaultValue={1} min={1} style={{width: '80px'}} />
                                  <button className="btn-small" onClick={() => {
                                    const qtd = document.getElementById(`qtd-${med.id}`).value;
                                    atualizarEstoque(med.id, 'usar', parseInt(qtd));
                                  }}>
                                    ➖ Usar
                                  </button>
                                </div>
                              </div>
                              <div className="action-group">
                                <label>Comprar 1 embalagem</label>
                                <button className="btn-small btn-comprar" onClick={() => atualizarEstoque(med.id, 'comprar', 1)}>
                                  ➕ Comprar 1 {tipoInfo.label}
                                </button>
                              </div>
                              <div className="action-group">
                                <label>Comprar múltiplas</label>
                                <div className="qtd-custom">
                                  <input type="number" id={`comprar-${med.id}`} defaultValue={1} min={1} style={{width: '80px'}} />
                                  <button className="btn-small btn-comprar" onClick={() => {
                                    const qtd = document.getElementById(`comprar-${med.id}`).value;
                                    atualizarEstoque(med.id, 'comprar', parseInt(qtd));
                                  }}>
                                    ➕ Comprar
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Aba Bula */}
                    {activeTab === 'bula' && (
                      <div className="tab-content bula-content">
                        {med.bula ? (
                          <p>{med.bula}</p>
                        ) : (
                          <p className="sem-bula">📄 Nenhuma informação da bula cadastrada</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MedicamentosPage;

