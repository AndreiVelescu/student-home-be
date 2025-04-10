import { buildSchema } from "type-graphql";
import { CustomResolvers, EnhancedResolvers } from "../src/resolvers";

export const getGraphqlSchema = async (): Promise<any> => {
  const schema = await buildSchema({
    resolvers: [...CustomResolvers, ...EnhancedResolvers],
    validate: false,
    globalMiddlewares: [],
  } as any);

  return {
    schema: schema,
    middleware: [],
  };
};
