require('dotenv').config();
const express = require('express');
const cors = require('cors');
const medicamentoRoutes = require('./routes/medicamentoRoutes');
const horarioRoutes = require('./routes/horarioRoutes');
const registroRoutes = require('./routes/registroRoutes');
const alertaRoutes = require('./routes/alertaRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'MediCare API funcionando!', timestamp: new Date() });
});

app.use('/api/medicamentos', medicamentoRoutes);
app.use('/api/horarios', horarioRoutes);
app.use('/api/registros', registroRoutes);
app.use('/api/alertas', alertaRoutes);

app.use((err, req, res, next) => {
  console.error('Erro:', err.stack);
  res.status(500).json({ error: err.message });
});

const alertaController = require('./controllers/alertaController');
setInterval(() => {
  alertaController.verificar({}, { json: () => {} });
}, 60000);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

module.exports = app;
