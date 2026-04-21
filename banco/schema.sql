CREATE DATABASE IF NOT EXISTS estoque_if
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE estoque_if;

-- TABELA: usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id          INT           NOT NULL AUTO_INCREMENT,
  nome        VARCHAR(100)  NOT NULL,
  email       VARCHAR(100)  NOT NULL UNIQUE,
  senha       VARCHAR(255)  NOT NULL,
  perfil      ENUM('gestor','coordenador','secretario','agente') NOT NULL DEFAULT 'agente',
  setor       VARCHAR(100),
  ativo       TINYINT(1)    NOT NULL DEFAULT 1,
  criado_em   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- TABELA: setores
CREATE TABLE IF NOT EXISTS setores (
  id            INT           NOT NULL AUTO_INCREMENT,
  nome          VARCHAR(100)  NOT NULL,
  responsavel   VARCHAR(100),
  descricao     VARCHAR(255),
  criado_em     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- TABELA: produtos
CREATE TABLE IF NOT EXISTS produtos (
  id            INT           NOT NULL AUTO_INCREMENT,
  nome          VARCHAR(100)  NOT NULL,
  categoria     ENUM('limpeza','escritorio','higiene') NOT NULL,
  unidade       ENUM('un','cx','pct','lt','kg')        NOT NULL DEFAULT 'un',
  qtd_atual     INT           NOT NULL DEFAULT 0,
  qtd_minima    INT           NOT NULL DEFAULT 0,
  descricao     VARCHAR(255),
  criado_em     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- TABELA: movimentacoes
CREATE TABLE IF NOT EXISTS movimentacoes (
  id              INT           NOT NULL AUTO_INCREMENT,
  produto_id      INT           NOT NULL,
  setor_id        INT           NOT NULL,
  usuario_id      INT           NOT NULL,
  tipo            ENUM('entrada','saida') NOT NULL,
  quantidade      INT           NOT NULL,
  observacao      VARCHAR(255),
  criado_em       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (produto_id)  REFERENCES produtos(id)   ON DELETE RESTRICT,
  FOREIGN KEY (setor_id)    REFERENCES setores(id)    ON DELETE RESTRICT,
  FOREIGN KEY (usuario_id)  REFERENCES usuarios(id)   ON DELETE RESTRICT
);

-- TABELA: solicitacoes
CREATE TABLE IF NOT EXISTS solicitacoes (
  id              INT           NOT NULL AUTO_INCREMENT,
  produto_id      INT           NOT NULL,
  setor_id        INT           NOT NULL,
  usuario_id      INT           NOT NULL,
  quantidade      INT           NOT NULL,
  justificativa   VARCHAR(255),
  status          ENUM('pendente','aprovada','recusada') NOT NULL DEFAULT 'pendente',
  criado_em       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (produto_id)  REFERENCES produtos(id)   ON DELETE RESTRICT,
  FOREIGN KEY (setor_id)    REFERENCES setores(id)    ON DELETE RESTRICT,
  FOREIGN KEY (usuario_id)  REFERENCES usuarios(id)   ON DELETE RESTRICT
);