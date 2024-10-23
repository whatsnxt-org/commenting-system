// src/index.ts
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import commentRoutes from './routes/commentRoutes';
import { graphqlHTTP } from 'express-graphql';
import { schema } from './graphql/schema';
import { config } from './config';
import cors from 'cors';
const {swaggerUi,swaggerDocs} = require('./swagger/swagger'); // Import the Swagger config


const app = express();
const PORT = process.env.PORT || 4000;

mongoose.connect('mongodb://localhost:27017/comments')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

  // Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(cors());
app.use(bodyParser.json());
app.use('/api', commentRoutes);

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export { default as commentRoutes } from './routes/commentRoutes';
export { schema as commentGraphQLSchema } from './graphql/schema';

