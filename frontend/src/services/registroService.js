import api from './api';

const registroService = {
  listar: async (filtros = {}) => {
    const response = await api.get('/registros', { params: filtros });
    return response.data;
  },
  
  getHoje: async () => {
    const response = await api.get('/registros/hoje');
    return response.data;
  },
  
  registrarTomada: async (dados) => {
    const response = await api.post('/registros', dados);
    return response.data;
  }
};

export default registroService;
