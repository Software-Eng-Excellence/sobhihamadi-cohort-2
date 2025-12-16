"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestException = void 0;
const HttpExceptions_1 = require("./HttpExceptions");
class BadRequestException extends HttpExceptions_1.HTTPException {
    constructor(message = 'Bad Request', details) {
        super(400, message, details);
        this.name = 'Bad Request Exception';
    }
}
exports.BadRequestException = BadRequestException;
//# sourceMappingURL=BadRequestException.js.map