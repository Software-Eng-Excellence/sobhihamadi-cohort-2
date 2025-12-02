import {Response, Request, NextFunction } from "express";





export const asynchandler= (fn: {(req:Request,res:Response):Promise<void>})=> {
    return (req:Request,res:Response,next:NextFunction)=> fn(req,res).catch(next);
};
