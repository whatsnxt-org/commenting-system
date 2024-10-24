"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupCommentingSystem = void 0;
const body_parser_1 = __importDefault(require("body-parser"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const express_graphql_1 = require("express-graphql");
const schema_1 = require("./graphql/schema");
const cors_1 = __importDefault(require("cors"));
const mongodb_1 = require("mongodb"); // For MongoClient
const mongoose_1 = __importDefault(require("mongoose")); // For mongoose
const swagger_1 = require("./swagger/swagger");
// Function to setup the commenting system
const setupCommentingSystem = (app, mongoConnection) => {
    // Check if mongoConnection is mongoose.Connection
    if (isMongooseConnection(mongoConnection)) {
        // Mongoose connection logic
        if (mongoConnection.readyState !== 1) {
            throw new Error('Mongoose connection is not established.');
        }
        console.log('Using Mongoose connection for the commenting system');
    }
    else if (isMongoClient(mongoConnection)) {
        // MongoClient connection logic
        try {
            // Attempt to access the database to verify connection
            mongoConnection.db(); // This throws an error if not connected
            console.log('Using MongoClient connection for the commenting system');
        }
        catch (error) {
            throw new Error('MongoClient connection is not established.');
        }
    }
    // Setup the commenting system routes and middleware
    app.use('/api-docs', swagger_1.swaggerUi.serve, swagger_1.swaggerUi.setup(swagger_1.swaggerDocs));
    app.use((0, cors_1.default)());
    app.use(body_parser_1.default.json());
    app.use('/api', commentRoutes_1.default);
    app.use('/graphql', (0, express_graphql_1.graphqlHTTP)({
        schema: schema_1.commentGraphQLSchema,
        graphiql: true,
    }));
};
exports.setupCommentingSystem = setupCommentingSystem;
// Type guard to check if it's a Mongoose connection
function isMongooseConnection(connection) {
    return connection instanceof mongoose_1.default.Connection;
}
// Type guard to check if it's a MongoClient
function isMongoClient(connection) {
    return connection instanceof mongodb_1.MongoClient;
}
