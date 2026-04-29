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
    ]
  },
  apis: [
    "./src/routes/**/*.ts",
    "./src/routes/**/*.js"
  ]
};

export default swaggerOptions;