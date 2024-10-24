export interface SetupOptions {
  elementId: string;
  apiKey: string;
  theme?: string;
}

// Declare the module for 'commenting-system' package
declare module 'comment-system' {
  import { Application as ExpressApplication } from 'express';
  import { INestApplication } from '@nestjs/common';

  // Define a compatible app type that can be either Express or NestJS
  type CompatibleApp = ExpressApplication | INestApplication;

  // Exporting the setupCommentingSystem function
  export function setupCommentingSystem(app: CompatibleApp): void;

  // Exporting REST routes and GraphQL schema for the comment system
  export const commentRoutes: any;
  export const commentGraphQLSchema: any;
}
