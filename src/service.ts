import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

export const verifyAccessToken = async (req:any, prisma:PrismaClient) => {
    const authToken:string = req.headers.authorization;
    const secret = process.env.JWT_SECRET;
    if(!authToken){
        throw new Error("Token not found");
    }
    if(!secret){
        throw new Error("Secret not found");
    }
    const res = jwt.verify(authToken.split("Bearer ")[1],secret);

    const user =  await prisma.user.findFirstOrThrow({where:{
        email: res["email"]
    }})

    return user;
} 