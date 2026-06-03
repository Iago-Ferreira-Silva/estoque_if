const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("./app");
require("dotenv").config();

// MOCK DO BANCO
const mockUsuarioAtivo = {
  id: 1,
  nome: "Iago Ferreira",
  email: "admin@ifce.edu.br",
  senha: bcrypt.hashSync("admin123", 10),
  perfil: "gestor",
  setor: "Administrativo",
  ativo: 1,
};

jest.mock("../config/db", () => ({
  execute: jest.fn(),
}));

const db = require("../config/db");

// TESTES DE LOGIN
describe("POST /api/auth/login", () => {
  test("deve retornar token com credenciais válidas", async () => {
    db.execute.mockResolvedValueOnce([[mockUsuarioAtivo]]);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@ifce.edu.br", senha: "admin123" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.usuario.email).toBe("admin@ifce.edu.br");
    expect(res.body.usuario.perfil).toBe("gestor");
  });

  test("deve retornar 401 com senha incorreta", async () => {
    db.execute.mockResolvedValueOnce([[mockUsuarioAtivo]]);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@ifce.edu.br", senha: "senha-errada" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Credenciais inválidas.");
  });

  test("deve retornar 401 com e-mail inexistente", async () => {
    db.execute.mockResolvedValueOnce([[]]);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "naoexiste@ifce.edu.br", senha: "admin123" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Credenciais inválidas.");
  });

  test("deve retornar 401 com usuário inativo", async () => {
    db.execute.mockResolvedValueOnce([[]]);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@ifce.edu.br", senha: "admin123" });

    expect(res.status).toBe(401);
  });

  test("deve retornar 400 sem e-mail e senha", async () => {
    const res = await request(app).post("/api/auth/login").send({});

    expect(res.status).toBe(400);
  });

  test("token retornado deve conter dados do usuário", async () => {
    db.execute.mockResolvedValueOnce([[mockUsuarioAtivo]]);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@ifce.edu.br", senha: "admin123" });

    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);

    expect(decoded.perfil).toBe("gestor");
    expect(decoded.email).toBe("admin@ifce.edu.br");
  });
});
