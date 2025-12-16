"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orders_route_1 = __importDefault(require("./orders.route"));
const analytics_route_1 = __importDefault(require("./analytics.route"));
const users_route_1 = __importDefault(require("./users.route"));
const auth_route_1 = __importDefault(require("./auth.route"));
const auth_1 = require("../middleware/auth");
const logger_1 = __importDefault(require("../util/logger"));
const PostgreConnection_1 = require("../repository/PostgreSQL/PostgreConnection");
const ConnectionManager_1 = require("../repository/sqlite/ConnectionManager");
const routes = (0, express_1.Router)();
routes.use('/orders', auth_1.Authentication, orders_route_1.default);
routes.use('/analytics', auth_1.Authentication, analytics_route_1.default);
routes.use("/users", users_route_1.default);
routes.use('/auth', auth_route_1.default);
logger_1.default.info('routes loaded,/orders, /analytics, /users, /auth');
routes.get('/health/status', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Application is healthy' });
});
routes.get('/health/db', async (req, res) => {
    try {
        const dbconnection = await CheckDatabaseConnection();
        if (dbconnection) {
            res.status(200).json({ status: 'Database connection is healthy' });
        }
        else {
            res.status(500).json({ status: 'Database connection is not healthy' });
        }
        // Add your database connection check here
        // Example: await db.query('SELECT 1');
    }
    catch (error) {
        logger_1.default.error('Database connection failed', error);
        res.status(500).json({ status: 'Database connection failed' });
    }
});
async function CheckDatabaseConnection() {
    const sqlUp = ConnectionManager_1.ConnectionManager.getConnection().then(() => true).catch(() => false);
    const pgUp = PostgreConnection_1.ConnectionManager.getPostgreConnection().then(() => true).catch(() => false);
    return Promise.any([sqlUp, pgUp]);
}
logger_1.default.info('routes loaded,/health/status, /health/db');
exports.default = routes;
//# sourceMappingURL=index.js.map