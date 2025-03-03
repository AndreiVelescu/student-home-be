import { ArgsType, Field, ObjectType } from "type-graphql";


@ObjectType()
export class SignUpOutput {
    @Field(()=> String)
    accessToken:string;
    @Field(()=> String)
    refreshToken: string;

}



@ArgsType()
export class SignUpInput {
    @Field(()=> String)
    email: string
    @Field(()=> String)
    password: string;
    @Field(() => String)
    lastName: string;
    @Field(() => String)
    firstName: string;
}



@ObjectType()
export class SignInOutput {
    @Field(()=> String)
    accessToken:string;
    @Field(()=> String)
    refreshToken: string;
}

@ArgsType()
export class SignInInput{
    @Field(() => String)
    email: string
    @Field(() => String)
    password: string
}

@ArgsType()
export class RefreshTokenInput{
    @Field(() => String)
    refreshToken: string;
}







