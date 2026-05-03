import api from './api';

const medicamentoService = {
  listar: async () => {
    const response = await api.get('/medicamentos');
    return response.data;
  },
  
  criar: async (medicamento) => {
    const response = await api.post('/medicamentos', medicamento);
    return response.data;
  },
  
  atualizar: async (id, medicamento) => {
    const response = await api.put(`/medicamentos/${id}`, medicamento);
    return response.data;
  },
  
  deletar: async (id) => {
    const response = await api.delete(`/medicamentos/${id}`);
    return response.data;
  }
};

export default medicamentoService;