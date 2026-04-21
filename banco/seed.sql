USE estoque_if;

-- SETORES
INSERT INTO setores (nome, responsavel, descricao) VALUES
  ('Secretaria',     'Maria Silva',  'Documentação e atendimento'),
  ('Coordenação',    'João Mendes',  'Gestão pedagógica'),
  ('Almoxarifado',   'Carlos Lima',  'Armazenamento geral'),
  ('Limpeza',        'Ana Souza',    'Higiene e conservação'),
  ('Administrativo', 'Pedro Costa',  'Gestão administrativa');

-- PRODUTOS
INSERT INTO produtos (nome, categoria, unidade, qtd_atual, qtd_minima) VALUES
  ('Papel A4',          'escritorio', 'pct', 2,  10),
  ('Detergente 500ml',  'limpeza',    'un',  5,  8),
  ('Caneta Azul',       'escritorio', 'cx',  1,  5),
  ('Álcool 70%',        'limpeza',    'lt',  20, 5),
  ('Papel Toalha',      'higiene',    'pct', 15, 10);

-- ================================
-- USUÁRIOS
-- Senha de todos: admin123
-- Hash bcrypt gerado com salt 10
-- ================================
INSERT INTO usuarios (nome, email, senha, perfil, setor, ativo) VALUES
  (
    'Iago Ferreira',
    'admin@ifce.edu.br',
    '$2b$10$7QzV1JMBBmSYtFNSNbForOWBH1YbIQE8Z25AmRGJrGKEFMIiuqXDi',
    'gestor',
    'Administrativo',
    1
  ),
  (
    'Maria Silva',
    'maria@ifce.edu.br',
    '$2b$10$7QzV1JMBBmSYtFNSNbForOWBH1YbIQE8Z25AmRGJrGKEFMIiuqXDi',
    'secretario',
    'Secretaria',
    1
  ),
  (
    'João Mendes',
    'joao@ifce.edu.br',
    '$2b$10$7QzV1JMBBmSYtFNSNbForOWBH1YbIQE8Z25AmRGJrGKEFMIiuqXDi',
    'coordenador',
    'Coordenação',
    1
  ),
  (
    'Carlos Lima',
    'carlos@ifce.edu.br',
    '$2b$10$7QzV1JMBBmSYtFNSNbForOWBH1YbIQE8Z25AmRGJrGKEFMIiuqXDi',
    'agente',
    'Almoxarifado',
    1
  );

-- MOVIMENTAÇÕES
INSERT INTO movimentacoes (produto_id, setor_id, usuario_id, tipo, quantidade, observacao) VALUES
  (4, 3, 1, 'entrada', 10, 'Reposição mensal'),
  (1, 1, 2, 'saida',   3,  NULL),
  (3, 2, 3, 'saida',   5,  'Uso em reunião'),
  (2, 3, 4, 'entrada', 6,  NULL),
  (5, 4, 4, 'saida',   2,  NULL);

-- SOLICITAÇÕES
INSERT INTO solicitacoes (produto_id, setor_id, usuario_id, quantidade, justificativa, status) VALUES
  (1, 1, 2, 5,  'Reposição urgente',    'pendente'),
  (4, 4, 4, 10, NULL,                   'pendente'),
  (3, 2, 3, 20, 'Uso em reunião',       'aprovada'),
  (2, 3, 4, 6,  NULL,                   'aprovada'),
  (5, 5, 1, 4,  'Estoque insuficiente', 'recusada');