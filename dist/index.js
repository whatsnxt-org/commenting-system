"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const express_graphql_1 = require("express-graphql");
const schema_1 = require("./graphql/schema");
const cors_1 = __importDefault(require("cors"));
const { swaggerUi, swaggerDocs } = require('./swagger/swagger'); // Import the Swagger config
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
mongoose_1.default.connect('mongodb://localhost:27017/comments')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));
// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use('/api', commentRoutes_1.default);
app.use('/graphql', (0, express_graphql_1.graphqlHTTP)({
    schema: schema_1.schema,
    graphiql: true,
}));
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
