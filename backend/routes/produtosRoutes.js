const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/produtosController');
const auth       = require('../middlewares/authMiddleware');
const authorize  = require('../middlewares/authorizeMiddleware');

// Qualquer usuário logado pode listar
router.get('/', auth, controller.listar);

// Apenas gestor pode criar, editar e excluir
router.post('/',    auth, authorize('gestor'), controller.criar);
router.put('/:id',  auth, authorize('gestor'), controller.atualizar);
router.delete('/:id', auth, authorize('gestor'), controller.excluir);

module.exports = router;