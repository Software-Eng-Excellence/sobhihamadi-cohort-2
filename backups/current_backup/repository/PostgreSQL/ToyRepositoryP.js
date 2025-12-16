"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToyPostgreRepository = void 0;
const PostgreConnection_1 = require("./PostgreConnection");
const logger_1 = __importDefault(require("../../util/logger"));
const repositoryExceptions_1 = require("../../util/exceptions/repositoryExceptions");
const ToyMapper_1 = require("../../mappers/ToyMapper");
const CREATE_TABLE_TOYS = `CREATE TABLE IF NOT EXISTS toy (
    "id" TEXT PRIMARY KEY,
    "type" TEXT NOT NULL,
    "ageGroup" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "batteryRequired" BOOLEAN NOT NULL,
    "educational" BOOLEAN NOT NULL
);`;
const INSERT_TOY_QUERY = `INSERT INTO toy
    ("id", "type", "ageGroup", "brand", "material", "batteryRequired", "educational")
    VALUES ($1, $2, $3, $4, $5, $6, $7)`;
const SELECT_TOY_BY_ID = `SELECT * FROM toy WHERE id=$1;`;
const SELECT_ALL = `SELECT * FROM toy;`;
const UPDATE_TOY_QUERY = `UPDATE toy SET
    "type"=$1,
    "ageGroup"=$2,
    "brand"=$3,
    "material"=$4,    
    "batteryRequired"=$5,
    "educational"=$6
    WHERE id=$7;`;
const DELETE_TOY_QUERY = `DELETE FROM toy WHERE id=$1;`;
const DROP_TABLE_TOYS = `DROP TABLE IF EXISTS toy;`;
class ToyPostgreRepository {
    getbyemail() {
        throw new Error("Method not implemented.");
    }
    mapRowToUser() {
        throw new Error("Method not implemented.");
    }
    async drop() {
        const conn = await PostgreConnection_1.ConnectionManager.getPostgreConnection();
        await conn.query(DROP_TABLE_TOYS);
        logger_1.default.info("PostgreSQL toy table dropped.");
    }
    async init() {
        try {
            const conn = await PostgreConnection_1.ConnectionManager.getPostgreConnection();
            await conn.query(CREATE_TABLE_TOYS);
            logger_1.default.info("PostgreSQL toy table created or already exists.");
        }
        catch (error) {
            logger_1.default.error("Error during PostgreSQL toy table initialization " + error);
            throw new repositoryExceptions_1.InitializationException("Failed to initialize the PostgreSQL toy database.");
        }
    }
    async create(item) {
        try {
            const conn = await PostgreConnection_1.ConnectionManager.getPostgreConnection();
            await conn.query(INSERT_TOY_QUERY, [
                item.getid(),
                item.getType(),
                item.getAgeGroup(),
                item.getBrand(),
                item.getMaterial(),
                item.getBatteryRequired(),
                item.getEducational()
            ]);
            logger_1.default.info(`Toy with ID ${item.getid()} inserted into PostgreSQL database.`);
            return item.getid();
        }
        catch (error) {
            logger_1.default.error("Error inserting toy into PostgreSQL database " + error);
            throw new Error("Failed to insert toy into PostgreSQL database.");
        }
    }
    async get(id) {
        try {
            const conn = await PostgreConnection_1.ConnectionManager.getPostgreConnection();
            const Toy = await conn.query(SELECT_TOY_BY_ID, [id]);
            if (Toy.rows.length === 0) {
                throw new Error(`Toy with ID ${id} not found.`);
            }
            logger_1.default.info("Toy retrieved from PostgreSQL database with ID: %s", id);
            const toys = new ToyMapper_1.PostgreToyMapper();
            return toys.map(Toy.rows[0]);
        }
        catch (error) {
            logger_1.default.error("Error during getting toy from PostgreSQL " + error);
            throw new Error("Failed to get toy from PostgreSQL database.");
        }
    }
    async getall() {
        try {
            const conn = await PostgreConnection_1.ConnectionManager.getPostgreConnection();
            const result = await conn.query(SELECT_ALL);
            const toys = new ToyMapper_1.PostgreToyMapper();
            logger_1.default.info("get ALL toys from PostgreSQL database ");
            return result.rows.map((toy) => toys.map(toy));
        }
        catch (error) {
            logger_1.default.error("Error during getting all toys from PostgreSQL " + error);
            throw new Error("Failed to get all toys from PostgreSQL database.");
        }
    }
    async update(item) {
        try {
            const conn = await PostgreConnection_1.ConnectionManager.getPostgreConnection();
            await conn.query(UPDATE_TOY_QUERY, [
                item.getType(),
                item.getAgeGroup(),
                item.getBrand(),
                item.getMaterial(),
                item.getBatteryRequired(),
                item.getEducational(),
                item.getid()
            ]);
            logger_1.default.info(`Toy with ID ${item.getid()} updated in PostgreSQL database.`);
        }
        catch (error) {
            logger_1.default.error("Error during updating toy in PostgreSQL " + error);
            throw new Error("Failed to update toy in PostgreSQL database.");
        }
    }
    async delete(id) {
        try {
            const conn = await PostgreConnection_1.ConnectionManager.getPostgreConnection();
            await conn.query(DELETE_TOY_QUERY, [id]);
            logger_1.default.info("Toy deleted from PostgreSQL database with ID: %s", id);
        }
        catch (error) {
            logger_1.default.error("Error during deleting toy from PostgreSQL " + error);
            throw new Error("Failed to delete toy from PostgreSQL database.");
        }
    }
}
exports.ToyPostgreRepository = ToyPostgreRepository;
//# sourceMappingURL=ToyRepositoryP.js.map