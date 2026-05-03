import api from './api';

const registroService = {
  listar: async () => {
    const response = await api.get('/registros');
    return response.data;
  },
  
  getHoje: async () => {
    const response = await api.get('/registros/hoje');
    return response.data;
  },
  
  getEstatisticas: async () => {
    const response = await api.get('/registros/estatisticas');
    return response.data;
  },
  
  registrar: async (medicamentoId) => {
    const response = await api.post('/registros', { 
      medicamento_id: medicamentoId,
      data_hora_tomada: new Date().toISOString()
    });
    return response.data;
  }
};

export default registroService;