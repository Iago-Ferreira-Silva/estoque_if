const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/solicitacoesController');
const auth       = require('../middlewares/authMiddleware');
const authorize  = require('../middlewares/authorizeMiddleware');

// Qualquer usuário logado pode listar e criar solicitações
router.get('/',  auth, controller.listar);
router.post('/', auth, controller.criar);

// Apenas gestor e coordenador podem aprovar ou recusar
router.patch('/:id/status', auth, authorize('gestor', 'coordenador'), controller.atualizarStatus);

module.exports = router;