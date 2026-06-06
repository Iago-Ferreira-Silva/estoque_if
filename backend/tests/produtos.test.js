const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("./app");
require("dotenv").config();

function gerarToken(perfil = "gestor") {
  return jwt.sign(
    { id: 1, nome: "Teste", email: "teste@test.com", perfil },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
}

const mockProdutos = [
  {
    id: 1,
    nome: "Papel A4",
    categoria: "escritorio",
    unidade: "pct",
    unidade_minima: "folha",
    fator_conversao: 500,
    qtd_atual: 1000,
    qtd_minima: 5000,
  },
  {
    id: 2,
    nome: "Álcool 70%",
    categoria: "limpeza",
    unidade: "lt",
    unidade_minima: "mililitro",
    fator_conversao: 1000,
    qtd_atual: 20000,
    qtd_minima: 5000,
  },
];

jest.mock("../config/db", () => ({
  execute: jest.fn(),
}));

const db = require("../config/db");

describe("GET /api/produtos", () => {
  test("deve listar produtos com token válido", async () => {
    db.execute.mockResolvedValueOnce([mockProdutos]);

    const res = await request(app)
      .get("/api/produtos")
      .set("Authorization", `Bearer ${gerarToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].nome).toBe("Papel A4");
    expect(res.body[0].unidade_minima).toBe("folha");
    expect(res.body[0].fator_conversao).toBe(500);
  });

  test("deve retornar 401 sem token", async () => {
    const res = await request(app).get("/api/produtos");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  test("deve retornar 500 quando banco falha", async () => {
    db.execute.mockRejectedValueOnce(new Error("Erro de banco"));

    const res = await request(app)
      .get("/api/produtos")
      .set("Authorization", `Bearer ${gerarToken()}`);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Erro ao listar produtos.");
  });
});

describe("POST /api/produtos", () => {
  test("gestor deve criar produto com sucesso", async () => {
    db.execute.mockResolvedValueOnce([{ insertId: 3 }]);

    const res = await request(app)
      .post("/api/produtos")
      .set("Authorization", `Bearer ${gerarToken("gestor")}`)
      .send({
        nome: "Novo Produto",
        categoria: "higiene",
        unidade: "un",
        unidade_minima: "unidade",
        fator_conversao: 1,
        qtd_atual: 10,
        qtd_minima: 5,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id", 3);
    expect(res.body.message).toBe("Produto criado com sucesso.");
  });

  test("deve retornar 400 sem nome", async () => {
    const res = await request(app)
      .post("/api/produtos")
      .set("Authorization", `Bearer ${gerarToken("gestor")}`)
      .send({
        categoria: "limpeza",
        unidade_minima: "unidade",
        fator_conversao: 1,
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Preencha todos os campos obrigatórios.");
  });

  test("deve retornar 400 sem categoria", async () => {
    const res = await request(app)
      .post("/api/produtos")
      .set("Authorization", `Bearer ${gerarToken("gestor")}`)
      .send({ nome: "Produto", unidade_minima: "unidade", fator_conversao: 1 });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Preencha todos os campos obrigatórios.");
  });

  test("deve retornar 400 sem unidade_minima", async () => {
    const res = await request(app)
      .post("/api/produtos")
      .set("Authorization", `Bearer ${gerarToken("gestor")}`)
      .send({ nome: "Produto", categoria: "limpeza", fator_conversao: 1 });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Preencha todos os campos obrigatórios.");
  });

  test("deve retornar 400 sem fator_conversao", async () => {
    const res = await request(app)
      .post("/api/produtos")
      .set("Authorization", `Bearer ${gerarToken("gestor")}`)
      .send({
        nome: "Produto",
        categoria: "limpeza",
        unidade_minima: "unidade",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Preencha todos os campos obrigatórios.");
  });

  test("agente deve criar produto com sucesso", async () => {
    db.execute.mockResolvedValueOnce([{ insertId: 4 }]);

    const res = await request(app)
      .post("/api/produtos")
      .set("Authorization", `Bearer ${gerarToken("agente")}`)
      .send({
        nome: "Teste",
        categoria: "limpeza",
        unidade: "un",
        unidade_minima: "unidade",
        fator_conversao: 1,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id", 4);
    expect(res.body.message).toBe("Produto criado com sucesso.");
  });

  test("deve retornar 500 quando banco falha", async () => {
    db.execute.mockRejectedValueOnce(new Error("Erro de banco"));

    const res = await request(app)
      .post("/api/produtos")
      .set("Authorization", `Bearer ${gerarToken("gestor")}`)
      .send({
        nome: "Teste",
        categoria: "limpeza",
        unidade_minima: "unidade",
        fator_conversao: 1,
      });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Erro ao criar produto.");
  });
});

describe("PUT /api/produtos/:id", () => {
  test("gestor deve atualizar produto", async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await request(app)
      .put("/api/produtos/1")
      .set("Authorization", `Bearer ${gerarToken("gestor")}`)
      .send({
        nome: "Papel A4 Atualizado",
        categoria: "escritorio",
        unidade: "pct",
        unidade_minima: "folha",
        fator_conversao: 500,
        qtd_atual: 2000,
        qtd_minima: 5000,
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Produto atualizado com sucesso.");
  });

  test("coordenador deve atualizar produto", async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await request(app)
      .put("/api/produtos/1")
      .set("Authorization", `Bearer ${gerarToken("coordenador")}`)
      .send({
        nome: "Papel A4 Atualizado",
        categoria: "escritorio",
        unidade: "pct",
        unidade_minima: "folha",
        fator_conversao: 500,
        qtd_atual: 2000,
        qtd_minima: 5000,
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Produto atualizado com sucesso.");
  });

  test("deve retornar 500 quando banco falha", async () => {
    db.execute.mockRejectedValueOnce(new Error("Erro de banco"));

    const res = await request(app)
      .put("/api/produtos/1")
      .set("Authorization", `Bearer ${gerarToken("gestor")}`)
      .send({
        nome: "Teste",
        categoria: "limpeza",
        unidade: "un",
        unidade_minima: "unidade",
        fator_conversao: 1,
      });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Erro ao atualizar produto.");
  });
});

describe("DELETE /api/produtos/:id", () => {
  test("gestor deve excluir produto sem movimentações", async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await request(app)
      .delete("/api/produtos/1")
      .set("Authorization", `Bearer ${gerarToken("gestor")}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Produto excluído com sucesso.");
  });

  test("deve retornar 404 quando produto não encontrado", async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 0 }]);

    const res = await request(app)
      .delete("/api/produtos/999")
      .set("Authorization", `Bearer ${gerarToken("gestor")}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Produto não encontrado.");
  });

  test("deve retornar 400 quando produto tem movimentações", async () => {
    const erro = new Error("Foreign key constraint");
    erro.code = "ER_ROW_IS_REFERENCED_2";
    db.execute.mockRejectedValueOnce(erro);

    const res = await request(app)
      .delete("/api/produtos/1")
      .set("Authorization", `Bearer ${gerarToken("gestor")}`);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(
      "Não é possível excluir este produto pois ele possui movimentações cadastradas.",
    );
  });

  test("secretário deve excluir produto com sucesso", async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await request(app)
      .delete("/api/produtos/1")
      .set("Authorization", `Bearer ${gerarToken("secretario")}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Produto excluído com sucesso.");
  });
});
