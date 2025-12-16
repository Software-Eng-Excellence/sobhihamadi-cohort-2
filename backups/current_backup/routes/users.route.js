"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const UserService_1 = require("../services/UserService");
const AsyncHandler_1 = require("../middleware/AsyncHandler");
const UserRepository_1 = require("../repository/usersrepository/UserRepository");
const auth_1 = require("../middleware/auth");
const userRepository = new UserRepository_1.UserSqliteRepository();
// fire-and-forget init; ConnectionManager + sqlite handle async
userRepository.init(); // IMPORTANT: no await here (same pattern as orders)
const userService = new UserService_1.UserService(userRepository);
const userController = new UserController_1.UserController(userService);
const route = (0, express_1.Router)();
exports.default = route;
route
    .route("/")
    .get(auth_1.Authentication, (0, AsyncHandler_1.asynchandler)(userController.getAllUsers.bind(userController)))
    .post((0, AsyncHandler_1.asynchandler)(userController.createUser.bind(userController)));
route
    .route("/:id")
    .get(auth_1.Authentication, (0, AsyncHandler_1.asynchandler)(userController.getUserById.bind(userController)))
    .put(auth_1.Authentication, (0, AsyncHandler_1.asynchandler)(userController.updateUser.bind(userController)))
    .delete(auth_1.Authentication, (0, AsyncHandler_1.asynchandler)(userController.deleteUser.bind(userController)));
//# sourceMappingURL=users.route.js.map