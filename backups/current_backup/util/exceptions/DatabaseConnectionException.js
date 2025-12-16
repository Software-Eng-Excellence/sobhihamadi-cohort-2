"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnectionException = void 0;
class DatabaseConnectionException extends Error {
    constructor(message) {
        super(message);
        this.name = "DatabaseConnectionException";
    }
}
exports.DatabaseConnectionException = DatabaseConnectionException;
//# sourceMappingURL=DatabaseConnectionException.js.map