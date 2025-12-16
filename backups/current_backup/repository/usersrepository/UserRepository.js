"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSqliteRepository = void 0;
const user_model_1 = require("../../model/user.model");
const ConnectionManager_1 = require("../sqlite/ConnectionManager");
const logger_1 = __importDefault(require("../../util/logger"));
const repositoryExceptions_1 = require("../../util/exceptions/repositoryExceptions");
const NotFoundException_1 = require("../../util/exceptions/http/NotFoundException");
const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user'
  );
`;
const INSERT_SQL = `
  INSERT INTO users (id, name, email, password,role)
  VALUES (?, ?, ?, ?,?);
`;
const SELECT_BY_ID_SQL = `
  SELECT id, name, email, password,role
  FROM users
  WHERE id = ?;
`;
const SELECT_ALL_SQL = `
  SELECT id, name, email, password,role
  FROM users;
`;
const UPDATE_SQL = `
  UPDATE users
  SET name = ?, email = ?, password = ?, role = ?
  WHERE id = ?;
`;
const DELETE_SQL = `
  DELETE FROM users
  WHERE id = ?;
`;
class UserSqliteRepository {
    constructor() {
    }
    async init() {
        try {
            this.db = await ConnectionManager_1.ConnectionManager.getConnection();
            await this.db.exec(CREATE_TABLE_SQL);
        }
        catch (error) {
            logger_1.default.error("Error initializing User repository: %o", error);
            throw new repositoryExceptions_1.InitializationException("Failed to initialize user repository");
        }
    }
    //we can add a mapper file for user
    mapRowToUser(row) {
        return new user_model_1.User({
            id: row.id,
            name: row.name,
            email: row.email,
            password: row.password,
            role: row.role
        });
    }
    async create(user) {
        try {
            this.db = await ConnectionManager_1.ConnectionManager.getConnection();
            await this.db.exec("BEGIN TRANSACTION;");
            await this.db.run(INSERT_SQL, [
                user.id,
                user.name,
                user.email,
                user.password,
                user.role,
            ]);
            await this.db.exec("COMMIT;");
            return user.getid();
        }
        catch (error) {
            if (this.db)
                await this.db.exec("ROLLBACK;");
            logger_1.default.error("Error creating user %s: %o", user.id, error);
            throw new repositoryExceptions_1.DbException("Failed to create user.");
        }
    }
    async get(id) {
        try {
            const conn = await ConnectionManager_1.ConnectionManager.getConnection();
            const row = await conn.get(SELECT_BY_ID_SQL, id);
            if (!row) {
                throw new NotFoundException_1.NotFoundException(`User with id ${id} not found`);
            }
            return this.mapRowToUser(row);
        }
        catch (error) {
            logger_1.default.error("Error getting user %s: %o", id, error);
            if (error instanceof NotFoundException_1.NotFoundException)
                throw error;
            throw new repositoryExceptions_1.DbException("Failed to get user.");
        }
    }
    async getall() {
        try {
            const conn = await ConnectionManager_1.ConnectionManager.getConnection();
            const rows = await conn.all(SELECT_ALL_SQL);
            return rows.map((r) => this.mapRowToUser(r));
        }
        catch (error) {
            logger_1.default.error("Error getting all users: %o", error);
            throw new repositoryExceptions_1.DbException("Failed to get all users.");
        }
    }
    async update(user) {
        try {
            this.db = await ConnectionManager_1.ConnectionManager.getConnection();
            await this.db.exec("BEGIN TRANSACTION;");
            await this.db.run(UPDATE_SQL, [
                user.name,
                user.email,
                user.password,
                user.role,
                user.id,
            ]);
            await this.db.exec("COMMIT;");
        }
        catch (error) {
            if (this.db)
                await this.db.exec("ROLLBACK;");
            logger_1.default.error("Error updating user %s: %o", user.id, error);
            throw new repositoryExceptions_1.DbException("Failed to update user.");
        }
    }
    async delete(id) {
        try {
            this.db = await ConnectionManager_1.ConnectionManager.getConnection();
            await this.db.exec("BEGIN TRANSACTION;");
            const result = await this.db.run(DELETE_SQL, id);
            if (result.changes === 0) {
                throw new NotFoundException_1.NotFoundException(`User with id ${id} not found`);
            }
            await this.db.exec("COMMIT;");
        }
        catch (error) {
            if (this.db)
                await this.db.exec("ROLLBACK;");
            logger_1.default.error("Error deleting user %s: %o", id, error);
            if (error instanceof NotFoundException_1.NotFoundException)
                throw error;
            throw new repositoryExceptions_1.DbException("Failed to delete user.");
        }
    }
    async getbyemail(email) {
        if (!this.db) {
            throw new repositoryExceptions_1.DbException("Database not initialized.");
        }
        const SELECT_BY_EMAIL_SQL = `
    SELECT *
    FROM users
    WHERE email = ?;
`;
        return await this.db.get(SELECT_BY_EMAIL_SQL, email).then((row) => {
            if (!row) {
                throw new NotFoundException_1.NotFoundException(`User with email ${email} not found`);
            }
            return this.mapRowToUser(row);
        });
    }
}
exports.UserSqliteRepository = UserSqliteRepository;
//# sourceMappingURL=UserRepository.js.map