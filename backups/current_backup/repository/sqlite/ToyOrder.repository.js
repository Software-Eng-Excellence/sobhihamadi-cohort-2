"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToyOrderRepository = void 0;
const ConnectionManager_1 = require("./ConnectionManager");
const logger_1 = __importDefault(require("../../util/logger"));
const repositoryExceptions_1 = require("../../util/exceptions/repositoryExceptions");
const ToyMapper_1 = require("../../mappers/ToyMapper");
const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS toy (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    ageGroup TEXT NOT NULL,
    brand TEXT NOT NULL,

    material TEXT NOT NULL,
    educational BOOLEAN NOT NULL,
    batteryRequired BOOLEAN NOT NULL

);`;
const INSERT_TOY = `INSERT INTO toy (id, type, ageGroup, brand, material, educational, batteryRequired)
 VALUES (?,?,?,?,?,?,?);`;
const SELECT_TOY_BY_ID = `SELECT * FROM toy WHERE id=?;`;
const GET_ALL = `SELECT * FROM toy;`;
const DELETE_TOY_BY_ID = `DELETE FROM toy WHERE id=?;`;
const UPDATE_TOY = `UPDATE toy SET type=?, ageGroup=?, brand=?, material=?, educational=?, batteryRequired=? WHERE id=?;`;
class ToyOrderRepository {
    getbyemail() {
        throw new Error("Method not implemented.");
    }
    mapRowToUser() {
        throw new Error("Method not implemented.");
    }
    async init() {
        try {
            const conn = await ConnectionManager_1.ConnectionManager.getConnection();
            await conn.exec(CREATE_TABLE);
            logger_1.default.info("toy table created or already exists.");
        }
        catch (error) {
            logger_1.default.error("Error during toy table initialization " + error);
            throw new repositoryExceptions_1.InitializationException("Failed to initialize the database(toy).");
        }
    }
    async create(item) {
        try {
            const conn = await ConnectionManager_1.ConnectionManager.getConnection();
            await conn.run(INSERT_TOY, [
                item.getid(),
                item.getType(),
                item.getAgeGroup(),
                item.getBrand(),
                item.getMaterial(),
                item.getEducational(),
                item.getBatteryRequired()
            ]);
            logger_1.default.info("Creating toy, id=%s params=%o", item.getid());
            return item.getid();
        }
        catch (error) {
            // Log full error (sqlite message + stack) before rethrowing
            logger_1.default.error("Failed to create toy order (raw): %o", error);
            throw new repositoryExceptions_1.DbException("Failed to create toy order");
        }
    }
    async get(id) {
        try {
            const conn = await ConnectionManager_1.ConnectionManager.getConnection();
            const result = await conn.get(SELECT_TOY_BY_ID, id);
            if (!result) {
                throw new repositoryExceptions_1.ItemNotFoundException(`toy with id ${id} not found`);
            }
            return new ToyMapper_1.PostgreToyMapper().map(result);
        }
        catch (error) {
            logger_1.default.error("failed to get toy of id %s %o ", id, error.message);
            throw new repositoryExceptions_1.DbException("Failed to get toy order");
        }
    }
    async getall() {
        try {
            const conn = await ConnectionManager_1.ConnectionManager.getConnection();
            const results = await conn.all(GET_ALL);
            const cakes = new ToyMapper_1.PostgreToyMapper();
            return results.map((cake) => cakes.map(cake));
        }
        catch {
            logger_1.default.error("failed to get all toys ");
            throw new repositoryExceptions_1.DbException("Failed to get all toys ");
        }
    }
    async update(item) {
        try {
            const conn = await ConnectionManager_1.ConnectionManager.getConnection();
            await conn.run(UPDATE_TOY, [
                item.getType(),
                item.getAgeGroup(),
                item.getBrand(),
                item.getMaterial(),
                item.getEducational(),
                item.getBatteryRequired(),
                item.getid()
            ]);
        }
        catch (error) {
            // Log full error (sqlite message + stack) before rethrowing
            logger_1.default.error("Failed to update toy order (raw): %o", error);
            throw new repositoryExceptions_1.DbException("Failed to update toy order");
        }
    }
    async delete(id) {
        try {
            const conn = await ConnectionManager_1.ConnectionManager.getConnection();
            await conn.run(DELETE_TOY_BY_ID, [id]);
        }
        catch (error) {
            // Log full error (sqlite message + stack) before rethrowing
            logger_1.default.error("Failed to delete toy order (raw): %o", error);
            throw new repositoryExceptions_1.DbException("Failed to delete toy order");
        }
    }
}
exports.ToyOrderRepository = ToyOrderRepository;
//# sourceMappingURL=ToyOrder.repository.js.map