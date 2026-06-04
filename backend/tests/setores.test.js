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

const mockSetores = [
  { id: 1, nome: 'Secretaria',   responsavel: 'Maria Silva',  descricao: 'Documentação' },
  { id: 2, nome: 'Coordenação',  responsavel: 'João Mendes',  descricao: 'Pedagógico' },
  { id: 3, nome: 'Almoxarifado', responsavel: 'Carlos Lima',  descricao: 'Armazenamento' },
];

jest.mock('../config/db', () => ({
  execute: jest.fn(),
}));

const db = require('../config/db');

describe('GET /api/setores', () => {

  test('deve listar setores com dados corretos', async () => {
    db.execute.mockResolvedValueOnce([mockSetores]);

    const res = await request(app)
      .get('/api/setores')
      .set('Authorization', `Bearer ${gerarToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
    expect(res.body[0].nome).toBe('Secretaria');
    expect(res.body[0].responsavel).toBe('Maria Silva');
  });

  test('deve retornar 401 sem token', async () => {
    const res = await request(app).get('/api/setores');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message');
  });

  test('qualquer perfil pode listar setores', async () => {
    for (const perfil of ['gestor', 'coordenador', 'secretario', 'agente']) {
      db.execute.mockResolvedValueOnce([mockSetores]);

      const res = await request(app)
        .get('/api/setores')
        .set('Authorization', `Bearer ${gerarToken(perfil)}`);

      expect(res.status).toBe(200);
    }
  });

  test('deve retornar 500 quando banco falha', async () => {
    db.execute.mockRejectedValueOnce(new Error('Erro de banco'));

    const res = await request(app)
      .get('/api/setores')
      .set('Authorization', `Bearer ${gerarToken()}`);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Erro ao listar setores.');
  });

});

describe('POST /api/setores', () => {

  test('gestor deve criar setor com sucesso', async () => {
    db.execute.mockResolvedValueOnce([{ insertId: 4 }]);

    const res = await request(app)
      .post('/api/setores')
      .set('Authorization', `Bearer ${gerarToken('gestor')}`)
      .send({ nome: 'Novo Setor', responsavel: 'Fulano', descricao: 'Descrição' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id', 4);
    expect(res.body.message).toBe('Setor criado com sucesso.');
  });

  test('deve retornar 400 sem nome', async () => {
    const res = await request(app)
      .post('/api/setores')
      .set('Authorization', `Bearer ${gerarToken('gestor')}`)
      .send({ responsavel: 'Fulano' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Nome do setor é obrigatório.');
  });

  test('agente não pode criar setor', async () => {
    const res = await request(app)
      .post('/api/setores')
      .set('Authorization', `Bearer ${gerarToken('agente')}`)
      .send({ nome: 'Setor Teste' });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('message');
  });

  test('deve retornar 500 quando banco falha', async () => {
    db.execute.mockRejectedValueOnce(new Error('Erro de banco'));

    const res = await request(app)
      .post('/api/setores')
      .set('Authorization', `Bearer ${gerarToken('gestor')}`)
      .send({ nome: 'Setor Teste' });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Erro ao criar setor.');
  });

});

describe('PUT /api/setores/:id', () => {

  test('gestor deve atualizar setor', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await request(app)
      .put('/api/setores/1')
      .set('Authorization', `Bearer ${gerarToken('gestor')}`)
      .send({ nome: 'Secretaria Atualizada', responsavel: 'Maria', descricao: 'Atualizado' });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Setor atualizado com sucesso.');
  });

  test('secretário não pode atualizar setor', async () => {
    const res = await request(app)
      .put('/api/setores/1')
      .set('Authorization', `Bearer ${gerarToken('secretario')}`)
      .send({ nome: 'Editado' });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('message');
  });

  test('deve retornar 500 quando banco falha', async () => {
    db.execute.mockRejectedValueOnce(new Error('Erro de banco'));

    const res = await request(app)
      .put('/api/setores/1')
      .set('Authorization', `Bearer ${gerarToken('gestor')}`)
      .send({ nome: 'Teste' });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Erro ao atualizar setor.');
  });

});

describe('DELETE /api/setores/:id', () => {

  test('gestor deve excluir setor', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await request(app)
      .delete('/api/setores/1')
      .set('Authorization', `Bearer ${gerarToken('gestor')}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Setor excluído com sucesso.');
  });

  test('agente não pode excluir setor', async () => {
    const res = await request(app)
      .delete('/api/setores/1')
      .set('Authorization', `Bearer ${gerarToken('agente')}`);

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('message');
  });

  test('deve retornar 500 quando banco falha', async () => {
    db.execute.mockRejectedValueOnce(new Error('Erro de banco'));

    const res = await request(app)
      .delete('/api/setores/1')
      .set('Authorization', `Bearer ${gerarToken('gestor')}`);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Erro ao excluir setor.');
  });

});