import { Arg, Mutation, Resolver, ClassType } from "type-graphql";
import * as fs from "fs";
import { FileUpload, GraphQLUpload } from "graphql-upload-ts";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import { v4 } from "uuid";
import { UploadDocumentsInput } from "./types";

@Resolver(() => UploadDocumentsResolver)
class UploadDocumentsResolver {
  @Mutation(() => [String])
  async uploadDocuments(
    @Arg("files", () => [GraphQLUpload]) files: Promise<FileUpload>[]
  ): Promise<string[]> {
    const filePaths: string[] = [];
    const uploadDir = "./public/images";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    for (const filePromise of files) {
      const { createReadStream, filename } = await filePromise;
      const uuid = v4();
      const fileExtension = filename.split(".").pop()?.toLowerCase();
      if (
        fileExtension &&
        ["png", "jpg", "jpeg", "pdf"].includes(fileExtension)
      ) {
        const newFilename = `${uuid}.${fileExtension}`;

        const outPath = `./public/images/${newFilename}`;
        const stream = createReadStream();
        await new Promise((resolve: any, reject: any) => {
          const writeStream = fs.createWriteStream(outPath);
          stream.pipe(writeStream).on("finish", resolve).on("error", reject);
        });

        await filePaths.push(`/uploads/images/${newFilename}`);
      } else {
        throw new Error(`Invalid file extension: ${filename}`);
      }
    }
    return filePaths;
  }
}

export default UploadDocumentsResolver;
