const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware      = require('../middlewares/authMiddleware');
const authorizeMiddleware = require('../middlewares/authorizeMiddleware');

function criarReq(token, perfil) {
  return {
    headers: { authorization: token ? `Bearer ${token}` : undefined },
    usuario: perfil ? { id: 1, nome: 'Teste', perfil } : undefined,
  };
}

function criarRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
}

describe('authMiddleware', () => {

  test('deve chamar next() quando token válido', () => {
    const token = jwt.sign(
      { id: 1, perfil: 'gestor' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const req  = criarReq(token);
    const res  = criarRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.usuario).toBeDefined();
    expect(req.usuario.perfil).toBe('gestor');
  });

  test('deve retornar 401 quando token ausente', () => {
    const req  = criarReq(null);
    const res  = criarRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.any(String) })
    );
    expect(next).not.toHaveBeenCalled();
  });

  test('deve retornar 403 quando token inválido', () => {
    const req  = criarReq('token-invalido');
    const res  = criarRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.any(String) })
    );
    expect(next).not.toHaveBeenCalled();
  });

  test('deve retornar 403 quando token expirado', () => {
    const token = jwt.sign(
      { id: 1, perfil: 'gestor' },
      process.env.JWT_SECRET,
      { expiresIn: '-1s' }
    );

    const req  = criarReq(token);
    const res  = criarRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

});

describe('authorizeMiddleware', () => {

  test('deve chamar next() quando perfil é gestor', () => {
    const req  = criarReq(null, 'gestor');
    const res  = criarRes();
    const next = jest.fn();

    authorizeMiddleware('gestor')(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('deve chamar next() quando perfil é coordenador e ambos permitidos', () => {
    const req  = criarReq(null, 'coordenador');
    const res  = criarRes();
    const next = jest.fn();

    authorizeMiddleware('gestor', 'coordenador')(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('deve retornar 403 quando agente tenta acessar rota de gestor', () => {
    const req  = criarReq(null, 'agente');
    const res  = criarRes();
    const next = jest.fn();

    authorizeMiddleware('gestor')(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.any(String) })
    );
    expect(next).not.toHaveBeenCalled();
  });

  test('deve retornar 403 quando secretario tenta acessar rota restrita', () => {
    const req  = criarReq(null, 'secretario');
    const res  = criarRes();
    const next = jest.fn();

    authorizeMiddleware('gestor', 'coordenador')(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test('deve retornar 401 quando usuário não autenticado', () => {
    const req  = { usuario: null };
    const res  = criarRes();
    const next = jest.fn();

    authorizeMiddleware('gestor')(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.any(String) })
    );
    expect(next).not.toHaveBeenCalled();
  });

  test('deve permitir todos os perfis quando todos listados', () => {
    for (const perfil of ['gestor', 'coordenador', 'secretario', 'agente']) {
      const req  = criarReq(null, perfil);
      const res  = criarRes();
      const next = jest.fn();

      authorizeMiddleware('gestor', 'coordenador', 'secretario', 'agente')(req, res, next);

      expect(next).toHaveBeenCalled();
    }
  });

});