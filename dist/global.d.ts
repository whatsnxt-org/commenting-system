export interface SetupOptions {
  elementId: string;
  apiKey: string;
  theme?: string;
}

// Declare the module for 'commenting-system' package
declare module 'comment-system' {
  import { Application as ExpressApplication } from 'express';
  import { INestApplication } from '@nestjs/common';
  import { MongoClient } from 'mongodb';
  import { Connection as MongooseConnection } from 'mongoose';

  // Define a union type that can accept either a Mongoose Connection or MongoClient
  type MongoConnection = MongooseConnection | MongoClient;

  // Define a compatible app type that can be either Express or NestJS
  type CompatibleApp = ExpressApplication | INestApplication;

  // Exporting the setupCommentingSystem function
  export function setupCommentingSystem(app: CompatibleApp, mongoConnection: MongoConnection): void;

  // Exporting REST routes and GraphQL schema for the comment system
  export const commentRoutes: any;
  export const commentGraphQLSchema: any;
}

