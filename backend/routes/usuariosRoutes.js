const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/usuariosController');
const auth       = require('../middlewares/authMiddleware');
const authorize  = require('../middlewares/authorizeMiddleware');

// Apenas gestor acessa tudo de usuários
router.get('/',             auth, authorize('gestor'), controller.listar);
router.post('/',            auth, authorize('gestor'), controller.criar);
router.put('/:id',          auth, authorize('gestor'), controller.atualizar);
router.patch('/:id/status', auth, authorize('gestor'), controller.toggleStatus);

module.exports = router;