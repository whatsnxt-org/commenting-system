import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Comments API',
      version: '1.0.0',
      description: 'API for managing comments',
    },
    servers: [
      {
        url: 'http://localhost:4000',
      },
    ],
  },
  apis: ['./src/swagger/commentController.ts','./src/graphql/schema.ts'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerUi, swaggerDocs };
