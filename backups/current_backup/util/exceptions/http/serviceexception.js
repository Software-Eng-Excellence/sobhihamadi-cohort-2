"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceexception = void 0;
const HttpExceptions_1 = require("./HttpExceptions");
class serviceexception extends HttpExceptions_1.HTTPException {
    constructor(message) {
        super(500, message);
        this.name = "serviceexception";
    }
}
exports.serviceexception = serviceexception;
//# sourceMappingURL=serviceexception.js.map