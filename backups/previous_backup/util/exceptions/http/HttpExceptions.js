"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPException = void 0;
class HTTPException extends Error {
    constructor(status, message, details) {
        super(message);
        this.status = status;
        this.message = message;
        this.details = details;
        this.name = 'HTTP Exception';
    }
}
exports.HTTPException = HTTPException;
//# sourceMappingURL=HttpExceptions.js.map