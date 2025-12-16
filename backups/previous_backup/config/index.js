"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const db_mode_1 = require("../config/db_mode");
dotenv_1.default.config({ path: path_1.default.join(__dirname, `../../.env.${process.env.NODE_ENV}`) }); // Load environment variables from .env file
exports.default = {
    logDir: process.env.LOG_DIR || './logs', // Directory for log files
    isDev: process.env.NODE_ENV === "development", // Check if the environment is development
    isProduction: process.env.NODE_ENV === "production",
    storagePath: {
        csv: {
            cake: 'src/data/data/cake orders.csv',
        },
        sqlite: {
            orders: process.env.SQL_DATABASE_URL || 'src/data/data/orders.db'
        },
        postgres: {
            url: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_sAkJNoWI37Tv@ep-silent-violet-ag127b62-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
        }
    },
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000, // Server port
    host: process.env.HOST || 'localhost', // Server host
    DBMode: db_mode_1.DBMode.SQLITE || db_mode_1.DBMode.POSTGRES, // Database mode
    auth: {
        tokenExpiry: (process.env.TOKEN_EXPIRY || '15m'), // Token expiry duration
        secretkey: process.env.JWT_SECRET_KEY || 'secret-111222242421', // Secret key for authentication
        tokenrefrechExpiry: (process.env.TOKEN_REFRECH_EXPIRY || '7d')
    }
};
//# sourceMappingURL=index.js.map