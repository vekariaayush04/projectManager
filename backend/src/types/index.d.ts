import { Request } from "express";
import { User as UserData } from "../generated/prisma";

declare global {
    namespace Express {
        interface User extends UserData {}
    }
}