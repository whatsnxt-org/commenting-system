import { graphqlHTTP } from 'express-graphql';
import commentRoutes from '../routes/commentRoutes'; // Ensure the correct path to the commentRoutes file
import { commentGraphQLSchema } from '../graphql/schema'; // Adjust the path as necessary
import { Application as ExpressApplication } from 'express';
import { INestApplication } from '@nestjs/common';

type CompatibleApp = ExpressApplication | INestApplication;

export const setupCommentingSystem = (app: CompatibleApp) => {
  // If the app is a NestJS app, get the underlying Express instance
  const expressApp = isNestApp(app) ? app.getHttpAdapter().getInstance() : app;

  // Now apply the middleware to the Express instance
  expressApp.use('/api/comments', commentRoutes);
  expressApp.use('/graphql', graphqlHTTP({
    schema: commentGraphQLSchema,
    graphiql: true,
  }));
};

// Utility to check if the app is a NestJS application
function isNestApp(app: any): app is INestApplication {
  return !!(app as INestApplication).getHttpAdapter;
}