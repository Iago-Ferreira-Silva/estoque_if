const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/movimentacoesController');
const auth       = require('../middlewares/authMiddleware');
const authorize  = require('../middlewares/authorizeMiddleware');

// Qualquer usuário logado pode listar
router.get('/', auth, controller.listar);

// Gestor, coordenador e secretário podem registrar
router.post('/', auth, authorize('gestor', 'coordenador', 'secretario'), controller.criar);

module.exports = router;