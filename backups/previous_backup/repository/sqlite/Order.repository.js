"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
const ConnectionManager_1 = require("./ConnectionManager");
const logger_1 = __importDefault(require("../../util/logger"));
const repositoryExceptions_1 = require("../../util/exceptions/repositoryExceptions");
const OrderMapper_1 = require("../../mappers/OrderMapper");
const INSERT_ORDER = `
  INSERT INTO "order" (id, item, quantity, Item_Category, price)
  VALUES (?, ?, ?, ?, ?);
`;
const CREATE_TABLE = `
  CREATE TABLE IF NOT EXISTS "order" (
    id TEXT PRIMARY KEY,
    item TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    Item_Category TEXT NOT NULL,
    price INTEGER NOT NULL
  );
`;
const SELECT_BY_ID = `SELECT * FROM "order" WHERE id = ?;`;
// Use the same column name as in CREATE_TABLE (case-insensitive in SQLite, but keep it consistent)
const GET_ALL = `SELECT * FROM "order" WHERE Item_Category = ?;`;
const DELETE_BY_ID = `DELETE FROM "order" WHERE id = ?;`;
const UPDATE_ORDER = `
  UPDATE "order"
  SET item = ?, quantity = ?, Item_Category = ?, price = ?
  WHERE id = ?;
`;
class OrderRepository {
    constructor(itemrepository) {
        this.itemrepository = itemrepository;
    }
    getbyemail() {
        throw new Error("Method not implemented.");
    }
    mapRowToUser() {
        throw new Error("Method not implemented.");
    }
    async create(order) {
        let conn;
        try {
            conn = await ConnectionManager_1.ConnectionManager.getConnection();
            // Start a transaction
            await conn.exec("BEGIN TRANSACTION;");
            const itemId = await this.itemrepository.create(order.getItem());
            await conn.run(INSERT_ORDER, [
                order.getid(),
                itemId,
                order.getQuantity(),
                order.getItem().getCategory(),
                order.getPrice(),
            ]);
            // Commit the transaction
            await conn.exec("COMMIT;");
            return order.getid();
        }
        catch (error) {
            if (conn) {
                try {
                    await conn.exec("ROLLBACK;");
                }
                catch (rollbackError) {
                    logger_1.default.error("Rollback failed in OrderRepository.create: %o", rollbackError);
                }
            }
            logger_1.default.error("Error in OrderRepository.create: %o", error);
            throw new repositoryExceptions_1.DbException("Failed to create item in the database.");
        }
    }
    async get(id) {
        try {
            const conn = await ConnectionManager_1.ConnectionManager.getConnection();
            const result = await conn.get(SELECT_BY_ID, id);
            if (!result) {
                throw new Error(`Order with id ${id} not found`);
            }
            const cake = await this.itemrepository.get(result.item);
            return new OrderMapper_1.SQLITEOrderMapper().map({ data: result, item: cake });
        }
        catch (error) {
            logger_1.default.error("Error getting order of id %s %o", id, error.message);
            throw new repositoryExceptions_1.DbException("Failed to get order of id");
        }
    }
    async getall() {
        try {
            const conn = await ConnectionManager_1.ConnectionManager.getConnection();
            const items = await this.itemrepository.getall();
            if (items.length === 0) {
                return [];
            }
            const orders = await conn.all(GET_ALL, items[0].getCategory());
            // Bind orders to items
            const BindedOrders = orders.map((order) => {
                const foundItem = items.find((item) => item.getid() === order.item);
                if (!foundItem) {
                    throw new repositoryExceptions_1.DbException(`Item with id ${order.item} not found for order ${order.id}`);
                }
                return { order, foundItem };
            });
            // For each bound order, map it into an identifierOrder
            const identifierOrders = BindedOrders.map(({ order, foundItem }) => {
                return new OrderMapper_1.SQLITEOrderMapper().map({ data: order, item: foundItem });
            });
            return identifierOrders;
        }
        catch (error) {
            logger_1.default.error("Error getting all orders: %o", error.message);
            throw new repositoryExceptions_1.DbException("Failed to get all orders");
        }
    }
    async update(order) {
        let conn;
        try {
            conn = await ConnectionManager_1.ConnectionManager.getConnection();
            await conn.exec("BEGIN TRANSACTION;");
            await this.itemrepository.update(order.getItem());
            // Parameter order must match UPDATE_ORDER definition
            await conn.run(UPDATE_ORDER, [
                order.getItem().getid(), // item
                order.getQuantity(), // quantity
                order.getItem().getCategory(), // Item_Category
                order.getPrice(), // price
                order.getid(), // WHERE id = ?
            ]);
            await conn.exec("COMMIT;");
        }
        catch (error) {
            if (conn) {
                try {
                    await conn.exec("ROLLBACK;");
                }
                catch (rollbackError) {
                    logger_1.default.error("Rollback failed in OrderRepository.update: %o", rollbackError);
                }
            }
            logger_1.default.error("Error updating order of id %s: %o", order.getid(), error.message);
            throw new repositoryExceptions_1.DbException("Failed to update order");
        }
    }
    async delete(id) {
        let conn;
        try {
            conn = await ConnectionManager_1.ConnectionManager.getConnection();
            await conn.exec("BEGIN TRANSACTION;");
            await this.itemrepository.delete(id);
            await conn.run(DELETE_BY_ID, id);
            await conn.exec("COMMIT;");
        }
        catch (error) {
            if (conn) {
                try {
                    await conn.exec("ROLLBACK;");
                }
                catch (rollbackError) {
                    logger_1.default.error("Rollback failed in OrderRepository.delete: %o", rollbackError);
                }
            }
            logger_1.default.error("Error deleting order of id %s: %o", id, error.message);
            throw new repositoryExceptions_1.DbException("Failed to delete order");
        }
    }
    async init() {
        try {
            const conn = await ConnectionManager_1.ConnectionManager.getConnection();
            await conn.exec(CREATE_TABLE);
            console.log("Order table ready");
            console.log("Item repo is: ", this.itemrepository);
            await this.itemrepository.init();
            logger_1.default.info("Order table created or already exists.");
        }
        catch (error) {
            logger_1.default.error("Error during database initialization: %o", error);
            throw new repositoryExceptions_1.InitializationException("Failed to initialize the database.");
        }
    }
}
exports.OrderRepository = OrderRepository;
//# sourceMappingURL=Order.repository.js.map