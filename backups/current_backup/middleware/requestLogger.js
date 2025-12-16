"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../util/logger"));
const requestLogger = (req, res, next) => {
    const starttime = Date.now();
    res.on('finish', () => {
        const ResponseTime = Date.now() - starttime;
        const satus = res.statusCode;
        const { method, originalUrl } = req;
        const level = satus >= 500 ? 'error' : satus >= 400 ? 'warn' : 'info';
        logger_1.default.log({ level, message: `${method} ${satus} ${originalUrl} ${ResponseTime}ms` });
    });
    next();
};
exports.default = requestLogger;
//# sourceMappingURL=requestLogger.js.map