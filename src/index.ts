import express from 'express';
import bodyParser from 'body-parser';
import commentRoutes from './routes/commentRoutes';
import { graphqlHTTP } from 'express-graphql';
import { commentGraphQLSchema } from './graphql/schema';
import cors from 'cors';
import { MongoClient } from 'mongodb'; // For MongoClient
import mongoose from 'mongoose'; // For mongoose
import { swaggerUi, swaggerDocs } from './swagger/swagger';

// Define a union type to allow either mongoose.Connection or MongoClient
type MongoConnection = mongoose.Connection | MongoClient;

// Function to setup the commenting system
export const setupCommentingSystem = (app: express.Application, mongoConnection: MongoConnection) => {
  // Check if mongoConnection is mongoose.Connection
  if (isMongooseConnection(mongoConnection)) {
    // Mongoose connection logic
    if (mongoConnection.readyState !== 1) {
      throw new Error('Mongoose connection is not established.');
    }
    console.log('Using Mongoose connection for the commenting system');
  } else if (isMongoClient(mongoConnection)) {
    // MongoClient connection logic
    try {
      // Attempt to access the database to verify connection
      mongoConnection.db(); // This throws an error if not connected
      console.log('Using MongoClient connection for the commenting system');
    } catch (error) {
      throw new Error('MongoClient connection is not established.');
    }
  }

  // Setup the commenting system routes and middleware
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  app.use(cors());
  app.use(bodyParser.json());
  app.use('/api', commentRoutes);

  app.use('/graphql', graphqlHTTP({
    schema: commentGraphQLSchema,
    graphiql: true,
  }));
};

// Type guard to check if it's a Mongoose connection
function isMongooseConnection(connection: any): connection is mongoose.Connection {
  return connection instanceof mongoose.Connection;
}

// Type guard to check if it's a MongoClient
function isMongoClient(connection: any): connection is MongoClient {
  return connection instanceof MongoClient;
}
