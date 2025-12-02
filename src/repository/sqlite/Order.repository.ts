import { identifierOrderItem } from "model/IOrder";
import { ID, Initializable, IRepository, IRepositoryWithInit } from "repository/IRepository";
import { ConnectionManager } from "./ConnectionManager";
import logger from "../../util/logger";
import { DbException, InitializationException } from "../../util/exceptions/repositoryExceptions";
import { identifierItem } from "model/IItem";
import { ISQLITEOrderData, SQLITEOrderMapper } from "../../mappers/OrderMapper";
import { IdentifierOrderItem, Order } from "model/order.model";
import { User } from "model/user.model";

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

export class OrderRepository implements IRepository<identifierOrderItem>, Initializable {

  constructor(
    private readonly itemrepository: IRepository<identifierItem> & Initializable
  ) {}

  getbyemail(email: string): Promise<User> {
    throw new Error("Method not implemented.");
  }

  mapRowToUser(row: any): User {
    throw new Error("Method not implemented.");
  }

  async create(order: identifierOrderItem): Promise<ID> {
    let conn;
    try {
      conn = await ConnectionManager.getConnection();

      // Start a transaction
      await conn.exec("BEGIN TRANSACTION;");

      const itemId = await this.itemrepository.create(order.getItem() as identifierItem);

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
    } catch (error: unknown) {
      if (conn) {
        try {
          await conn.exec("ROLLBACK;");
        } catch (rollbackError) {
          logger.error("Rollback failed in OrderRepository.create: %o", rollbackError);
        }
      }
      logger.error("Error in OrderRepository.create: %o", error);
      throw new DbException("Failed to create item in the database.", error as Error);
    }
  }

  async get(id: ID): Promise<identifierOrderItem> {
    try {
      const conn = await ConnectionManager.getConnection();
      const result = await conn.get<ISQLITEOrderData>(SELECT_BY_ID, id);

      if (!result) {
        throw new Error(`Order with id ${id} not found`);
      }

      const cake = await this.itemrepository.get(result.item);

      return new SQLITEOrderMapper().map({ data: result, item: cake });
    } catch (error: unknown) {
      logger.error("Error getting order of id %s %o", id, (error as Error).message);
      throw new DbException("Failed to get order of id", error as Error);
    }
  }

  async getall(): Promise<identifierOrderItem[]> {
    try {
      const conn = await ConnectionManager.getConnection();
      const items = await this.itemrepository.getall();

      if (items.length === 0) {
        return [];
      }

      const orders = await conn.all<ISQLITEOrderData[]>(GET_ALL, items[0].getCategory());

      // Bind orders to items
      const BindedOrders = orders.map((order) => {
        const foundItem = items.find((item) => item.getid() === order.item);
        if (!foundItem) {
          throw new DbException(
            `Item with id ${order.item} not found for order ${order.id}`,
            new Error("Data inconsistency")
          );
        }
        return { order, foundItem };
      });

      // For each bound order, map it into an identifierOrder
      const identifierOrders = BindedOrders.map(({ order, foundItem }) => {
        return new SQLITEOrderMapper().map({ data: order, item: foundItem });
      });

      return identifierOrders;
    } catch (error) {
      logger.error("Error getting all orders: %o", (error as Error).message);
      throw new DbException("Failed to get all orders", error as Error);
    }
  }

  async update(order: IdentifierOrderItem): Promise<void> {
    let conn;
    try {
      conn = await ConnectionManager.getConnection();
      await conn.exec("BEGIN TRANSACTION;");

      await this.itemrepository.update(order.getItem());

      // Parameter order must match UPDATE_ORDER definition
      await conn.run(UPDATE_ORDER, [
        order.getItem().getid(),           // item
        order.getQuantity(),               // quantity
        order.getItem().getCategory(),     // Item_Category
        order.getPrice(),                  // price
        order.getid(),                     // WHERE id = ?
      ]);

      await conn.exec("COMMIT;");
    } catch (error) {
      if (conn) {
        try {
          await conn.exec("ROLLBACK;");
        } catch (rollbackError) {
          logger.error("Rollback failed in OrderRepository.update: %o", rollbackError);
        }
      }
      logger.error("Error updating order of id %s: %o", order.getid(), (error as Error).message);
      throw new DbException("Failed to update order", error as Error);
    }
  }

  async delete(id: ID): Promise<void> {
    let conn;
    try {
      conn = await ConnectionManager.getConnection();
      await conn.exec("BEGIN TRANSACTION;");

      await this.itemrepository.delete(id);
      await conn.run(DELETE_BY_ID, id);

      await conn.exec("COMMIT;");
    } catch (error) {
      if (conn) {
        try {
          await conn.exec("ROLLBACK;");
        } catch (rollbackError) {
          logger.error("Rollback failed in OrderRepository.delete: %o", rollbackError);
        }
      }
      logger.error("Error deleting order of id %s: %o", id, (error as Error).message);
      throw new DbException("Failed to delete order", error as Error);
    }
  }

  async init(): Promise<void> {
    try {
      const conn = await ConnectionManager.getConnection();
      await conn.exec(CREATE_TABLE);
      console.log("Order table ready");
      console.log("Item repo is: ", this.itemrepository);
      await this.itemrepository.init();
      logger.info("Order table created or already exists.");
    } catch (error: unknown) {
      logger.error("Error during database initialization: %o", error as Error);
      throw new InitializationException(
        "Failed to initialize the database.",
        error as Error
      );
    }
  }
}
