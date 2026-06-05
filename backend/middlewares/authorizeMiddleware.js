// MIDDLEWARE DE AUTORIZAÇÃO
// Retorna um middleware que verifica
// se o usuário tem o perfil mínimo
// exigido para acessar a rota
function authorize(...perfisPermitidos) {
  return (req, res, next) => {
    const perfil = req.usuario?.perfil;

    if (!perfil) {
      return res.status(401).json({ message: 'Não autenticado.' });
    }

    if (!perfisPermitidos.includes(perfil)) {
      return res.status(403).json({
        message: `Acesso negado. Esta ação requer perfil: ${perfisPermitidos.join(' ou ')}.`,
      });
    }

    next();
  };
}

module.exports = authorize;