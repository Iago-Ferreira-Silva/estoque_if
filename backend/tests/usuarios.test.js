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

const mockUsuarios = [
  { id: 1, nome: 'Iago Ferreira', email: 'admin@ifce.edu.br',  perfil: 'gestor',      setor: 'Administrativo', ativo: 1 },
  { id: 2, nome: 'Maria Silva',   email: 'maria@ifce.edu.br',  perfil: 'secretario',  setor: 'Secretaria',     ativo: 1 },
  { id: 3, nome: 'João Mendes',   email: 'joao@ifce.edu.br',   perfil: 'coordenador', setor: 'Coordenação',    ativo: 1 },
  { id: 4, nome: 'Carlos Lima',   email: 'carlos@ifce.edu.br', perfil: 'agente',      setor: 'Almoxarifado',   ativo: 1 },
];

jest.mock('../config/db', () => ({
  execute: jest.fn(),
}));

const db = require('../config/db');

describe('GET /api/usuarios', () => {

  test('gestor deve listar usuários com dados corretos', async () => {
    db.execute.mockResolvedValueOnce([mockUsuarios]);

    const res = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${gerarToken('gestor')}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(4);
    expect(res.body[0].nome).toBe('Iago Ferreira');
    expect(res.body[0].perfil).toBe('gestor');
    expect(res.body[0]).not.toHaveProperty('senha');
  });

  test('agente não pode listar usuários', async () => {
    const res = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${gerarToken('agente')}`);

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('message');
  });

  test('deve retornar 401 sem token', async () => {
    const res = await request(app).get('/api/usuarios');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message');
  });

  test('deve retornar 500 quando banco falha', async () => {
    db.execute.mockRejectedValueOnce(new Error('Erro de banco'));

    const res = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${gerarToken('gestor')}`);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Erro ao listar usuários.');
  });

});

describe('POST /api/usuarios', () => {

  test('gestor deve criar usuário com sucesso', async () => {
    db.execute.mockResolvedValueOnce([{ insertId: 5 }]);

    const res = await request(app)
      .post('/api/usuarios')
      .set('Authorization', `Bearer ${gerarToken('gestor')}`)
      .send({
        nome: 'Novo Usuário', email: 'novo@ifce.edu.br',
        senha: 'senha123', perfil: 'agente', setor: 'Limpeza',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id', 5);
    expect(res.body.message).toBe('Usuário criado com sucesso.');
  });

  test('deve retornar 400 sem nome', async () => {
    const res = await request(app)
      .post('/api/usuarios')
      .set('Authorization', `Bearer ${gerarToken('gestor')}`)
      .send({ email: 'teste@test.com', senha: 'senha123', perfil: 'agente' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Preencha todos os campos obrigatórios.');
  });

  test('deve retornar 400 sem email', async () => {
    const res = await request(app)
      .post('/api/usuarios')
      .set('Authorization', `Bearer ${gerarToken('gestor')}`)
      .send({ nome: 'Teste', senha: 'senha123', perfil: 'agente' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Preencha todos os campos obrigatórios.');
  });

  test('deve retornar 400 sem senha', async () => {
    const res = await request(app)
      .post('/api/usuarios')
      .set('Authorization', `Bearer ${gerarToken('gestor')}`)
      .send({ nome: 'Teste', email: 'teste@test.com', perfil: 'agente' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Preencha todos os campos obrigatórios.');
  });

  test('deve retornar 400 sem perfil', async () => {
    const res = await request(app)
      .post('/api/usuarios')
      .set('Authorization', `Bearer ${gerarToken('gestor')}`)
      .send({ nome: 'Teste', email: 'teste@test.com', senha: 'senha123' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Preencha todos os campos obrigatórios.');
  });

  test('deve retornar 409 com e-mail duplicado', async () => {
    const erro = new Error('Duplicate entry');
    erro.code  = 'ER_DUP_ENTRY';
    db.execute.mockRejectedValueOnce(erro);

    const res = await request(app)
      .post('/api/usuarios')
      .set('Authorization', `Bearer ${gerarToken('gestor')}`)
      .send({
        nome: 'Duplicado', email: 'admin@ifce.edu.br',
        senha: 'senha123', perfil: 'agente', setor: 'Limpeza',
      });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe('E-mail já cadastrado.');
  });

  test('agente não pode criar usuário', async () => {
    const res = await request(app)
      .post('/api/usuarios')
      .set('Authorization', `Bearer ${gerarToken('agente')}`)
      .send({ nome: 'Teste', email: 'teste@test.com', senha: '12345678', perfil: 'agente' });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('message');
  });

  test('deve retornar 500 quando banco falha', async () => {
    db.execute.mockRejectedValueOnce(new Error('Erro de banco'));

    const res = await request(app)
      .post('/api/usuarios')
      .set('Authorization', `Bearer ${gerarToken('gestor')}`)
      .send({
        nome: 'Teste', email: 'teste@test.com',
        senha: 'senha123', perfil: 'agente', setor: 'Limpeza',
      });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Erro ao criar usuário.');
  });

});

describe('PUT /api/usuarios/:id', () => {

  test('gestor deve atualizar usuário sem senha', async () => {
    db.execute
      .mockResolvedValueOnce([[]])
      .mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await request(app)
      .put('/api/usuarios/2')
      .set('Authorization', `Bearer ${gerarToken('gestor')}`)
      .send({ nome: 'Maria Atualizada', email: 'maria@ifce.edu.br', perfil: 'secretario', setor: 'Secretaria' });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Usuário atualizado com sucesso.');
  });

  test('gestor deve atualizar usuário com senha de exatamente 8 caracteres', async () => {
    db.execute
      .mockResolvedValueOnce([[]])
      .mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await request(app)
      .put('/api/usuarios/2')
      .set('Authorization', `Bearer ${gerarToken('gestor')}`)
      .send({
        nome: 'Maria', email: 'maria@ifce.edu.br',
        perfil: 'secretario', setor: 'Secretaria',
        senha: '12345678',
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Usuário atualizado com sucesso.');
  });

  test('gestor deve atualizar usuário com senha longa', async () => {
    db.execute
      .mockResolvedValueOnce([[]])
      .mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await request(app)
      .put('/api/usuarios/2')
      .set('Authorization', `Bearer ${gerarToken('gestor')}`)
      .send({
        nome: 'Maria', email: 'maria@ifce.edu.br',
        perfil: 'secretario', setor: 'Secretaria',
        senha: 'senhaLonga123456',
      });

    expect(res.status).toBe(200);
  });

  test('deve retornar 409 ao atualizar com e-mail já em uso', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 3 }]]);

    const res = await request(app)
      .put('/api/usuarios/2')
      .set('Authorization', `Bearer ${gerarToken('gestor')}`)
      .send({ nome: 'Maria', email: 'joao@ifce.edu.br', perfil: 'secretario', setor: 'Secretaria' });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe('Este e-mail já está em uso por outro usuário.');
  });

  test('coordenador não pode atualizar usuário', async () => {
    const res = await request(app)
      .put('/api/usuarios/2')
      .set('Authorization', `Bearer ${gerarToken('coordenador')}`)
      .send({ nome: 'Editado' });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('message');
  });

  test('deve retornar 500 quando banco falha', async () => {
    db.execute.mockRejectedValueOnce(new Error('Erro de banco'));

    const res = await request(app)
      .put('/api/usuarios/2')
      .set('Authorization', `Bearer ${gerarToken('gestor')}`)
      .send({ nome: 'Teste', email: 'teste@test.com', perfil: 'agente', setor: 'Limpeza' });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Erro ao atualizar usuário.');
  });

});

describe('PATCH /api/usuarios/:id/status', () => {

  test('gestor deve alternar status do usuário', async () => {
    db.execute.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await request(app)
      .patch('/api/usuarios/2/status')
      .set('Authorization', `Bearer ${gerarToken('gestor')}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Status do usuário atualizado.');
  });

  test('agente não pode alternar status', async () => {
    const res = await request(app)
      .patch('/api/usuarios/2/status')
      .set('Authorization', `Bearer ${gerarToken('agente')}`);

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('message');
  });

  test('deve retornar 500 quando banco falha', async () => {
    db.execute.mockRejectedValueOnce(new Error('Erro de banco'));

    const res = await request(app)
      .patch('/api/usuarios/2/status')
      .set('Authorization', `Bearer ${gerarToken('gestor')}`);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Erro ao atualizar status.');
  });

});