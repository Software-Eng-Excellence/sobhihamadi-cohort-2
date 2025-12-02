import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { roles } from "./roles";


export enum DBMode{
    CSV,
    SQLITE,
    POSTGRES
}

export interface userPayload{
    userId:string;
    role:roles;
}

export interface TokenPayload extends JwtPayload{
    user:userPayload
}
export interface authRequest extends Request{
    user:userPayload
}