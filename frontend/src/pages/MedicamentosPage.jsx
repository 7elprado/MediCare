import React, { useState, useEffect } from 'react';
import api from '../services/api';
import HorariosForm from '../components/medicamentos/HorariosForm';

const MedicamentosPage = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [formData, setFormData] = useState({ nome: '', descricao: '', dosagem: '' });
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingMed) {
        await api.put(`/medicamentos/${editingMed.id}`, formData);
      } else {
        await api.post('/medicamentos', formData);
      }
      setFormData({ nome: '', descricao: '', dosagem: '' });
      setEditingMed(null);
      setShowForm(false);
      carregarMedicamentos();
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
      nome: medicamento.nome,
      descricao: medicamento.descricao || '',
      dosagem: medicamento.dosagem || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este medicamento?')) {
      try {
        await api.delete(`/medicamentos/${id}`);
        carregarMedicamentos();
      } catch (error) {
        console.error('Erro ao deletar:', error);
        alert('Erro ao deletar medicamento');
      }
    }
  };

  return (
    <div className="medicamentos-page">
      <div className="page-header">
        <h1>💊 Meus Medicamentos</h1>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditingMed(null); setFormData({ nome: '', descricao: '', dosagem: '' }); }}>
          {showForm ? 'Cancelar' : '+ Novo Medicamento'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingMed ? 'Editar Medicamento' : 'Novo Medicamento'}</h3>
          <form onSubmit={handleSubmit}>
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
              <label>Descrição</label>
              <textarea
                placeholder="Descrição do medicamento..."
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                rows="3"
              />
            </div>
            <button type="submit" className="btn-success" disabled={loading}>
              {loading ? 'Salvando...' : (editingMed ? 'Atualizar' : 'Salvar')}
            </button>
          </form>
        </div>
      )}

      <div className="medicamentos-grid">
        {medicamentos.length === 0 ? (
          <div className="empty-state">
            <p>📭 Nenhum medicamento cadastrado</p>
            <button className="btn-primary" onClick={() => setShowForm(true)}>+ Cadastrar primeiro medicamento</button>
          </div>
        ) : (
          medicamentos.map(med => (
            <div key={med.id} className="medicamento-card">
              <div className="medicamento-header">
                <h3>{med.nome}</h3>
                <div className="card-actions">
                  <button className="btn-edit" onClick={() => handleEdit(med)}>✏️ Editar</button>
                  <button className="btn-delete" onClick={() => handleDelete(med.id)}>🗑️ Excluir</button>
                </div>
              </div>
              {med.dosagem && <p className="dosagem">💊 {med.dosagem}</p>}
              {med.descricao && <p className="descricao">{med.descricao}</p>}
              <HorariosForm medicamentoId={med.id} onHorarioAdicionado={carregarMedicamentos} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MedicamentosPage;
