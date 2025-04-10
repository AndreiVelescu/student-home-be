import { GraphQLUpload } from "graphql-upload-ts/dist/GraphQLUpload";
import {
  Args,
  ArgsType,
  Ctx,
  Field,
  InputType,
  Mutation,
  Resolver,
} from "type-graphql";

import { Context } from "@apollo/client";
import { getPrismaFromContext } from "../../prisma/generated/helpers";
import { PrismaClient } from "@prisma/client";
import { uploadFile, uploadFiles } from "../utils/uploadHelper";
import { FileUpload, Upload } from "graphql-upload-ts";
import { CaminRequestArgs } from "./types";

@Resolver()
class CaminRequestResolver {
  @Mutation(() => Boolean)
  async createRequest(
    @Ctx() ctx: Context,
    @Args()
    { request, files }: CaminRequestArgs
  ): Promise<Boolean> {
    const prisma: PrismaClient = getPrismaFromContext(ctx);
    const curentUser = ctx["requestor"];

    if (!curentUser) {
      throw new Error("User unauthenticated");
    }

    if (
      !files ||
      !files.fileBuletinBack ||
      !files.fileBuletinFront ||
      !files.fileStudyConfirmation
    ) {
      throw new Error("All files are required");
    }

    // Așteaptă fișierele
    const fileBuletinBack = await files.fileBuletinBack;
    const fileBuletinFront = await files.fileBuletinFront;
    const fileStudyConfirmation = await files.fileStudyConfirmation;

    console.log(fileBuletinBack);
    console.log(fileBuletinFront);
    console.log(fileStudyConfirmation);

    const [fileBuletinBackUlr, fileBuletinFrontUrl, fileStudyConfirmationUrl] =
      await uploadFiles([
        fileBuletinBack,
        fileBuletinFront,
        fileStudyConfirmation,
      ]);

    await prisma.caminRequest.create({
      data: {
        ...request,
        buletinBackUrl: fileBuletinBackUlr,
        buletinFrontUrl: fileBuletinFrontUrl,
        confirmareStudiiUrl: fileStudyConfirmationUrl,
        user: { connect: curentUser.id },
      },
    });

    return Promise.resolve(true);
  }
}

export default CaminRequestResolver;
