# 📦 EstoqueIF

<p align="center">
  Sistema web desenvolvido para <strong>modernizar e automatizar o controle de materiais de consumo</strong> em instituições de ensino.<br/>
  Desenvolvido com <code>HTML</code>, <code>CSS</code>, <code>JavaScript</code>, <code>Node.js</code>, <code>Express</code> e <code>MySQL</code>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white"/>
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white"/>
</p>

---

## ✨ FUNCIONALIDADES

- 🔐 Autenticação com geração de token JWT
- 📦 Cadastro e gerenciamento de produtos com conversão de unidades
- 🏢 Cadastro e gerenciamento de setores da instituição
- 👤 Gerenciamento de usuários com níveis de acesso
- 🔄 Registro de movimentações de estoque com conversão automática entre unidades
- 🧾 Rastreamento de solicitações de materiais por setor
- 📊 Geração de relatórios filtrados por período, setor e tipo
- ⚠️ Monitoramento de níveis mínimos de estoque com alertas automáticos
- 📥 Exportação de relatórios em CSV
- 🔒 Autorização por perfil em rotas restritas, com produtos e movimentações liberados para usuários autenticados
- 🌐 Interface web responsiva para desktop, tablet e mobile

---

## 📁 ESTRUTURA DE PASTAS

```bash
estoque-if/
├── frontend/
│   ├── css/
│   │   ├── global.css
│   │   ├── layout.css
│   │   ├── login.css
│   │   ├── dashboard.css
│   │   ├── produtos.css
│   │   ├── movimentacoes.css
│   │   ├── solicitacoes.css
│   │   ├── relatorios.css
│   │   └── usuarios.css
│   ├── js/
│   │   ├── utils.js
│   │   ├── api.js
│   │   ├── login.js
│   │   ├── dashboard.js
│   │   ├── produtos.js
│   │   ├── setores.js
│   │   ├── movimentacoes.js
│   │   ├── solicitacoes.js
│   │   ├── relatorios.js
│   │   └── usuarios.js
│   ├── pages/
│   │   ├── login.html
│   │   ├── dashboard.html
│   │   ├── produtos.html
│   │   ├── setores.html
│   │   ├── movimentacoes.html
│   │   ├── solicitacoes.html
│   │   ├── relatorios.html
│   │   └── usuarios.html
│   └── index.html
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── usuariosController.js
│   │   ├── setoresController.js
│   │   ├── produtosController.js
│   │   ├── movimentacoesController.js
│   │   └── solicitacoesController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── authorizeMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── usuariosRoutes.js
│   │   ├── setoresRoutes.js
│   │   ├── produtosRoutes.js
│   │   ├── movimentacoesRoutes.js
│   │   └── solicitacoesRoutes.js
│   ├── tests/
│   │   ├── app.js
│   │   ├── auth.test.js
│   │   ├── middleware.test.js
│   │   ├── autorizacao.test.js
│   │   ├── produtos.test.js
│   │   ├── setores.test.js
│   │   └── usuarios.test.js
│   └── server.js
├── banco/
│   ├── schema.sql
│   └── seed.sql
├── stryker.config.mjs
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## 🛠️ PRINCIPAIS TECNOLOGIAS UTILIZADAS

- `HTML5` — Estruturação das páginas da aplicação
- `CSS3` — Estilização e design responsivo da interface
- `JavaScript` — Interatividade e comunicação com a API
- `Node.js` — Ambiente de execução JavaScript no servidor
- `Express.js` — Framework para criação da API REST
- `MySQL` — Banco de dados relacional
- `bcrypt` — Criptografia de senhas
- `jsonwebtoken` — Autenticação via token JWT
- `dotenv` — Gerenciamento de variáveis de ambiente
- `Jest` — Framework de testes unitários
- `Supertest` — Testes de integração HTTP
- `Stryker` — Testes de mutação
- `Nodemon` — Atualização automática no desenvolvimento

---

## 🔐 AUTENTICAÇÃO E SEGURANÇA

- Login com e-mail e senha criptografada via `bcrypt`
- Geração de token JWT com expiração configurável
- Middleware de autenticação protegendo todos os endpoints
- Middleware de autorização por perfil em rotas restritas
- Senhas nunca armazenadas em texto puro no banco de dados
- Variáveis sensíveis isoladas no `.env` e fora do repositório
- Usuários inativos bloqueados automaticamente no login

---

## 👥 NÍVEIS DE ACESSO

| Perfil      | Produtos | Setores  | Movimentações | Solicitações | Usuários |
| ----------- | -------- | -------- | ------------- | ------------ | -------- |
| Gestor      | ✅ Total | ✅ Total | ✅ Total      | ✅ Total     | ✅ Total |
| Coordenador | ✅ Total | ❌       | ✅ Registrar  | ✅ Criar/Ver | ❌       |
| Secretário  | ✅ Total | ❌       | ✅ Registrar  | ✅ Criar/Ver | ❌       |
| Agente Adm. | ✅ Total | ❌       | ✅ Registrar  | ✅ Criar/Ver | ❌       |

> Produtos e movimentações podem ser criados, editados e excluídos por qualquer usuário autenticado. A autorização por perfil é aplicada apenas em rotas específicas, como setores e usuários.

---

## 🧪 TESTES

### Cobertura de código

```bash
npm test
```

| Arquivo            | Cobertura |
| ------------------ | --------- |
| middlewares        | 100%      |
| routes             | 100%      |
| authController     | 90%       |
| produtosController | 96%       |
| setoresController  | 100%      |
| usuariosController | 100%      |
| **Geral**          | **~91%**  |

### Testes de mutação

```bash
npm run mutation
```

| Arquivo             | Score   |
| ------------------- | ------- |
| authMiddleware      | 100%    |
| authorizeMiddleware | 86%     |
| **Geral**           | **70%** |

### Tipos de testes

- `auth.test.js` — Testes de autenticação e JWT
- `middleware.test.js` — Testes dos middlewares de auth e autorização

* `autorizacao.test.js` — Testes de acesso por perfil em rotas restritas

- `produtos.test.js` — Testes de CRUD de produtos
- `setores.test.js` — Testes de CRUD de setores
- `usuarios.test.js` — Testes de CRUD de usuários

---

## 📦 ROTAS DA API

### 🔹 Autenticação

```bash
POST /api/auth/login
```

**Exemplo:**

```json
{
  "email": "admin@ifce.edu.br",
  "senha": "admin123"
}
```

---

### 🔹 Produtos

```bash
GET    /api/produtos
POST   /api/produtos
PUT    /api/produtos/:id
DELETE /api/produtos/:id
```

---

### 🔹 Setores

```bash
GET    /api/setores
POST   /api/setores
PUT    /api/setores/:id
DELETE /api/setores/:id
```

---

### 🔹 Movimentações

```bash
GET  /api/movimentacoes
POST /api/movimentacoes
```

---

### 🔹 Solicitações

```bash
GET   /api/solicitacoes
POST  /api/solicitacoes
PATCH /api/solicitacoes/:id/status
```

---

### 🔹 Usuários

```bash
GET   /api/usuarios
POST  /api/usuarios
PUT   /api/usuarios/:id
PATCH /api/usuarios/:id/status
```

---

### 🔹 Health Check

```bash
GET /api/health
```

---

## 🔄 CONVERSÃO DE UNIDADES

O sistema implementa conversão automática entre unidades de medida para garantir precisão no controle de estoque.

**Exemplo:**
Produto: Caneta Azul
Unidade principal: Caixa
Fator de conversão: 12 (1 caixa = 12 unidades)
Saída de 5 caixas → sistema registra 60 unidades no estoque

Unidades suportadas: `unidade`, `caixa`, `pacote`, `litro`, `quilo` e suas subdivisões.

---

## 🗄️ BANCO DE DADOS

O sistema utiliza **MySQL** com as seguintes tabelas:

| Tabela          | Descrição                                               |
| --------------- | ------------------------------------------------------- |
| `usuarios`      | Contas com perfil e nível de acesso                     |
| `setores`       | Departamentos da instituição                            |
| `produtos`      | Materiais com unidade, fator de conversão e quantidades |
| `movimentacoes` | Entradas e saídas com conversão automática de unidades  |
| `solicitacoes`  | Pedidos de materiais com status de aprovação            |

---

## 🚀 COMO RODAR LOCALMENTE

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado
- [MySQL](https://www.mysql.com/) instalado e rodando
- [MySQL Workbench](https://www.mysql.com/products/workbench/) (recomendado)

---

### 1. Clone o repositório

```bash
git clone https://github.com/Iago-Ferreira-Silva/sistema_estoque.git
cd sistema_estoque
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o arquivo `.env`

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=estoque_if
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=8h
```

### 4. Configure o banco de dados

Abra o **MySQL Workbench** e execute os arquivos na seguinte ordem:

```bash
banco/schema.sql   # Cria o banco e as tabelas
banco/seed.sql     # Popula com dados iniciais
```

### 5. Inicie o servidor

```bash
npm run dev
```

### 6. Acesse o sistema

Abra o arquivo `frontend/index.html` no navegador e use as credenciais:
E-mail: admin@ifce.edu.br
Senha: admin123

---

## 🧪 RODANDO OS TESTES

```bash
# Testes unitários com cobertura
npm test

# Testes de mutação
npm run mutation
```

---

## 🚧 DIFICULDADES ENCONTRADAS

- 🔐 Implementação de autenticação JWT com bcrypt
- 🗄️ Modelagem do banco de dados relacional com chaves estrangeiras
- 🔗 Integração completa entre front-end, API REST e banco de dados
- 📱 Desenvolvimento de interface responsiva para múltiplos dispositivos
- 🔄 Implementação de conversão automática entre unidades de medida
- 🧩 Autorização por perfil aplicada onde necessário no front-end e em rotas restritas da API
- 🧪 Configuração de testes unitários e de mutação com mocks de banco de dados

---

## 🧠 APRENDIZADOS

- Criação de APIs REST com Node.js e Express
- Autenticação e segurança com JWT e bcrypt
- Modelagem e manipulação de banco de dados MySQL
- Integração full stack entre front-end e back-end
- Desenvolvimento de interfaces responsivas com HTML, CSS e JS puro
- Estruturação de projetos em camadas (controllers, routes, middlewares)
- Testes unitários, de integração, de autorização e de mutação
- Conversão e controle de unidades de medida em sistemas de estoque

---

## 🔐 SEGURANÇA

- Arquivo `.env` fora do repositório — credenciais nunca expostas
- Senhas criptografadas com `bcrypt` antes de salvar no banco
- Token JWT com expiração de 8 horas
- Autorização por perfil verificada em rotas restritas da API
- Usuários inativos bloqueados automaticamente no login

---

## 👤 AUTORES

Projeto desenvolvido como requisito acadêmico das disciplinas de **Engenharia de Software I e II** no **Instituto Federal do Ceará (IFCE) — Campus Crato**.

- [Iago Ferreira Silva](https://github.com/Iago-Ferreira-Silva)
- [Mikael Pereira da Silva](https://github.com/Mikaelpereiradasilva)
- [Jorge Felipe](https://github.com/jorgefelipe2)

---

## 📌 STATUS DO PROJETO

![Badge Concluído](https://img.shields.io/static/v1?label=STATUS&message=CONCLU%C3%8DDO&color=brightgreen&style=for-the-badge)

---
