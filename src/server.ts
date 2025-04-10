import { ApolloServer } from "apollo-server-express";
import express from "express";
import http from "http";
import { getPrisma } from "../db";
import { verifyAccessToken } from "./service";
import { AuthenticationError } from "apollo-server-errors";
import { graphqlUploadExpress } from "graphql-upload-ts";
import path from "path";

let app;

export async function startServer(schema: any): Promise<any> {
  const cors = require("cors");
  const app: any = express();
  app.use("/uploads", express.static("public"));

  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

  app.use(
    cors({
      origin: ["http://localhost:3000", "https://studio.apollographql.com"],
      credentials: true,
    })
  );

  app.use((err: any, req: any, res: any, next: any) => {
    res
      .status(err.extensions ? err.extensions.status : 500)
      .send(err.extensions?.code);
  });

  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    ...schema,
    uploads: false,
    context: async ({ req }: any) => {
      if (isOperationPublic(req.body.operationName)) {
        return {
          prisma: getPrisma(),
          requestor: null,
          clientUrl: req.get("Origin"),
          session: req.session,
        };
      }
      const prisma = getPrisma();
      let requestor: any = null;
      try {
        requestor = await verifyAccessToken(req, prisma);
      } catch (e) {
        throw new AuthenticationError("Token expired or is not valid.");
      }
      return {
        prisma,
        requestor,
        clientUrl: req.get("Origin"),
        session: req.session,
      };
    },
  });

  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });
  const port = process.env.PORT ?? 4000;
  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));

  console.log(`🚀🚀🚀 Server ready at http://localhost:${port}`);

  return server;
}

module.exports = {
  startServer,
  app,
};

const isOperationPublic = (operationName: string) => {
  return (
    operationName === "SignIn" ||
    operationName === "SignUp" ||
    operationName === "RefreshToken" ||
    operationName === "IntrospectionQuery" ||
    operationName === "SingleUpload" || //temporary
    operationName === "MultipleUpload" ||
    operationName === "Camins" ||
    operationName === "CreateOneCaminRequest" //temporary
  );
};
