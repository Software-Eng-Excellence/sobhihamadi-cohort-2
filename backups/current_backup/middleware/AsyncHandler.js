"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asynchandler = void 0;
const asynchandler = (fn) => {
    return (req, res, next) => fn(req, res).catch(next);
};
exports.asynchandler = asynchandler;
//# sourceMappingURL=AsyncHandler.js.map