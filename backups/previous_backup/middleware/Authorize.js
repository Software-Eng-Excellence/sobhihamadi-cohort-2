"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasPermission = hasPermission;
exports.hasRole = hasRole;
const roles_1 = require("../config/roles");
const Authenticationexceptions_1 = require("../util/exceptions/http/Authenticationexceptions");
const AuthorizationException_1 = require("../util/exceptions/http/AuthorizationException");
const logger_1 = __importDefault(require("../util/logger"));
function hasPermission(permission) {
    return (req, res, next) => {
        const authreq = req;
        if (!authreq.user) {
            throw new Authenticationexceptions_1.AuthenticationFailedException();
        }
        const role = authreq.user.role;
        if (!roles_1.rolePermission[role]) {
            logger_1.default.error("invalid role " + role);
            throw new AuthorizationException_1.invalidRoleException(role);
        }
        if (!roles_1.rolePermission[role].includes(permission)) {
            logger_1.default.error("use with role " + role + " does not have permission " + permission);
            throw new AuthorizationException_1.insufficientPermissionException();
        }
        next();
    };
}
function hasRole(allowedrole) {
    return (req, res, next) => {
        const authreq = req;
        if (!authreq.user) {
            throw new Authenticationexceptions_1.AuthenticationFailedException();
        }
        const role = authreq.user.role;
        if (!allowedrole.includes(role)) {
            logger_1.default.error("use with role " + role + " does not have permission ");
            throw new AuthorizationException_1.insufficientPermissionException();
        }
        next();
    };
}
//# sourceMappingURL=Authorize.js.map