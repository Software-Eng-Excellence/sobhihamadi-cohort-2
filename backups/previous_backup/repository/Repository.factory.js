"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryFactory = void 0;
const IItem_1 = require("../model/IItem");
const Order_repository_1 = require("./sqlite/Order.repository");
const CakeOrder_repository_1 = require("./sqlite/CakeOrder.repository");
const CakeRepositoryP_1 = require("./PostgreSQL/CakeRepositoryP");
const BookRepositoryP_1 = require("./PostgreSQL/BookRepositoryP");
const ToyRepositoryP_1 = require("./PostgreSQL/ToyRepositoryP");
const BookOrder_repository_1 = require("./sqlite/BookOrder.repository");
const ToyOrder_repository_1 = require("./sqlite/ToyOrder.repository");
const db_mode_1 = require("../config/db_mode");
const UserRepository_1 = require("./usersrepository/UserRepository");
class RepositoryFactory {
    // existing factory for order repositories (unchanged)
    static async create(mode, category) {
        let repository;
        switch (mode) {
            case db_mode_1.DBMode.POSTGRES: {
                switch (category) {
                    case IItem_1.ItemCategory.Cake:
                        repository = new Order_repository_1.OrderRepository(new CakeRepositoryP_1.CakeRepositoryPostgre());
                        break;
                    case IItem_1.ItemCategory.Book:
                        repository = new Order_repository_1.OrderRepository(new BookRepositoryP_1.BookRepositoryPostgre());
                        break;
                    case IItem_1.ItemCategory.Toy:
                        repository = new Order_repository_1.OrderRepository(new ToyRepositoryP_1.ToyPostgreRepository());
                        break;
                    default:
                        throw new Error("Invalid category");
                }
                await repository.init();
                return repository;
            }
            case db_mode_1.DBMode.SQLITE: {
                switch (category) {
                    case IItem_1.ItemCategory.Cake:
                        repository = new Order_repository_1.OrderRepository(new CakeOrder_repository_1.CakeOrderRepository());
                        break;
                    case IItem_1.ItemCategory.Book:
                        repository = new Order_repository_1.OrderRepository(new BookOrder_repository_1.BookOrderRepository());
                        break;
                    case IItem_1.ItemCategory.Toy:
                        repository = new Order_repository_1.OrderRepository(new ToyOrder_repository_1.ToyOrderRepository());
                        break;
                    default:
                        throw new Error("Invalid category");
                }
                await repository.init();
                return repository;
            }
            case db_mode_1.DBMode.CSV: {
                throw new Error("file csv Mode is deprecated");
            }
        }
    }
    // NEW: factory method for User repository
    static async createUserRepository(mode) {
        let repository;
        switch (mode) {
            case db_mode_1.DBMode.SQLITE: {
                repository = new UserRepository_1.UserSqliteRepository();
                await repository.init();
                return repository;
            }
            case db_mode_1.DBMode.POSTGRES: {
                // if you later implement UserPostgreRepository, plug it here
                throw new Error("User repository for POSTGRES is not implemented");
            }
            case db_mode_1.DBMode.CSV: {
                throw new Error("User repository does not support CSV mode");
            }
            default: {
                throw new Error("Invalid DB mode");
            }
        }
    }
}
exports.RepositoryFactory = RepositoryFactory;
//# sourceMappingURL=Repository.factory.js.map