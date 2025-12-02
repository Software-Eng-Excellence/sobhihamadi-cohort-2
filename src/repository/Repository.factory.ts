import { ItemCategory } from "../model/IItem";
import { identifierOrderItem } from "../model/IOrder";
import { Initializable, IRepository } from "./IRepository";
import { OrderRepository } from "./sqlite/Order.repository";
import { CakeOrderRepository } from "./sqlite/CakeOrder.repository";

import { CakeRepositoryPostgre } from "./PostgreSQL/CakeRepositoryP";
import { BookRepositoryPostgre } from "./PostgreSQL/BookRepositoryP";
import { ToyPostgreRepository } from "./PostgreSQL/ToyRepositoryP";
import { BookOrderRepository } from "./sqlite/BookOrder.repository";
import { ToyOrderRepository } from "./sqlite/ToyOrder.repository";

import { DBMode } from "../config/db_mode";

// NEW imports for User
import { User } from "../model/user.model";
import { UserSqliteRepository } from "./usersrepository/UserRepository";

export class RepositoryFactory {

  // existing factory for order repositories (unchanged)
  public static async create(
    mode: DBMode,
    category: ItemCategory
  ): Promise<IRepository<identifierOrderItem>> {
    let repository: IRepository<identifierOrderItem> & Initializable;

    switch (mode) {
      case DBMode.POSTGRES: {
        switch (category) {
          case ItemCategory.Cake:
            repository = new OrderRepository(new CakeRepositoryPostgre());
            break;

          case ItemCategory.Book:
            repository = new OrderRepository(new BookRepositoryPostgre());
            break;

          case ItemCategory.Toy:
            repository = new OrderRepository(new ToyPostgreRepository());
            break;

          default:
            throw new Error("Invalid category");
        }
        await repository.init();
        return repository;
      }

      case DBMode.SQLITE: {
        switch (category) {
          case ItemCategory.Cake:
            repository = new OrderRepository(new CakeOrderRepository());
            break;

          case ItemCategory.Book:
            repository = new OrderRepository(new BookOrderRepository());
            break;

          case ItemCategory.Toy:
            repository = new OrderRepository(new ToyOrderRepository());
            break;

          default:
            throw new Error("Invalid category");
        }
        await repository.init();
        return repository;
      }

      case DBMode.CSV: {
        throw new Error("file csv Mode is deprecated");
      }
    }
  }

  // NEW: factory method for User repository
   public static async createUserRepository(
    mode: DBMode
  ): Promise<IRepository<User>> {
    let repository: IRepository<User> & Initializable;

    switch (mode) {
      case DBMode.SQLITE: {
        repository = new UserSqliteRepository();
        await repository.init();
        return repository;
      }

      case DBMode.POSTGRES: {
        // if you later implement UserPostgreRepository, plug it here
        throw new Error("User repository for POSTGRES is not implemented");
      }

      case DBMode.CSV: {
        throw new Error("User repository does not support CSV mode");
      }

      default: {
        throw new Error("Invalid DB mode");
      }
    }
  }
}
