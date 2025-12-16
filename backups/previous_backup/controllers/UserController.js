"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const BadRequestException_1 = require("../util/exceptions/http/BadRequestException");
const roles_1 = require("../config/roles");
class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async createUser(req, res) {
        this.validateCreateBody(req);
        const { name, email, password } = req.body;
        const user = await this.userService.create({ name, email, password, role: (0, roles_1.toRoles)('user') });
        const createuser = await this.userService.get(user.id);
        res.status(201).json({
            id: createuser.id,
            name: createuser.name,
            email: createuser.email,
            role: createuser.role
        });
    }
    async getAllUsers(_req, res) {
        const users = await this.userService.getall();
        res.status(200).json(users.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            password: u.password,
            role: u.role
        })));
    }
    async getUserById(req, res) {
        const { id } = req.params;
        if (!id) {
            throw new BadRequestException_1.BadRequestException("User id is required", {
                UserIdMissing: true,
            });
        }
        const user = await this.userService.get(id);
        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    }
    async updateUser(req, res) {
        const { id } = req.params;
        if (!id) {
            throw new BadRequestException_1.BadRequestException("User id is required", {
                UserIdMissing: true,
            });
        }
        this.validateUpdateBody(req.body);
        const updated = await this.userService.update(id, req.body);
        res.status(200).json({
            id: updated.id,
            name: updated.name,
            email: updated.email,
            role: updated.role
        });
    }
    async deleteUser(req, res) {
        const { id } = req.params;
        if (!id) {
            throw new BadRequestException_1.BadRequestException("User id is required", {
                UserIdMissing: true,
            });
        }
        await this.userService.delete(id);
        res.status(204).send();
    }
    validateEmail(email) {
        if (email === undefined || email === null || typeof email !== "string") {
            throw new BadRequestException_1.BadRequestException("Email is required and must be a string", {
                EmailMissing: email === undefined || email === null,
                EmailTypeInvalid: typeof email !== "string",
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new BadRequestException_1.BadRequestException("Email is not valid", {
                InvalidEmail: true,
            });
        }
    }
    validateCreateBody(req) {
        const { name, email, password } = req.body;
        if (!name || typeof name !== "string") {
            throw new BadRequestException_1.BadRequestException("Name is required and must be a string", {
                NameMissing: !name,
                NameTypeInvalid: typeof name !== "string",
            });
        }
        this.validateEmail(email);
        if (!password || typeof password !== "string") {
            throw new BadRequestException_1.BadRequestException("Password is required and must be a string", {
                PasswordMissing: !password,
                PasswordTypeInvalid: typeof password !== "string",
            });
        }
    }
    validateUpdateBody(body) {
        if (body === null || typeof body !== "object") {
            throw new BadRequestException_1.BadRequestException("Body must be an object", {
                BodyInvalid: true,
            });
        }
        const { name, email, password, role } = body;
        if (name !== undefined) {
            if (typeof name !== "string" || name.trim().length === 0) {
                throw new BadRequestException_1.BadRequestException("Name must be a non-empty string", {
                    InvalidName: true,
                });
            }
        }
        if (email !== undefined) {
            this.validateEmail(email);
        }
        if (password !== undefined && typeof password !== "string") {
            throw new BadRequestException_1.BadRequestException("Password must be a string", {
                PasswordTypeInvalid: true,
            });
        }
        if (role !== undefined && !Object.values(roles_1.roles).includes(role)) {
            throw new BadRequestException_1.BadRequestException("Invalid role value", {
                InvalidRole: true,
            });
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map