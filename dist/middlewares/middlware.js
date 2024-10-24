"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupCommentingSystemRoutes = void 0;
const express_graphql_1 = require("express-graphql");
const commentRoutes_1 = __importDefault(require("../routes/commentRoutes")); // Ensure the correct path to the commentRoutes file
const schema_1 = require("../graphql/schema"); // Adjust the path as necessary
const setupCommentingSystemRoutes = (app) => {
    // If the app is a NestJS app, get the underlying Express instance
    const expressApp = isNestApp(app) ? app.getHttpAdapter().getInstance() : app;
    console.log('Setting up comment routes...');
    // Register the comment routes with namespace
    expressApp.use('/api/comments', commentRoutes_1.default);
    // Register the GraphQL middleware for comments
    expressApp.use('/api/comments/graphql', (0, express_graphql_1.graphqlHTTP)({
        schema: schema_1.commentGraphQLSchema,
        graphiql: true,
    }));
    console.log('Comment routes successfully set up!');
};
exports.setupCommentingSystemRoutes = setupCommentingSystemRoutes;
// Utility to check if the app is a NestJS application
function isNestApp(app) {
    return !!app.getHttpAdapter;
}
