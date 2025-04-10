import * as fs from "fs";
import { FileUpload } from "graphql-upload-ts";
import { v4 } from "uuid";

export const uploadFile = async ({
  filename,
  createReadStream,
}: FileUpload) => {
  const uuid = v4();
  const fileExtension = filename.split(".").pop()?.toLowerCase();
  if (fileExtension && ["png", "jpg", "jpeg", "pdf"].includes(fileExtension)) {
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
};

export const uploadFiles = async (files: FileUpload[]) => {
  return Promise.all(files.map((file) => uploadFile(file)));
};
