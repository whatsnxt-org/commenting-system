import { config } from './config';
import express, { Express } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { graphqlHTTP } from 'express-graphql';
import mongoose from 'mongoose';
import { commentGraphQLSchema } from './graphql/schema';
import commentRoutes from './routes/commentRoutes';
const { swaggerUi, swaggerDocs } = require('./swagger/swagger'); // Import the Swagger config


const createInternalServer = (): Express => {
    const app = express();
    const PORT = process.env.PORT || 4000;

    // Connect to MongoDB
    mongoose.connect('mongodb://localhost:27017/comments')
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error(err));

    // Serve Swagger UI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

    // Apply middlewares
    app.use(cors());
    app.use(bodyParser.json());
    app.use('/api', commentRoutes);

    // GraphQL endpoint
    app.use('/graphql', graphqlHTTP({
        schema: commentGraphQLSchema,
        graphiql: true,
    }));

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });

    return app;
};

export default createInternalServer;