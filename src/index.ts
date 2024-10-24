import express from 'express';
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import { setupCommentingSystemRoutes } from './middlewares/middleware';

// Define a union type to allow either mongoose.Connection or MongoClient
type MongoConnection = mongoose.Connection | MongoClient;

export const setupCommentingSystem = (app: express.Application, mongoConnection: MongoConnection) => {
  console.log('setupCommentingSystem called with:', mongoConnection);

  // Check if it's a mongoose.Connection
  if (isMongooseConnection(mongoConnection)) {
    console.log('Detected mongoose connection...');
    if (mongoConnection.readyState !== 1) {
      throw new Error('Mongoose connection is not established.');
    }
    console.log('Using Mongoose connection for the commenting system');
  }
  // Check if it's a MongoClient
  else if (isMongoClient(mongoConnection)) {
    console.log('Detected MongoClient connection...');
    try {
      // Attempt to access the database to verify connection
      mongoConnection.db(); // This will throw an error if not connected
      console.log('Using MongoClient connection for the commenting system');
    } catch (error) {
      console.error('MongoClient connection is not established:', error);
      throw new Error('MongoClient connection is not established.');
    }
  } else {
    console.error('Unknown MongoDB connection type');
    throw new Error('Unknown MongoDB connection type');
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
