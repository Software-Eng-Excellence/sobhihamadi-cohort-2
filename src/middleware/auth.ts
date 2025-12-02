import { authRequest } from "../config/db_mode";
import { NextFunction, Request, Response } from "express";
import { AuthenticationService } from "../services/Authentication.service";
import { AuthenticationFailedException } from "../util/exceptions/http/Authenticationexceptions";

const authService = new AuthenticationService();

export function Authentication(req: Request, res: Response, next: NextFunction) {
  let token=req.cookies.token;
  const refreshToken=req.cookies.refreshToken;

 
  if(!token){
    //if refresh token is present
    //if yes, generate new token and set it into cookie
    if(!refreshToken){
      throw new AuthenticationFailedException();
    }

      const newToken=authService.refreshToken(refreshToken);
      authService.SetTokenIntoCookie(res,refreshToken);
      token=newToken;
    }
  
  
      const TokenPayload=authService.verifyToken(token);

      (req as authRequest).user=TokenPayload;



      next();
}
