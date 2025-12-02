import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { UserService } from "../services/UserService";
import { asynchandler } from "../middleware/AsyncHandler";
import { UserSqliteRepository } from "../repository/usersrepository/UserRepository";
import { Authentication } from "../middleware/auth";
const userRepository = new UserSqliteRepository();
// fire-and-forget init; ConnectionManager + sqlite handle async
userRepository.init();  // IMPORTANT: no await here (same pattern as orders)
const userService = new UserService(userRepository);
const userController = new UserController(userService);
const route = Router();

export default route;

route
  .route("/")
  .get(Authentication,asynchandler(userController.getAllUsers.bind(userController)))
  .post(asynchandler(userController.createUser.bind(userController)));

route
  .route("/:id")
  .get(Authentication,asynchandler(userController.getUserById.bind(userController)))
  .put(Authentication,asynchandler(userController.updateUser.bind(userController)))
  .delete(Authentication,asynchandler(userController.deleteUser.bind(userController)));
