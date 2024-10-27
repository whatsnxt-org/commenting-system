import { graphqlHTTP } from 'express-graphql';
import commentRoutes from '../routes/commentRoutes'; // Ensure the correct path to the commentRoutes file
import { commentGraphQLSchema } from '../graphql/schema'; // Adjust the path as necessary
import express from 'express';
import { INestApplication } from '@nestjs/common';

type AppType = express.Application | INestApplication;

export const setupCommentingSystemRoutes = (app: AppType) => {
  if (isExpressApp(app)) {
    // If the app is an Express app, use the Express-specific middleware setup
    app.use('/api/comments', commentRoutes);
    app.use('/graphql', graphqlHTTP({
      schema: commentGraphQLSchema,
      graphiql: true,
    }));
  } else if (isNestApp(app)) {
    // If the app is a NestJS app, use the built-in method to register middleware
    app.use('/api/comments', commentRoutes);
    app.use('/graphql', graphqlHTTP({
      schema: commentGraphQLSchema,
      graphiql: true,
    }));
  } else {
    throw new Error('Unknown app type. The app must be either an Express or a NestJS application.');
  }
};

// Type guard to check if the app is an Express application
function isExpressApp(app: any): app is express.Application {
  return 'use' in app && typeof app.use === 'function' && !('getHttpAdapter' in app);
}

// Type guard to check if the app is a NestJS application
function isNestApp(app: any): app is INestApplication {
  return 'getHttpAdapter' in app && typeof app.getHttpAdapter === 'function';
}
