import { Request, Response } from "express";
import { AuthenticationService } from "../services/Authentication.service";
import { BadRequestException } from "../util/exceptions/http/BadRequestException";
import { UserService } from "../services/UserService";
import {  userPayload } from "../config/db_mode";
import { toRoles } from "../config/roles";


export class AuthenticationController {
    constructor(
        private authService: AuthenticationService,
        private userService:UserService
    ) {}

 async login(req:Request,res:Response){
    const {email, password}=req.body;
    if(!email || !password){
        throw new BadRequestException("Email and password are required",{
            emailMissing:!email,
            passwordMissing:!password
        });
    
    }
   
         const user=await this.userService.validateUserCredentials(email,password);
  
    
   const userpayload: userPayload={userId:user.id,role:toRoles(user.role)};
    this.authService.PersistAuthentication(res,userpayload);
    res.status(200).json({
      message: "Login successful",
    });
    }

    async logout(req:Request,res:Response){
        this.authService.clearToken(res)
        res.status(200).json({
            message:"logout succesful"
        })
    }
 }