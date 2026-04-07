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
</p>

---

## ✨ FUNCIONALIDADES

* 🔐 Autenticação com geração de token JWT
* 📦 Cadastro e gerenciamento de produtos com controle de estoque
* 🏢 Cadastro e gerenciamento de setores da instituição
* 👤 Gerenciamento de usuários com níveis de acesso
* 🔄 Registro de movimentações de estoque (entradas e saídas)
* 🧾 Rastreamento de solicitações de materiais por setor
* 📊 Geração de relatórios filtrados por período, setor e tipo
* ⚠️ Monitoramento de níveis mínimos de estoque com alertas automáticos
* 📥 Exportação de relatórios em CSV
* 🌐 Interface web responsiva para desktop, tablet e mobile

---

## 📁 ESTRUTURA DE PASTAS
```bash
estoque_if/
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
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── usuariosRoutes.js
│   │   ├── setoresRoutes.js
│   │   ├── produtosRoutes.js
│   │   ├── movimentacoesRoutes.js
│   │   └── solicitacoesRoutes.js
│   └── server.js
├── banco/
│   ├── schema.sql
│   └── seed.sql
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## 🛠️ PRINCIPAIS TECNOLOGIAS UTILIZADAS

* `HTML5` — Estruturação das páginas da aplicação
* `CSS3` — Estilização e design responsivo da interface
* `JavaScript` — Interatividade e comunicação com a API
* `Node.js` — Ambiente de execução JavaScript no servidor
* `Express.js` — Framework para criação da API REST
* `MySQL` — Banco de dados relacional
* `bcrypt` — Criptografia de senhas
* `jsonwebtoken` — Autenticação via token JWT
* `dotenv` — Gerenciamento de variáveis de ambiente
* `Nodemon` — Atualização automática no desenvolvimento

---

## 🔐 AUTENTICAÇÃO E SEGURANÇA

* Login com e-mail e senha criptografada via `bcrypt`
* Geração de token JWT com expiração configurável
* Middleware de autenticação protegendo todos os endpoints
* Senhas nunca armazenadas em texto puro no banco de dados
* Variáveis sensíveis isoladas no `.env` e fora do repositório
* Usuários inativos bloqueados automaticamente no login

---

## 👥 NÍVEIS DE ACESSO

| Perfil | Descrição |
|---|---|
| Gestor | Acesso total ao sistema |
| Coordenador | Acesso a produtos, movimentações e relatórios |
| Secretário | Acesso a solicitações e movimentações |
| Agente Administrativo | Acesso básico a solicitações |

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

## ⚙️ MIDDLEWARES

### 🔐 Autenticação JWT

* Valida o token antes de acessar qualquer rota protegida
* Retorna `401` se o token estiver ausente
* Retorna `403` se o token estiver expirado ou inválido

---

## 🗄️ BANCO DE DADOS

O sistema utiliza **MySQL** com as seguintes tabelas:

| Tabela | Descrição |
|---|---|
| `usuarios` | Contas com perfil e nível de acesso |
| `setores` | Departamentos da instituição |
| `produtos` | Materiais com quantidade atual e mínima |
| `movimentacoes` | Entradas e saídas vinculadas a produto, setor e usuário |
| `solicitacoes` | Pedidos de materiais com status de aprovação |

---

## 🚧 DIFICULDADES ENCONTRADAS

Durante o desenvolvimento, alguns desafios contribuíram para o aprendizado:

* 🔐 Implementação de autenticação JWT com bcrypt
* 🗄️ Modelagem do banco de dados relacional com chaves estrangeiras
* 🔗 Integração completa entre front-end, API REST e banco de dados
* 📱 Desenvolvimento de interface responsiva para múltiplos dispositivos
* 🧩 Organização do projeto em camadas (controllers, routes, middlewares)
* ⚠️ Implementação de alertas automáticos de estoque mínimo
* 👥 Controle de acesso por níveis de usuário

---

## 🧠 APRENDIZADOS

* Criação de APIs REST com Node.js e Express
* Autenticação e segurança com JWT e bcrypt
* Modelagem e manipulação de banco de dados MySQL
* Integração full stack entre front-end e back-end
* Desenvolvimento de interfaces responsivas com HTML, CSS e JS puro
* Estruturação de projetos em camadas
* Controle de versão com Git e GitHub

---

## 🚀 COMO RODAR LOCALMENTE

### Pré-requisitos

* [Node.js](https://nodejs.org/) instalado
* [MySQL](https://www.mysql.com/) instalado e rodando
* [MySQL Workbench](https://www.mysql.com/products/workbench/) (recomendado)

---

### 1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/estoque-if.git
cd estoque-if
```

### 2. Instale as dependências:
```bash
npm install
```

### 3. Configure o arquivo `.env`:

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:
```env
PORT=3000
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=estoque_if
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=8h
```

### 4. Configure o banco de dados:

Abra o **MySQL Workbench**, conecte ao seu servidor e execute os arquivos na seguinte ordem:
```bash
banco/schema.sql   # Cria o banco e as tabelas
banco/seed.sql     # Popula com dados iniciais
```

### 5. Inicie o servidor:
```bash
npm run dev
```

A API estará disponível em:

http://localhost:3000

### 6. Acesse o sistema:

Abra o arquivo `frontend/index.html` no navegador e use as credenciais:

E-mail: admin@ifce.edu.br
Senha:  admin123

---

## 🔐 SEGURANÇA

* Arquivo `.env` fora do repositório — credenciais nunca expostas
* Senhas criptografadas com `bcrypt` antes de salvar no banco
* Token JWT com expiração de 8 horas
* Usuários inativos bloqueados automaticamente no login

---

## 👤 AUTORES

Projeto desenvolvido como requisito acadêmico das disciplinas de **Engenharia de Software I e II** no **Instituto Federal do Ceará (IFCE) — Campus Crato**.

- [Iago Ferreira Silva](https://github.com/Iago-Ferreira-Silva)
- [Mikael Pereira da Silva](https://github.com/Mikaelpereiradasilva)
- [Jorge Felipe](https://github.com/jorgefelipe2)

---

## 📌 STATUS DO PROJETO

![Badge Em Desenvolvimento](https://img.shields.io/static/v1?label=STATUS\&message=EM%20DESENVOLVIMENTO\&color=yellow\&style=for-the-badge)

---