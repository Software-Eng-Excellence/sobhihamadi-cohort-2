"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationController = void 0;
const BadRequestException_1 = require("../util/exceptions/http/BadRequestException");
const roles_1 = require("../config/roles");
class AuthenticationController {
    constructor(authService, userService) {
        this.authService = authService;
        this.userService = userService;
    }
    async login(req, res) {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new BadRequestException_1.BadRequestException("Email and password are required", {
                emailMissing: !email,
                passwordMissing: !password
            });
        }
        const user = await this.userService.validateUserCredentials(email, password);
        const userpayload = { userId: user.id, role: (0, roles_1.toRoles)(user.role) };
        this.authService.PersistAuthentication(res, userpayload);
        res.status(200).json({
            message: "Login successful",
        });
    }
    async logout(req, res) {
        this.authService.clearToken(res);
        res.status(200).json({
            message: "logout succesful"
        });
    }
}
exports.AuthenticationController = AuthenticationController;
//# sourceMappingURL=auth.controller.js.map