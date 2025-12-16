"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
process.on('uncaughtException', err => {
    console.error('Uncaught Exception', err);
});
process.on('unhandledRejection', err => {
    console.error('Unhandled Rejection', err);
});
const config_1 = __importDefault(require("./config"));
const express_1 = __importDefault(require("express"));
const logger_1 = __importDefault(require("./util/logger"));
const helmet_1 = __importDefault(require("helmet"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const requestLogger_1 = __importDefault(require("./middleware/requestLogger"));
const routes_1 = __importDefault(require("./routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const HttpExceptions_1 = require("./util/exceptions/http/HttpExceptions");
const app = (0, express_1.default)();
//config helmet
app.use((0, helmet_1.default)());
//config body parser
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
//config cors
app.use((0, cors_1.default)());
//config middleware
app.use(requestLogger_1.default);
//cookie parser
app.use((0, cookie_parser_1.default)());
//config routes
app.use('/', routes_1.default);
//config 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});
app.use('/', routes_1.default);
app.use((err, req, res) => {
    if (err instanceof HttpExceptions_1.HTTPException) {
        const HttpExceptions = err;
        logger_1.default.error("%s %d %s %o", HttpExceptions.name, HttpExceptions.status, HttpExceptions.message, HttpExceptions.details);
        res.status(HttpExceptions.status).json({
            message: HttpExceptions.message,
            details: HttpExceptions.details || undefined
        });
    }
    else {
        logger_1.default.error(`Unhandled Exception: %s`, err.message);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});
app.listen(config_1.default.port, config_1.default.host, () => {
    console.log('Server is running on http:// %s:%d', config_1.default.host, config_1.default.port);
    logger_1.default.info('Server is running on http:// %s:%d', config_1.default.host, config_1.default.port);
});
//# sourceMappingURL=index.js.map