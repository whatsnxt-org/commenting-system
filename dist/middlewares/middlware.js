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
    app.use('/api/comments', commentRoutes_1.default);
    app.use('/graphql', (0, express_graphql_1.graphqlHTTP)({
        schema: schema_1.commentGraphQLSchema,
        graphiql: true,
    }));
};
exports.setupCommentingSystem = setupCommentingSystem;
