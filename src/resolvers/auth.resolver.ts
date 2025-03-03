import { Args, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { getPrismaFromContext } from "../../prisma/generated/helpers";
import { PrismaClient, UserRole } from "@prisma/client";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import {
  SignInInput,
  SignInOutput,
  SignUpOutput,
  SignUpInput,
  RefreshTokenInput,
} from "./types";
import { User } from "../../prisma/generated";
import { Context } from "@apollo/client";
@Resolver()
class AuthResolver {
  @Mutation(() => SignUpOutput)
  async signUp(
    @Ctx() ctx: Context,
    @Args() data: SignUpInput
  ): Promise<SignUpOutput> {
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

  @Query(() => User)
  async getCurrentUser(@Ctx() { requestor }: Context): Promise<User | null> {
    if (!requestor) {
      throw new Error("User not authenticated");
    }
    return requestor;
  }

  @Mutation(() => SignInOutput)
  async refreshTokens(
    @Ctx() ctx: Context,
    @Args() data: RefreshTokenInput
  ): Promise<SignInOutput> {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) throw new Error("Refresh token secret missing");

    try {
      const decodedToken = jwt.verify(
        data.refreshToken,
        secret
      ) as jwt.JwtPayload;
      const email = decodedToken.email;
      if (!email) throw new Error("Email not found in token");

      const prisma = getPrismaFromContext(ctx) as PrismaClient;
      const user = await prisma.user.findUniqueOrThrow({ where: { email } });

      return {
        accessToken: this.generateAccessToken(email),
        refreshToken: this.generateRefreshToken(email),
      };
    } catch (error) {
      throw new Error("Invalid or expired refresh token");
    }
  }

  @Query(() => SignInOutput)
  async SignIn(
    @Ctx() ctx: Context,
    @Args() data: SignInInput
  ): Promise<SignInOutput> {
    const prisma = getPrismaFromContext(ctx) as PrismaClient;
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: data.email },
    });
    const isRightPass = await compare(data.password, user.password);

    if (!isRightPass) {
      throw new Error("Invalid credentials");
    }

    return {
      accessToken: this.generateAccessToken(data.email),
      refreshToken: this.generateRefreshToken(data.email),
    };
  }

  private generateAccessToken(userEmail: string) {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT secret not found");

    return jwt.sign({ email: userEmail }, secret, {
      expiresIn: "1h",
      issuer: "eCamin",
      audience: "eCamin-user",
    });
  }

  private generateRefreshToken(userEmail: string) {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) throw new Error("JWT refresh secret not found");

    return jwt.sign({ email: userEmail }, secret, {
      expiresIn: "7d",
      issuer: "eCamin",
      audience: "eCamin-users",
    });
  }
}

export default AuthResolver;
