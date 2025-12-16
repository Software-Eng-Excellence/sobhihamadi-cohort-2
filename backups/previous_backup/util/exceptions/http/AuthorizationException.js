"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insufficientPermissionException = exports.invalidRoleException = exports.AuthorizationException = void 0;
const HttpExceptions_1 = require("./HttpExceptions");
class AuthorizationException extends HttpExceptions_1.HTTPException {
    constructor(message) {
        super(403, message);
        this.name = "AuthenticationException";
    }
}
exports.AuthorizationException = AuthorizationException;
class invalidRoleException extends AuthorizationException {
    constructor(role) {
        super("invalid role" + role);
        this.name = "AuthenticationException";
    }
}
exports.invalidRoleException = invalidRoleException;
class insufficientPermissionException extends AuthorizationException {
    constructor() {
        super("invalid role");
        this.name = "AuthenticationException";
    }
}
exports.insufficientPermissionException = insufficientPermissionException;
//# sourceMappingURL=AuthorizationException.js.map