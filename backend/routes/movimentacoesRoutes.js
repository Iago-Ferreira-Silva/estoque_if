const express = require("express");
const router = express.Router();
const controller = require("../controllers/movimentacoesController");
const auth = require("../middlewares/authMiddleware");

// Qualquer usuário logado pode listar
router.get("/", auth, controller.listar);

// Qualquer usuário autenticado pode registrar movimentações
router.post("/", auth, controller.criar);

module.exports = router;
