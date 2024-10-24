"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupCommentingSystem = void 0;
const middlware_1 = require("./middlewares/middlware"); // Import the core route setup logic
const mongodb_1 = require("mongodb"); // For MongoClient
const mongoose_1 = __importDefault(require("mongoose")); // For mongoose
// Function to setup the commenting system, including Mongo connection handling
const setupCommentingSystem = (app, mongoConnection) => {
    // Check if it's a mongoose.Connection
    if (isMongooseConnection(mongoConnection)) {
        if (mongoConnection.readyState !== 1) {
            throw new Error('Mongoose connection is not established.');
        }
        console.log('Using Mongoose connection for the commenting system');
    }
    // Check if it's a MongoClient
    else if (isMongoClient(mongoConnection)) {
        try {
            // Attempt to access the database to verify connection
            mongoConnection.db(); // This will throw an error if not connected
            console.log('Using MongoClient connection for the commenting system');
        }
        catch (error) {
            throw new Error('MongoClient connection is not established.');
        }
    }
    // Delegate route setup to middleware.ts
    (0, middlware_1.setupCommentingSystemRoutes)(app);
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
