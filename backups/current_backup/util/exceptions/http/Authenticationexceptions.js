"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationFailedException = exports.ExpiredTokenException = exports.InvalidTokenException = exports.AuthenticationException = void 0;
const HttpExceptions_1 = require("./HttpExceptions");
class AuthenticationException extends HttpExceptions_1.HTTPException {
    constructor(message) {
        super(401, message);
        this.name = "AuthenticationException";
    }
}
exports.AuthenticationException = AuthenticationException;
class InvalidTokenException extends AuthenticationException {
    constructor() {
        super("The provided token is invalid.");
        this.name = "InvalidTokenException";
    }
}
exports.InvalidTokenException = InvalidTokenException;
class ExpiredTokenException extends AuthenticationException {
    constructor() {
        super("The provided token has expired.");
        this.name = "ExpiredTokenException";
    }
}
exports.ExpiredTokenException = ExpiredTokenException;
class AuthenticationFailedException extends AuthenticationException {
    constructor() {
        super("Authentication Failed.");
        this.name = "AuthenticationFailedExpcetion";
    }
}
exports.AuthenticationFailedException = AuthenticationFailedException;
//# sourceMappingURL=Authenticationexceptions.js.map