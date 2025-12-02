import { authRequest } from "../config/db_mode";
import { permissions, rolePermission, roles } from "../config/roles";
import { NextFunction, Request, Response } from "express";
import { AuthenticationFailedException } from "../util/exceptions/http/Authenticationexceptions";
import { insufficientPermissionException, invalidRoleException } from "../util/exceptions/http/AuthorizationException";
import logger from "../util/logger";



export function hasPermission(permission:permissions){
    return (req:Request,res:Response,next:NextFunction)=>{
        const authreq=req as authRequest;
        if(!authreq.user){
            throw new AuthenticationFailedException();
        }
        const role=authreq.user.role;
        if(!rolePermission[role]){
            logger.error("invalid role "+role);
            throw new invalidRoleException(role);
        }
        if(!rolePermission[role].includes(permission)){
            logger.error("use with role "+role+" does not have permission "+permission);
            throw new insufficientPermissionException();
        }
        next();
        
        
    }
    
}
export function hasRole(allowedrole:roles[]){
    return (req:Request,res:Response,next:NextFunction)=>{
        const authreq=req as authRequest;
        if(!authreq.user){
            throw new AuthenticationFailedException();
        }
        const role=authreq.user.role;
        if(!allowedrole.includes(role)){
            logger.error("use with role "+role+" does not have permission ");
            throw new insufficientPermissionException();
        }
      
        next();
    }
}