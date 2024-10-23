"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerDocs = exports.swaggerUi = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
exports.swaggerUi = swagger_ui_express_1.default;
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
    apis: ['./src/swagger/commentController.ts', './src/graphql/schema.ts'], // Path to the API docs
};
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
exports.swaggerDocs = swaggerDocs;
