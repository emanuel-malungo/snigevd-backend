import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SNIGEVD API",
      version: "1.0.0",
      description: "API da plataforma SNIGEVD"
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Servidor de Desenvolvimento Local"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      { name: 'Autenticação', description: 'Endpoints para login e registo' },
      { name: 'Dashboard', description: 'Estatísticas e monitorização global' },
      { name: 'Utilizadores', description: 'Gestão de perfis e acesso' },
      { name: 'Escolas', description: 'Controlo administrativo de instituições de ensino' },
      { name: 'Estudantes', description: 'Supervisão global de alunos' },
      { name: 'Instituições', description: 'Gestão de entidades governamentais' },
      { name: 'Permissões', description: 'Gestão de ACL e permissões granulares' },
    ],
  },

  apis: [
    "./src/routes/**/*.ts",
    "./src/routes/**/*.js"
  ]
};

export default swaggerOptions;