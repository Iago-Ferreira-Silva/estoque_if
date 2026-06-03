const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const authRoutes          = require('../routes/authRoutes');
const produtosRoutes      = require('../routes/produtosRoutes');
const setoresRoutes       = require('../routes/setoresRoutes');
const movimentacoesRoutes = require('../routes/movimentacoesRoutes');
const solicitacoesRoutes  = require('../routes/solicitacoesRoutes');
const usuariosRoutes      = require('../routes/usuariosRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth',          authRoutes);
app.use('/api/produtos',      produtosRoutes);
app.use('/api/setores',       setoresRoutes);
app.use('/api/movimentacoes', movimentacoesRoutes);
app.use('/api/solicitacoes',  solicitacoesRoutes);
app.use('/api/usuarios',      usuariosRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;