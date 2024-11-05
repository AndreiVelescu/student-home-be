import {
  Args,
  Ctx,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { getPrismaFromContext } from "../../prisma/generated/helpers";
import { PrismaClient, UserRole } from "@prisma/client";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { SignInInput, SignInOutput, SignUpOutput, SingUpInput , RefreshTokenInput} from "./types";


@Resolver()
class AuthResolver {
  @Mutation(() => SignUpOutput)
  async signUp(@Ctx() ctx, @Args() data: SingUpInput): Promise<SignUpOutput> {
    const prisma = getPrismaFromContext(ctx) as PrismaClient;
    const hashPassword = await hash(data.password, 10);

    await prisma.user.create({
      data: {
        email: data.email,
        password: hashPassword,
        FirstName: data.firstName,
        lastName: data.lastName,
        role: UserRole.STUDENT,
      },
    });
    
    return {
        accessToken: this.generateAccessToken(data.email),
        refreshToken: this.generateRefreshToken(data.email),
    };
}

@Mutation(() => SignInOutput)
async refreshTokens(@Ctx() ctx,@Args() data: RefreshTokenInput): Promise<SignInOutput> {
    const secret = process.env.JWT_REFRESH_TOKEN;
    if(!secret){
        throw new Error("Not valid refresh token")
    }

    const res = JSON.parse(jwt.verify(data.refreshToken, process.env.JWT_REFRESH_TOKEN!) as string);
    const prisma = getPrismaFromContext(ctx) as PrismaClient;
    const  user = await prisma.user.findUniqueOrThrow({
        where: {email: res.email}
    })

    if(!user){
        throw new Error("User dont exists");
    }

    return {
        accessToken: this.generateAccessToken(user.email),
        refreshToken: this.generateRefreshToken(user.email)
    }

}

  @Query(() => SignInOutput)
  async SignIn(@Ctx() ctx, @Args() data: SignInInput): Promise<SignInOutput> {
    const prisma = getPrismaFromContext(ctx) as PrismaClient;
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: data.email },
    });
    const isRightPass = await compare(data.password, user.password);

    if(!isRightPass){
        throw new Error("Credentials are invalid");
    }
    
    return {
      accessToken: this.generateAccessToken(data.email),
      refreshToken: this.generateRefreshToken(data.email),
    };
  }

  

  private generateAccessToken(userEmail: string) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT secret not found");
    }
    const token = jwt.sign(
      {
        email: userEmail,
      },
      secret,
      {
        expiresIn: "1h",
      }
    );

    return token;
    
  };
 
  private generateRefreshToken(userEmail: string){
    const secret = process.env.JWT_REFRESH_SECRET;
    if(!secret){
        throw new Error("JWT refresh secret not found");

    }
    const token = jwt.sign({
        email: userEmail,
    },
    secret,
    {
        expiresIn: "7d",
    }
);
    return token;
  }

}





export default AuthResolver;
