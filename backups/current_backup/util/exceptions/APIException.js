"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIException = void 0;
class APIException extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'APIException';
        this.message = message;
        this.statusCode = statusCode;
    }
}
exports.APIException = APIException;
//# sourceMappingURL=APIException.js.map