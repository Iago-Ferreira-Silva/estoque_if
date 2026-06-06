const express = require("express");
const router = express.Router();
const controller = require("../controllers/produtosController");
const auth = require("../middlewares/authMiddleware");

// Qualquer usuário logado pode listar
router.get("/", auth, controller.listar);

// Qualquer usuário autenticado pode criar, editar e excluir produtos
router.post("/", auth, controller.criar);
router.put("/:id", auth, controller.atualizar);
router.delete("/:id", auth, controller.excluir);

module.exports = router;
