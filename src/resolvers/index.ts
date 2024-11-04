import { resolvers } from "../../prisma/generated";
import AuthResolver from "./auth.resolver";

export const CustomResolvers = [
    AuthResolver,
]



export const EnhancedResolvers = resolvers;
