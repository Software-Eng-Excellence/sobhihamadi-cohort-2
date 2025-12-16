"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CakeRepositoryPostgre = void 0;
const PostgreConnection_1 = require("./PostgreConnection");
const logger_1 = __importDefault(require("../../util/logger"));
const repositoryExceptions_1 = require("../../util/exceptions/repositoryExceptions");
const CakeMapper_1 = require("../../mappers/CakeMapper");
const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS cake( 
 "id" TEXT PRIMARY KEY,
        "type" TEXT NOT NULL,
        "flavor" TEXT NOT NULL,
        "filling" TEXT NOT NULL,
        "size" INTEGER NOT NULL,
        "layers" INTEGER NOT NULL,
        "frostingType" TEXT NOT NULL,
        "frostingFlavor" TEXT NOT NULL,
        "decorationType" TEXT NOT NULL,
        "decorationColor" TEXT NOT NULL,
        "customMessage" TEXT,
        "shape" TEXT NOT NULL,
        "allergies" TEXT,
        "specialIngredients" TEXT,
        "packagingType" TEXT NOT NULL
);`;
const INSERT_CAKE = `
INSERT INTO cake
("id","type","flavor","filling","size","layers",
 "frostingType","frostingFlavor","decorationType","decorationColor",
 "customMessage","shape","allergies","specialIngredients","packagingType")
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
`;
const GET_BY_ID = `SELECT * FROM cake WHERE id=$1;`;
const GET_ALL = `SELECT * FROM cake;`;
const UPDATE_CAKE = `
UPDATE cake SET 
"type"=$1,
"flavor"=$2,
"filling"=$3,
"size"=$4,
"layers"=$5,
"frostingType"=$6,
"frostingFlavor"=$7,
"decorationType"=$8,
"decorationColor"=$9,
"customMessage"=$10,
"shape"=$11,
"allergies"=$12,
"specialIngredients"=$13,
"packagingType"=$14
WHERE "id"=$15;
`;
const DELETE_CAKE_BY_ID = `DELETE FROM cake WHERE id=$1;`;
class CakeRepositoryPostgre {
    getbyemail() {
        throw new Error("Method not implemented.");
    }
    mapRowToUser() {
        throw new Error("Method not implemented.");
    }
    async init() {
        try {
            const conn = await PostgreConnection_1.ConnectionManager.getPostgreConnection();
            await conn.query(CREATE_TABLE);
            logger_1.default.info("PostgreSQL cake table created or already exists.");
        }
        catch (error) {
            logger_1.default.error("Error during PostgreSQL cake table initialization " + error);
            throw new repositoryExceptions_1.InitializationException("Failed to initialize the PostgreSQL cake database.");
        }
    }
    async create(item) {
        try {
            const conn = await PostgreConnection_1.ConnectionManager.getPostgreConnection();
            await conn.query(INSERT_CAKE, [
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
            logger_1.default.info("Cake inserted into PostgreSQL database with ID: %s", item.getid());
            return item.getid();
        }
        catch (error) {
            logger_1.default.error("Error during inserting cake into PostgreSQL " + error);
            throw new Error("Failed to insert cake into PostgreSQL database.");
        }
    }
    async get(id) {
        let conn;
        try {
            conn = await PostgreConnection_1.ConnectionManager.getPostgreConnection();
            const result = await conn.query(GET_BY_ID, [id]);
            if (result.rows.length === 0) {
                throw new Error(`Cake with ID ${id} not found.`);
            }
            logger_1.default.info("Cake retrieved from PostgreSQL database with ID: %s", id);
            return new CakeMapper_1.SQLITECakeMapper().map(result.rows[0]);
        }
        catch (error) {
            logger_1.default.error("Error during getting cake from PostgreSQL " + error);
            throw new Error("Failed to get cake from PostgreSQL database.");
        }
    }
    async getall() {
        try {
            const conn = await PostgreConnection_1.ConnectionManager.getPostgreConnection();
            const result = await conn.query(GET_ALL);
            const cakes = new CakeMapper_1.SQLITECakeMapper();
            logger_1.default.info("get ALL cakes from PostgreSQL database ");
            return result.rows.map((cake) => cakes.map(cake));
        }
        catch (error) {
            logger_1.default.error("Error during getting all cakes from PostgreSQL " + error);
            throw new Error("Failed to get all cakes from PostgreSQL database.");
        }
    }
    async update(item) {
        try {
            const conn = await PostgreConnection_1.ConnectionManager.getPostgreConnection();
            await conn.query(UPDATE_CAKE, [
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
            logger_1.default.info("Cake updated in PostgreSQL database with ID: %s", item.getid());
        }
        catch (error) {
            logger_1.default.error("Error during updating cake in PostgreSQL " + error);
            throw new Error("Failed to update cake in PostgreSQL database.");
        }
    }
    async delete(id) {
        try {
            const conn = await PostgreConnection_1.ConnectionManager.getPostgreConnection();
            await conn.query(DELETE_CAKE_BY_ID, [id]);
            logger_1.default.info("Cake deleted from PostgreSQL database with ID: %s", id);
        }
        catch (error) {
            logger_1.default.error("Error during deleting cake from PostgreSQL " + error);
            throw new Error("Failed to delete cake from PostgreSQL database.");
        }
    }
}
exports.CakeRepositoryPostgre = CakeRepositoryPostgre;
//# sourceMappingURL=CakeRepositoryP.js.map