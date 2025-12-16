"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AsyncHandler_1 = require("../middleware/AsyncHandler");
const Authentication_service_1 = require("../services/Authentication.service");
const auth_controller_1 = require("../controllers/auth.controller");
const UserService_1 = require("../services/UserService");
const UserRepository_1 = require("../repository/usersrepository/UserRepository");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
exports.default = router;
const authService = new Authentication_service_1.AuthenticationService();
const userRepository = new UserRepository_1.UserSqliteRepository();
userRepository.init();
const userService = new UserService_1.UserService(userRepository);
const authcontroller = new auth_controller_1.AuthenticationController(authService, userService);
router.route("/login")
    .post((0, AsyncHandler_1.asynchandler)(authcontroller.login.bind(authcontroller)));
router.route('/logout')
    .get(auth_1.Authentication, (authcontroller.logout.bind(authcontroller)));
//# sourceMappingURL=auth.route.js.map