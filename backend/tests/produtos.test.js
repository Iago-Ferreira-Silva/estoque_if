const request = require('supertest');
const jwt     = require('jsonwebtoken');
const app     = require('./app');
require('dotenv').config();

function gerarToken(perfil = 'gestor') {
  return jwt.sign(
    { id: 1, nome: 'Teste', email: 'teste@test.com', perfil },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

const mockProdutos = [
  {
    id: 1, nome: 'Papel A4', categoria: 'escritorio',
    unidade: 'pct', unidade_minima: 'folha',
    fator_conversao: 500, qtd_atual: 1000, qtd_minima: 5000,
  },
  {
    id: 2, nome: 'Álcool 70%', categoria: 'limpeza',
    unidade: 'lt', unidade_minima: 'mililitro',
    fator_conversao: 1000, qtd_atual: 20000, qtd_minima: 5000,
  },
];

jest.mock('../config/db', () => ({
  execute: jest.fn(),
}));

const db = require('../config/db');

describe('GET /api/produtos', () => {

  test('deve listar produtos com token válido', async () => {
    db.execute.mockResolvedValueOnce([mockProdutos]);

    const res = await request(app)
      .get('/api/produtos')
      .set('Authorization', `Bearer ${gerarToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].nome).toBe('Papel A4');
  });

  test('deve retornar 401 sem token', async () => {
    const res = await request(app).get('/api/produtos');
    expect(res.status).toBe(401);
  });

});

describe('POST /api/produtos', () => {

  test('gestor deve criar produto com sucesso', async () => {
    db.execute.mockResolvedValueOnce([{ insertId: 3 }]);

    const res = await request(app)
      .post('/api/produtos')
      .set('Authorization', `Bearer ${gerarToken('gestor')}`)
      .send({
        nome: 'Novo Produto', categoria: 'higiene',
        unidade: 'un', unidade_minima: 'unidade', fator_conversao: 1,
        qtd_atual: 10, qtd_minima: 5,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  test('deve retornar 400 sem campos obrigatórios', async () => {
    const res = await request(app)
      .post('/api/produtos')
      .set('Authorization', `Bearer ${gerarToken('gestor')}`)
      .send({ nome: 'Sem categoria' });

    expect(res.status).toBe(400);
  });

  test('agente não pode criar produto', async () => {
    const res = await request(app)
      .post('/api/produtos')
      .set('Authorization', `Bearer ${gerarToken('agente')}`)
      .send({ nome: 'Teste', categoria: 'limpeza' });

    expect(res.status).toBe(403);
  });

});

describe('PUT /api/produtos/:id', () => {

  test('gestor deve atualizar produto', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await request(app)
      .put('/api/produtos/1')
      .set('Authorization', `Bearer ${gerarToken('gestor')}`)
      .send({
        nome: 'Papel A4 Atualizado', categoria: 'escritorio',
        unidade: 'pct', unidade_minima: 'folha', fator_conversao: 500,
        qtd_atual: 2000, qtd_minima: 5000,
      });

    expect(res.status).toBe(200);
  });

  test('coordenador não pode atualizar produto', async () => {
    const res = await request(app)
      .put('/api/produtos/1')
      .set('Authorization', `Bearer ${gerarToken('coordenador')}`)
      .send({ nome: 'Editado' });

    expect(res.status).toBe(403);
  });

});

describe('DELETE /api/produtos/:id', () => {

  test('gestor deve excluir produto sem movimentações', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await request(app)
      .delete('/api/produtos/1')
      .set('Authorization', `Bearer ${gerarToken('gestor')}`);

    expect(res.status).toBe(200);
  });

  test('secretário não pode excluir produto', async () => {
    const res = await request(app)
      .delete('/api/produtos/1')
      .set('Authorization', `Bearer ${gerarToken('secretario')}`);

    expect(res.status).toBe(403);
  });

});