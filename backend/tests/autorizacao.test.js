const request = require('supertest');
const jwt     = require('jsonwebtoken');
const app     = require('./app');
require('dotenv').config();

// HELPER — gera token por perfil
function gerarToken(perfil) {
  return jwt.sign(
    { id: 1, nome: 'Teste', email: 'teste@test.com', perfil },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

// MOCK DO BANCO DE DADOS
// Evita conexão real com MySQL
jest.mock('../config/db', () => ({
  execute: jest.fn().mockResolvedValue([[
    {
      id: 1, nome: 'Produto Teste', categoria: 'limpeza',
      unidade: 'un', unidade_minima: 'unidade',
      fator_conversao: 1, qtd_atual: 10, qtd_minima: 5,
    }
  ]]),
  getConnection: jest.fn().mockResolvedValue({
    beginTransaction: jest.fn(),
    execute:   jest.fn().mockResolvedValue([{ insertId: 1, affectedRows: 1 }]),
    commit:    jest.fn(),
    rollback:  jest.fn(),
    release:   jest.fn(),
  }),
}));

// TESTES DE AUTORIZAÇÃO — PRODUTOS
describe('Autorização — Produtos', () => {

  test('Agente NÃO pode criar produto (403)', async () => {
    const res = await request(app)
      .post('/api/produtos')
      .set('Authorization', `Bearer ${gerarToken('agente')}`)
      .send({ nome: 'Teste', categoria: 'limpeza', unidade: 'un' });

    expect(res.status).toBe(403);
  });

  test('Gestor PODE criar produto (201)', async () => {
    const res = await request(app)
      .post('/api/produtos')
      .set('Authorization', `Bearer ${gerarToken('gestor')}`)
      .send({
        nome: 'Produto Teste', categoria: 'limpeza',
        unidade: 'un', unidade_minima: 'unidade', fator_conversao: 1,
      });

    expect(res.status).toBe(201);
  });

  test('Coordenador NÃO pode excluir produto (403)', async () => {
    const res = await request(app)
      .delete('/api/produtos/1')
      .set('Authorization', `Bearer ${gerarToken('coordenador')}`);

    expect(res.status).toBe(403);
  });

  test('Secretário NÃO pode editar produto (403)', async () => {
    const res = await request(app)
      .put('/api/produtos/1')
      .set('Authorization', `Bearer ${gerarToken('secretario')}`)
      .send({ nome: 'Editado' });

    expect(res.status).toBe(403);
  });

  test('Qualquer perfil PODE listar produtos (200)', async () => {
    for (const perfil of ['gestor', 'coordenador', 'secretario', 'agente']) {
      const res = await request(app)
        .get('/api/produtos')
        .set('Authorization', `Bearer ${gerarToken(perfil)}`);

      expect(res.status).toBe(200);
    }
  });

});

// TESTES DE AUTORIZAÇÃO — USUÁRIOS
describe('Autorização — Usuários', () => {

  test('Agente NÃO pode listar usuários (403)', async () => {
    const res = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${gerarToken('agente')}`);

    expect(res.status).toBe(403);
  });

  test('Coordenador NÃO pode listar usuários (403)', async () => {
    const res = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${gerarToken('coordenador')}`);

    expect(res.status).toBe(403);
  });

  test('Secretário NÃO pode listar usuários (403)', async () => {
    const res = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${gerarToken('secretario')}`);

    expect(res.status).toBe(403);
  });

  test('Gestor PODE listar usuários (200)', async () => {
    const res = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${gerarToken('gestor')}`);

    expect(res.status).toBe(200);
  });

});

// TESTES DE AUTORIZAÇÃO — MOVIMENTAÇÕES
describe('Autorização — Movimentações', () => {

  test('Agente NÃO pode registrar movimentação (403)', async () => {
    const res = await request(app)
      .post('/api/movimentacoes')
      .set('Authorization', `Bearer ${gerarToken('agente')}`)
      .send({ produto_id: 1, setor_id: 1, tipo: 'entrada', quantidade: 5 });

    expect(res.status).toBe(403);
  });

  test('Secretário PODE registrar movimentação (201)', async () => {
    const res = await request(app)
      .post('/api/movimentacoes')
      .set('Authorization', `Bearer ${gerarToken('secretario')}`)
      .send({
        produto_id: 1, setor_id: 1, tipo: 'entrada',
        quantidade: 5, unidade_mov: 'unidade',
        quantidade_convertida: 5, responsavel_nome: 'Teste',
      });

    expect(res.status).toBe(201);
  });

});

// TESTES DE AUTORIZAÇÃO — SOLICITAÇÕES
describe('Autorização — Solicitações', () => {

  test('Agente NÃO pode aprovar solicitação (403)', async () => {
    const res = await request(app)
      .patch('/api/solicitacoes/1/status')
      .set('Authorization', `Bearer ${gerarToken('agente')}`)
      .send({ status: 'aprovada' });

    expect(res.status).toBe(403);
  });

  test('Secretário NÃO pode aprovar solicitação (403)', async () => {
    const res = await request(app)
      .patch('/api/solicitacoes/1/status')
      .set('Authorization', `Bearer ${gerarToken('secretario')}`)
      .send({ status: 'aprovada' });

    expect(res.status).toBe(403);
  });

  test('Coordenador PODE aprovar solicitação (200)', async () => {
    const res = await request(app)
      .patch('/api/solicitacoes/1/status')
      .set('Authorization', `Bearer ${gerarToken('coordenador')}`)
      .send({ status: 'aprovada' });

    expect(res.status).toBe(200);
  });

  test('Qualquer perfil PODE criar solicitação (201)', async () => {
    for (const perfil of ['gestor', 'coordenador', 'secretario', 'agente']) {
      const res = await request(app)
        .post('/api/solicitacoes')
        .set('Authorization', `Bearer ${gerarToken(perfil)}`)
        .send({ produto_id: 1, setor_id: 1, quantidade: 5 });

      expect(res.status).toBe(201);
    }
  });

});

// TESTES SEM AUTENTICAÇÃO
describe('Sem autenticação', () => {

  test('Deve retornar 401 sem token', async () => {
    const res = await request(app).get('/api/produtos');
    expect(res.status).toBe(401);
  });

  test('Deve retornar 403 com token inválido', async () => {
    const res = await request(app)
      .get('/api/produtos')
      .set('Authorization', 'Bearer token-invalido');
    expect(res.status).toBe(403);
  });

});