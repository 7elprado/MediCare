import api from './api';

const horarioService = {
  listar: async (medicamentoId) => {
    const params = medicamentoId ? { medicamento_id: medicamentoId } : {};
    const response = await api.get('/horarios', { params });
    return response.data;
  },
  
  criar: async (horario) => {
    const response = await api.post('/horarios', horario);
    return response.data;
  },
  
  atualizar: async (id, horario) => {
    const response = await api.put(`/horarios/${id}`, horario);
    return response.data;
  },
  
  deletar: async (id) => {
    const response = await api.delete(`/horarios/${id}`);
    return response.data;
  }
};

export default horarioService;
