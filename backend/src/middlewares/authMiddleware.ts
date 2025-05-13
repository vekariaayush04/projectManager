import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken"
import { db } from "../db/db";

export const authMiddleware = async  (req : Request , res : Response , next : NextFunction) : Promise<any> => {
    try {
        const token = req.cookies.jwt;
        console.log(token);
        
        if (!token) {
            return res.status(401).json({
                message: "Unauthorised",
            });
        }

        let decoded = jwt.verify(token, process.env.SECRET!) as JwtPayload;

        const user = await db.user.findUnique({
            where: {
                id: decoded.id,
            }
        });
        console.log(user);
        
        if (!user) {
            return res.status(401).json({
                message: "Unauthorised",
            });
        }

        req.user = user;
        next()
    } catch (error) {
        console.error("Unauthorised", error);
        return res.status(500).json({
            message: "Unauthorised",
            error,
        });
    }
}