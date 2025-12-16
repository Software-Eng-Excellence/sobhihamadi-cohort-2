"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CakeOrderRepository = void 0;
const logger_1 = __importDefault(require("../../util/logger"));
const repositoryExceptions_1 = require("../../util/exceptions/repositoryExceptions");
const ConnectionManager_1 = require("./ConnectionManager");
const IItem_1 = require("../../model/IItem");
const CakeMapper_1 = require("../../mappers/CakeMapper");
const TableName = IItem_1.ItemCategory.Cake;
const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS ${TableName}(
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    flavor TEXT NOT NULL,
    filling TEXT NOT NULL,
    size INTEGER NOT NULL,
    layers INTEGER NOT NULL,
    frostingType TEXT NOT NULL,
    frostingFlavor TEXT NOT NULL,
    decorationType TEXT NOT NULL,
    decorationColor TEXT NOT NULL,
    customMessage TEXT,
    shape TEXT NOT NULL,
    allergies TEXT,
    specialIngredients TEXT,
    packagingType TEXT NOT NULL
);`;
const INSERT_CAKE = `INSERT INTO ${TableName}
 (id,type, flavor, filling, size, layers, frostingType, frostingFlavor, decorationType, decorationColor,
  customMessage, shape, allergies,
   specialIngredients, packagingType)
   VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
const SELECT_CAKE_BY_ID = `SELECT * FROM ${TableName} WHERE id=?;`;
const GET_ALL = `SELECT * FROM ${TableName};`;
const DELETE_CAKE_BY_ID = `DELETE FROM ${TableName} WHERE id=?;`;
const UPDATE_CAKE = `UPDATE ${TableName} SET type=?, flavor=?, filling=?, size=?, layers=?, frostingType=?,
    frostingFlavor=?, decorationType=?, decorationColor=?, customMessage=?, shape=?, allergies=?,
    specialIngredients=?, packagingType=? WHERE id=?;`;
class CakeOrderRepository {
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
            logger_1.default.info("cake table created or already exists.");
        }
        catch (error) {
            logger_1.default.error("Error during cake table initialization " + error);
            throw new repositoryExceptions_1.InitializationException("Failed to initialize the database(cake).");
        }
    }
    async create(item) {
        try {
            const conn = await ConnectionManager_1.ConnectionManager.getConnection();
            await conn.run(INSERT_CAKE, [
                item.getid(),
                item.getType(),
                item.getFlavor(),
                item.getFilling(),
                item.getSize(),
                item.getLayers(),
                item.getFrostingType(),
                item.getFrostingFlavor(),
                item.getDecorationType(),
                item.getDecorationColor(),
                item.getCustomMessage(),
                item.getShape(),
                item.getAllergies(),
                item.getSpecialIngredients(),
                item.getPackagingType(),
            ]);
            logger_1.default.info("Creating cake, id=%s params=%o", item.getid());
            return item.getid();
        }
        catch (error) {
            // Log full error (sqlite message + stack) before rethrowing
            logger_1.default.error("Failed to create cake order (raw): %o", error);
            throw new repositoryExceptions_1.DbException("Failed to create cake order");
        }
    }
    async get(id) {
        try {
            const conn = await ConnectionManager_1.ConnectionManager.getConnection();
            const result = await conn.get(SELECT_CAKE_BY_ID, id);
            if (!result) {
                throw new repositoryExceptions_1.ItemNotFoundException(`Cake with id ${id} not found`);
            }
            return new CakeMapper_1.SQLITECakeMapper().map(result);
        }
        catch (error) {
            logger_1.default.error("failed to get cake of id %s %o ", id, error.message);
            throw new repositoryExceptions_1.DbException("Failed to get cake order");
        }
    }
    async getall() {
        try {
            const conn = await ConnectionManager_1.ConnectionManager.getConnection();
            const results = await conn.all(GET_ALL);
            const cakes = new CakeMapper_1.SQLITECakeMapper();
            return results.map((cake) => cakes.map(cake));
        }
        catch {
            logger_1.default.error("failed to get all cakes ");
            throw new repositoryExceptions_1.DbException("Failed to get all cakes ");
        }
    }
    async update(item) {
        try {
            const conn = await ConnectionManager_1.ConnectionManager.getConnection();
            await conn.run(UPDATE_CAKE, [
                item.getType(),
                item.getFlavor(),
                item.getFilling(),
                item.getSize(),
                item.getLayers(),
                item.getFrostingType(),
                item.getFrostingFlavor(),
                item.getDecorationType(),
                item.getDecorationColor(),
                item.getCustomMessage(),
                item.getShape(),
                item.getAllergies(),
                item.getSpecialIngredients(),
                item.getPackagingType(),
                item.getid()
            ]);
        }
        catch (error) {
            logger_1.default.error("Error updating cake of id %s: %o", item.getid(), error.message);
            throw new repositoryExceptions_1.DbException("Failed to update cake" + item.getid());
        }
    }
    async delete(id) {
        try {
            const conn = await ConnectionManager_1.ConnectionManager.getConnection();
            await conn.run(DELETE_CAKE_BY_ID, id);
        }
        catch (error) {
            logger_1.default.error("Error deleting cake of id %s: %o", id, error.message);
            throw new repositoryExceptions_1.DbException("Failed to delete cake");
        }
    }
}
exports.CakeOrderRepository = CakeOrderRepository;
//# sourceMappingURL=CakeOrder.repository.js.map