import { setupCommentingSystemRoutes } from './middlewares/middlware'; // Import the core route setup logic
import { MongoClient } from 'mongodb'; // For MongoClient
import mongoose from 'mongoose'; // For mongoose
import express from 'express';

// Define a union type to allow either mongoose.Connection or MongoClient
type MongoConnection = mongoose.Connection | MongoClient;

// Function to setup the commenting system, including Mongo connection handling
export const setupCommentingSystem = (app: express.Application, mongoConnection: MongoConnection) => {
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
    } catch (error) {
      throw new Error('MongoClient connection is not established.');
    }
  }

  // Delegate route setup to middleware.ts
  setupCommentingSystemRoutes(app);
};

// Type guard to check if it's a Mongoose connection
function isMongooseConnection(connection: any): connection is mongoose.Connection {
  return connection instanceof mongoose.Connection;
}

// Type guard to check if it's a MongoClient
function isMongoClient(connection: any): connection is MongoClient {
  return connection instanceof MongoClient;
}
