"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionManager = void 0;
const config_1 = __importDefault(require("../../config"));
const pg_1 = require("pg");
const DatabaseConnectionException_1 = require("../../util/exceptions/DatabaseConnectionException");
require("dotenv/config");
class ConnectionManager {
    constructor() { }
    static async getPostgreConnection() {
        if (this.pool == null) {
            try {
                this.pool = new pg_1.Pool({
                    connectionString: config_1.default.storagePath.postgres.url,
                    ssl: { rejectUnauthorized: false },
                });
            }
            catch {
                throw new DatabaseConnectionException_1.DatabaseConnectionException("Failed to connect to PostgreSQL.");
            }
        }
        return this.pool;
    }
}
exports.ConnectionManager = ConnectionManager;
ConnectionManager.pool = null;
//# sourceMappingURL=PostgreConnection.js.map