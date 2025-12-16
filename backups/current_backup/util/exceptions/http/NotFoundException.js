"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundException = void 0;
const HttpExceptions_1 = require("./HttpExceptions");
class NotFoundException extends HttpExceptions_1.HTTPException {
    constructor(message = 'Resource Not Found', details) {
        super(404, message, details);
        this.name = 'Not Found Exception';
    }
}
exports.NotFoundException = NotFoundException;
//# sourceMappingURL=NotFoundException.js.map