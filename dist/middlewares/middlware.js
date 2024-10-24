"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupCommentingSystem = void 0;
const express_graphql_1 = require("express-graphql");
const commentRoutes_1 = __importDefault(require("../routes/commentRoutes")); // Ensure the correct path to the commentRoutes file
const schema_1 = require("../graphql/schema"); // Adjust the path as necessary
const setupCommentingSystem = (app) => {
    // If the app is a NestJS app, get the underlying Express instance
    const expressApp = isNestApp(app) ? app.getHttpAdapter().getInstance() : app;
    // Now apply the middleware to the Express instance
    expressApp.use('/api/comments', commentRoutes_1.default);
    expressApp.use('/graphql', (0, express_graphql_1.graphqlHTTP)({
        schema: schema_1.commentGraphQLSchema,
        graphiql: true,
    }));
};
exports.setupCommentingSystem = setupCommentingSystem;
// Utility to check if the app is a NestJS application
function isNestApp(app) {
    return !!app.getHttpAdapter;
}
