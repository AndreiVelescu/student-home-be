import { Arg, ArgsType, Mutation, Resolver } from "type-graphql";
import * as fs from "fs";
import { FileUpload, GraphQLUpload } from "graphql-upload-ts";

import { v4 } from "uuid";
import { UploadInput } from "./types";
import { CaminRequest } from "../../prisma/generated/models";
import { CreateOneCaminRequestArgs } from "../../prisma/generated";

@Resolver()
class FileUploadResolver {
  @Mutation(() => String)
  async singleUpload(
    @Arg("file", () => GraphQLUpload)
    { createReadStream, filename }: FileUpload
  ) {
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
      return `/uploads/images/${newFilename}`;
    } else {
      throw new Error(`Invalid file extension: ${fileExtension}`);
    }
  }

  @Mutation(() => [String])
  async multipleUpload(
    @Arg("files", () => [GraphQLUpload])
    files: FileUpload[]
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
        filePaths.push(`/uploads/images/${newFilename}`);
      } else {
        throw new Error(`Invalid file extension: ${filename}`);
      }
    }
    return filePaths;
  }
}

export default FileUploadResolver;
