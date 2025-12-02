import  { Router } from "express";
import { asynchandler } from "../middleware/AsyncHandler";
import { AuthenticationService } from "../services/Authentication.service";
import { AuthenticationController } from "../controllers/auth.controller";
import { UserService } from "../services/UserService";

import { UserSqliteRepository } from "../repository/usersrepository/UserRepository";
import { Authentication } from "../middleware/auth";



const router= Router();

export default router;

const authService=new AuthenticationService();
const userRepository = new UserSqliteRepository();
userRepository.init();
const userService=new UserService(userRepository);


const authcontroller=new AuthenticationController(authService, userService);



router.route("/login")
  .post(asynchandler(authcontroller.login.bind(authcontroller)));


router.route('/logout')
.get(Authentication,(authcontroller.logout.bind(authcontroller)));

