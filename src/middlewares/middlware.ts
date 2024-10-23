import { graphqlHTTP } from 'express-graphql';
import commentRoutes from '../routes/commentRoutes'; // Ensure the correct path to the commentRoutes file
import { commentGraphQLSchema } from '../graphql/schema'; // Adjust the path as necessary
import { Application } from 'express';

export const setupCommentingSystem = (app: Application) => {
    app.use('/api/comments', commentRoutes);
    app.use('/graphql', graphqlHTTP({
      schema: commentGraphQLSchema,
      graphiql: true,
    }));
};
  