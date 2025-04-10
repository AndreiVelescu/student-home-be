import { resolvers } from "../../prisma/generated";
import AuthResolver from "./auth.resolver";
import CaminRequestResolver from "./camin-req.resolver";
import FileUploadResolver from "./file-upload.resolver";
import UploadDocumentsResolver from "./uploadDocuments-resolver";

export const CustomResolvers = [
  AuthResolver,
  FileUploadResolver,
  UploadDocumentsResolver,
  CaminRequestResolver,
];

export const EnhancedResolvers = resolvers;
