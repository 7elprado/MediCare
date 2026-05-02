import api from './api';

const relatorioService = {
  getAdesao: async (dias = 30) => {
    const response = await api.get('/relatorios/adesao', { params: { dias } });
    return response.data;
  },
  
  getHorariosHoje: async () => {
    const response = await api.get('/relatorios/horarios-hoje');
    return response.data;
  }
};

export default relatorioService;
