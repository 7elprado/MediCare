import React, { useState, useEffect } from 'react';
import api from '../services/api';
import relatorioService from '../services/relatorioService';
import RegistroTomada from '../components/registros/RegistroTomada';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMedicamentos: 0,
    tomadasHoje: 0,
    adesaoGeral: 0
  });
  const [relatorioAdesao, setRelatorioAdesao] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDashboard();
  }, []);

  const carregarDashboard = async () => {
    try {
      const [medicamentosRes, adesaoRes] = await Promise.all([
        api.get('/medicamentos'),
        relatorioService.getAdesao(7)
      ]);

      const medicamentos = medicamentosRes.data;
      const adesao = adesaoRes.data;

      const adesaoMedia = adesao.length > 0 
        ? adesao.reduce((sum, item) => sum + (item.percentual_adesao || 0), 0) / adesao.length
        : 0;

      setStats({
        totalMedicamentos: medicamentos.length,
        tomadasHoje: 0,
        adesaoGeral: Math.round(adesaoMedia)
      });

      setRelatorioAdesao(adesao);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="dashboard">
      <h1>📊 Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💊</div>
          <div className="stat-value">{stats.totalMedicamentos}</div>
          <div className="stat-label">Medicamentos</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{stats.tomadasHoje}</div>
          <div className="stat-label">Tomadas Hoje</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-value">{stats.adesaoGeral}%</div>
          <div className="stat-label">Adesão Geral</div>
        </div>
      </div>

      <RegistroTomada />

      <div className="relatorio-section">
        <h3>📊 Relatório de Adesão (Últimos 7 dias)</h3>
        <div className="adesao-list">
          {relatorioAdesao.map(item => (
            <div key={item.medicamento_id} className="adesao-item">
              <div className="adesao-info">
                <strong>{item.medicamento}</strong>
                <span>{item.realizado_total} de {item.esperado_total} tomadas</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${item.percentual_adesao || 0}%` }}
                />
                <span className="progress-label">{item.percentual_adesao || 0}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
