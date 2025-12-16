"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerException = void 0;
class ServerException extends Error {
    constructor(message) {
        super(message);
        this.name = 'ServerException';
    }
}
exports.ServerException = ServerException;
//# sourceMappingURL=serverexception.js.map