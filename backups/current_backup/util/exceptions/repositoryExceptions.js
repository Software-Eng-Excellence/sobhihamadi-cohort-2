"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbException = exports.InitializationException = exports.InvalidItemException = exports.ItemNotFoundException = void 0;
class ItemNotFoundException extends Error {
    constructor(message) {
        super(message);
        this.name = "ItemNotFoundException";
    }
}
exports.ItemNotFoundException = ItemNotFoundException;
class InvalidItemException extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidItemException";
    }
}
exports.InvalidItemException = InvalidItemException;
class InitializationException extends Error {
    constructor(message) {
        super(message);
        this.name = "InitializationException";
    }
}
exports.InitializationException = InitializationException;
class DbException extends Error {
    constructor(message) {
        super(message);
        this.name = "DbException";
    }
}
exports.DbException = DbException;
//# sourceMappingURL=repositoryExceptions.js.map