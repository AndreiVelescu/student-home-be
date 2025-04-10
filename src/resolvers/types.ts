import { FileUpload, GraphQLUpload } from "graphql-upload-ts";
import { ArgsType, Field, InputType, ObjectType } from "type-graphql";

@ObjectType()
export class UploadedFile {
  @Field()
  url: string;

  @Field()
  fileType: string;
}
@ArgsType()
export class UploadDocumentsInput {
  @Field(() => String)
  type_doc: string;
  @Field(() => String)
  url: string;
  @Field(() => Number)
  caminRequestId: number;
}

@ArgsType()
export class UploadInput {
  @Field(() => File)
  file: File;
}

@ObjectType()
export class UploadOutput {
  @Field(() => String)
  filename: string;
  @Field(() => String)
  url: string;
  @Field(() => String)
  outPath: string;
}

@ObjectType()
export class SignUpOutput {
  @Field(() => String)
  accessToken: string;
  @Field(() => String)
  refreshToken: string;
}

@ArgsType()
export class SignUpInput {
  @Field(() => String)
  email: string;
  @Field(() => String)
  password: string;
  @Field(() => String)
  lastName: string;
  @Field(() => String)
  firstName: string;
}

@ObjectType()
export class SignInOutput {
  @Field(() => String)
  accessToken: string;
  @Field(() => String)
  refreshToken: string;
}

@ArgsType()
export class SignInInput {
  @Field(() => String)
  email: string;
  @Field(() => String)
  password: string;
}

@ArgsType()
export class RefreshTokenInput {
  @Field(() => String)
  refreshToken: string;
}

@InputType()
export class CreateRequestInput {
  @Field(() => String)
  aplicantName: string;
  @Field(() => String)
  applicantAddress: string;
  @Field(() => String)
  applicantCity: string;
  @Field(() => String)
  applicantDormitoryPreference: string;
  @Field(() => String)
  applicantEmail: string;
  @Field(() => String)
  applicantFirstName: string;
  @Field(() => String)
  applicantPhone: string;
  @Field(() => String)
  applicantState: string;
  @Field(() => String)
  applicantUniversity: string;
}

@InputType()
class RequestFilesInput {
  @Field(() => GraphQLUpload)
  fileBuletinBack: FileUpload;

  @Field(() => GraphQLUpload)
  fileBuletinFront: FileUpload;

  @Field(() => GraphQLUpload)
  fileStudyConfirmation: FileUpload;
}

@ArgsType()
export class CaminRequestArgs {
  @Field(() => RequestFilesInput)
  files: RequestFilesInput;

  @Field(() => CreateRequestInput)
  request: CreateRequestInput;
}
