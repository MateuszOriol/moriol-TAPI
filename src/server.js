import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import resolvers from './graphql/resolvers/resolvers.js';
import schema from './graphql/schema/schema.js';

const startServer = async () => {
  const app = express();

  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
  });

  await server.start();

  server.applyMiddleware({ app });

  const PORT = 3000;

  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startServer().catch(error => {
  console.error('Error starting the server:', error);
});
