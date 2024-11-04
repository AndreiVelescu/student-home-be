import { ApolloServer } from 'apollo-server-express';
import { HttpLink, InMemoryCache } from '@apollo/client';
import express from 'express';
import http from 'http';
import { getPrisma } from '../db';

let app;

export async function startServer(schema:any): Promise<any> {
  
  const cors = require('cors');
  const app:any = express();
  
  app.use(cors({
    origin: ['http://localhost:3000', 'https://studio.apollographql.com'],
    credentials: true,  
  }));
  
  app.use((err:any, req:any, res:any, next:any) => {
    res.status(err.extensions ? err.extensions.status : 500).send(err.extensions?.code);
  });

  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    ...schema,
    context: ({ req }: any) => {
      return {
        prisma: getPrisma(),
        requestor: req.requestor,
        clientUrl: req.get('Origin'),
        session: req.session,
      };
    },
    
  });
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });
  const port = process.env.PORT ?? 4000;
  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));

  console.log(`🚀🚀🚀 Server ready at http://localhost:${port}`);

  return server;
}


module.exports = {
  startServer,
  app,
};