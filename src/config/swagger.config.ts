import type { Express } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "../shared/utils/swaggerOptions.utils.js";

// Gera a especificação do Swagger ANTES de usá-la
const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const swaggerDocs = (app: Express): void => {
  // Servir arquivos estáticos do Swagger UI
  app.use("/api-docs", swaggerUi.serve);
  
  // Rota para a página HTML do Swagger UI
  app.get("/api-docs", swaggerUi.setup(swaggerSpec, {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      displayOperationId: false,
      filter: true,
      showRequestHeaders: true,
      layout: "BaseLayout",
      defaultModelsExpandDepth: 1,
      defaultModelExpandDepth: 1,
      docExpansion: "list"
    },
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .logo { display: none }
      .swagger-ui .info .title { color: #48b37d; font-weight: bold; font-size: 2em; }
      .swagger-ui .info .description { font-size: 1.1em; color: #424242; }
      .swagger-ui .btn { background-color: #48b37d; border-color: #48b37d; color: #fff; }
      .swagger-ui .btn:hover { background-color: #339663; border-color: #339663; }
      .swagger-ui .btn.cancel { background-color: #bdbdbd; border-color: #bdbdbd; }
      .swagger-ui .btn.cancel:hover { background-color: #9e9e9e; border-color: #9e9e9e; }
      .swagger-ui .method.get { color: #2196f3; }
      .swagger-ui .method.post { color: #48b37d; }
      .swagger-ui .method.put { color: #f28565; }
      .swagger-ui .method.patch { color: #ffc107; }
      .swagger-ui .method.delete { color: #f44336; }
      .swagger-ui .opblock-tag { background: #f5f5f5; border: 1px solid #e0e0e0; border-left: 4px solid #48b37d; }
      .swagger-ui .opblock-tag-section { border-bottom: 2px solid #e0e0e0; }
      .swagger-ui .scheme-container { background: #fafafa; border: 1px solid #e0e0e0; }
      .swagger-ui .model-container { border: 1px solid #e0e0e0; border-left: 4px solid #48b37d; }
      .swagger-ui .response-col_status { color: #48b37d; font-weight: 600; }
      .swagger-ui .opblock.opblock-get { border-color: #2196f3; background: rgba(33, 150, 243, 0.05); }
      .swagger-ui .opblock.opblock-post { border-color: #48b37d; background: rgba(72, 179, 125, 0.05); }
      .swagger-ui .opblock.opblock-put { border-color: #f28565; background: rgba(242, 133, 101, 0.05); }
      .swagger-ui .opblock.opblock-patch { border-color: #ffc107; background: rgba(255, 193, 7, 0.05); }
      .swagger-ui .opblock.opblock-delete { border-color: #f44336; background: rgba(244, 67, 54, 0.05); }
      .swagger-ui .prop-name { color: #339663; font-weight: 600; }
      .swagger-ui .property-row { border-bottom: 1px solid #f5f5f5; }
      .swagger-ui .parameter__name { color: #48b37d; font-weight: 600; }
    `,
    customSiteTitle: "SNIGEVD API Documentation",
    swaggerUrl: "/api-docs"
  }));
};