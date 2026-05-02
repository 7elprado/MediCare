const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'MediCare API está funcionando!' });
});

app.use('/api/medicamentos', require('./routes/medicamentoRoutes'));
app.use('/api/registros', require('./routes/registroRoutes'));
app.use('/api/relatorios', require('./routes/relatorioRoutes'));

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
