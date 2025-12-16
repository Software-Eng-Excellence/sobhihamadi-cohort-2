"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionManager = void 0;
const config_1 = __importDefault(require("../../config"));
const sqlite_1 = require("sqlite");
const sqlite3_1 = require("sqlite3");
const DatabaseConnectionException_1 = require("../../util/exceptions/DatabaseConnectionException");
class ConnectionManager {
    //get instance of database connection
    //return a db connection instance"the same instance every time it is called"
    constructor() { }
    static async getConnection() {
        if (this.db == null) {
            try {
                this.db = await (0, sqlite_1.open)({
                    filename: config_1.default.storagePath.sqlite.orders,
                    driver: sqlite3_1.Database
                });
            }
            catch {
                throw new DatabaseConnectionException_1.DatabaseConnectionException("Failed to connect to the database.");
            }
        }
        return this.db;
    }
}
exports.ConnectionManager = ConnectionManager;
ConnectionManager.db = null;
//# sourceMappingURL=ConnectionManager.js.map