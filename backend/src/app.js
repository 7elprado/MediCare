require('dotenv').config();
const express = require('express');
const cors = require('cors');
const medicamentoRoutes = require('./routes/medicamentoRoutes');
const horarioRoutes = require('./routes/horarioRoutes');
const registroRoutes = require('./routes/registroRoutes');
const relatorioRoutes = require('./routes/relatorioRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'MediCare API está funcionando!' });
});

// Rotas da API
app.use('/api/medicamentos', medicamentoRoutes);
app.use('/api/horarios', horarioRoutes);
app.use('/api/registros', registroRoutes);
app.use('/api/relatorios', relatorioRoutes);

// Middleware de erro
app.use((err, req, res, next) => {
  console.error('Erro:', err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

module.exports = app;
