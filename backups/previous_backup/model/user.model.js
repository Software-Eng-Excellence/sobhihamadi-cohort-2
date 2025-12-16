"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const roles_1 = require("../config/roles");
class User {
    constructor(data, role = roles_1.roles.user) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.role = role;
    }
    // this is required by interface `id`
    getid() {
        return this.id;
    }
}
exports.User = User;
//# sourceMappingURL=user.model.js.map