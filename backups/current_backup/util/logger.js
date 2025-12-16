"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const winston_1 = __importDefault(require("winston"));
const { logDir, isDev } = config_1.default;
const logfileformat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'HH:mm:ss' }), winston_1.default.format.splat(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json());
const consoleformat = winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp(), winston_1.default.format.splat(), winston_1.default.format.simple(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.printf(({ level, message, stack }) => {
    return `[s] [${level}]: ${message} ${stack || ""}`;
}));
const logger = winston_1.default.createLogger({
    level: 'info',
    transports: [
        new winston_1.default.transports.File({ filename: 'error.log', dirname: logDir, level: 'error', format: logfileformat }),
        new winston_1.default.transports.File({ filename: 'all.log', dirname: logDir, format: logfileformat })
    ],
    exceptionHandlers: [
        new winston_1.default.transports.File({ filename: 'exceptions.log', dirname: logDir })
    ],
});
if (isDev) {
    logger.add(new winston_1.default.transports.Console({
        format: consoleformat,
        level: 'debug',
    }));
}
if (config_1.default.isProduction) {
    logger.add(new winston_1.default.transports.Console({
        format: consoleformat,
        level: 'info',
    }));
}
logger.info("Logger initialized");
exports.default = logger;
//# sourceMappingURL=logger.js.map