import React, { useState, useEffect } from 'react';
import api from '../services/api';
import HorariosForm from '../components/medicamentos/HorariosForm';
import MedicamentoList from '../components/medicamentos/MedicamentoList';

const MedicamentosPage = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [medicamentoSelecionado, setMedicamentoSelecionado] = useState(null);
  const [formData, setFormData] = useState({ nome: '', descricao: '', dosagem: '' });

  useEffect(() => {
    carregarMedicamentos();
  }, []);

  const carregarMedicamentos = async () => {
    const response = await api.get('/medicamentos');
    setMedicamentos(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (medicamentoSelecionado) {
        await api.put(`/medicamentos/${medicamentoSelecionado.id}`, formData);
      } else {
        await api.post('/medicamentos', formData);
      }
      setFormData({ nome: '', descricao: '', dosagem: '' });
      setMedicamentoSelecionado(null);
      setShowForm(false);
      carregarMedicamentos();
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const handleEdit = (medicamento) => {
    setMedicamentoSelecionado(medicamento);
    setFormData({
      nome: medicamento.nome,
      descricao: medicamento.descricao,
      dosagem: medicamento.dosagem
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este medicamento?')) {
      await api.delete(`/medicamentos/${id}`);
      carregarMedicamentos();
    }
  };

  return (
    <div className="medicamentos-page">
      <div className="header">
        <h1>📋 Meus Medicamentos</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancelar' : '+ Novo Medicamento'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h2>{medicamentoSelecionado ? 'Editar' : 'Novo'} Medicamento</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nome do medicamento"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Dosagem (ex: 500mg)"
              value={formData.dosagem}
              onChange={(e) => setFormData({ ...formData, dosagem: e.target.value })}
            />
            <textarea
              placeholder="Descrição"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            />
            <button type="submit" className="btn-success">
              {medicamentoSelecionado ? 'Atualizar' : 'Salvar'}
            </button>
          </form>
        </div>
      )}

      <div className="medicamentos-container">
        {medicamentos.map(med => (
          <div key={med.id} className="medicamento-card">
            <div className="medicamento-header">
              <h3>{med.nome}</h3>
              <div className="actions">
                <button onClick={() => handleEdit(med)} className="btn-edit">✏️</button>
                <button onClick={() => handleDelete(med.id)} className="btn-delete">🗑️</button>
              </div>
            </div>
            <p className="dosagem">{med.dosagem}</p>
            <p className="descricao">{med.descricao}</p>
            <HorariosForm medicamentoId={med.id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicamentosPage;
