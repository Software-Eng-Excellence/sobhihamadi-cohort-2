"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_model_1 = require("../model/user.model");
const NotFoundException_1 = require("../util/exceptions/http/NotFoundException");
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async create(data) {
        const id = `user-${Date.now()}`;
        const user = new user_model_1.User({ id, ...data });
        await this.userRepository.create(user);
        return user;
    }
    async getall() {
        return this.userRepository.getall();
    }
    async get(id) {
        return this.userRepository.get(id);
    }
    async update(id, data) {
        const existing = await this.userRepository.get(id);
        if (data.name !== undefined)
            existing.name = data.name;
        if (data.email !== undefined)
            existing.email = data.email;
        if (data.password !== undefined)
            existing.password = data.password;
        if (data.role !== undefined)
            existing.role = data.role;
        await this.userRepository.update(existing);
        return existing;
    }
    async delete(id) {
        await this.userRepository.get(id);
        await this.userRepository.delete(id);
    }
    async validateUserCredentials(email, password) {
        const user = await this.userRepository.getbyemail(email);
        if (!user) {
            throw new NotFoundException_1.NotFoundException("Invalid user credentials,user not found");
        }
        if (user.password !== password) {
            throw new NotFoundException_1.NotFoundException("Invalid user credentials");
        }
        return user;
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map