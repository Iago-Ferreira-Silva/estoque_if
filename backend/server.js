const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const authRoutes          = require('./routes/authRoutes');
const usuariosRoutes      = require('./routes/usuariosRoutes');
const setoresRoutes       = require('./routes/setoresRoutes');
const produtosRoutes      = require('./routes/produtosRoutes');
const movimentacoesRoutes = require('./routes/movimentacoesRoutes');
const solicitacoesRoutes  = require('./routes/solicitacoesRoutes');

const app  = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth',          authRoutes);
app.use('/api/usuarios',      usuariosRoutes);
app.use('/api/setores',       setoresRoutes);
app.use('/api/produtos',      produtosRoutes);
app.use('/api/movimentacoes', movimentacoesRoutes);
app.use('/api/solicitacoes',  solicitacoesRoutes);

// Rota de verificação
app.get('/api/health', (req, res) => {
  res.json({ status: 'API rodando com sucesso.' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});