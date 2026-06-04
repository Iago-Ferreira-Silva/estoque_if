// @ts-check
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  // Usa o Jest como executor dos testes
  testRunner: 'jest',

  // Arquivos que serão mutados
  // Focamos nos mais críticos do sistema
  mutate: [
    'backend/controllers/authController.js',
    'backend/controllers/produtosController.js',
    'backend/controllers/setoresController.js',
    'backend/controllers/usuariosController.js',
    'backend/middlewares/authMiddleware.js',
    'backend/middlewares/authorizeMiddleware.js',
  ],

  // Configuração do Jest para o Stryker
  jest: {
    projectType: 'custom',
    configFile:  'package.json',
  },

  // Relatório gerado ao final
  reporters: ['html', 'clear-text', 'progress'],

  // Pasta onde o relatório HTML será salvo
  htmlReporter: {
    fileName: 'reports/mutation/index.html',
  },

  // Ignora mutações em blocos de código
  // que não precisamos testar
  ignorePatterns: ['node_modules', 'coverage', 'frontend'],

  // Tempo máximo por teste em ms
  timeoutMS: 10000,
};

export default config;