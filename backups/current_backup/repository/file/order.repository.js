"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
const repositoryExceptions_1 = require("../../util/exceptions/repositoryExceptions");
const logger_1 = __importDefault(require("../../util/logger"));
class OrderRepository {
    getbyemail() {
        throw new Error("Method not implemented.");
    }
    init() {
        throw new Error("Method not implemented.");
    }
    mapRowToUser() {
        throw new Error("Method not implemented.");
    }
    async create(item) {
        if (!item) {
            logger_1.default.error("failed to create an IOrder: " + item);
            throw new repositoryExceptions_1.InvalidItemException("Invalid item");
        }
        const IOrders = await this.load();
        const id = IOrders.push(item);
        await this.save(IOrders);
        logger_1.default.info("IOrder created with id: " + id);
        return String(id);
    }
    async get(id) {
        const IOrders = await this.load();
        const findIOrder = IOrders.find(IOrder => IOrder.getid() === id);
        if (!findIOrder) {
            logger_1.default.error("failed to fint an IOrder with id: " + id);
            throw new repositoryExceptions_1.ItemNotFoundException("Failed to find the element");
        }
        logger_1.default.info("IOrder found with id: " + id);
        return findIOrder;
    }
    async getall() {
        logger_1.default.info("all IOrders retrieved");
        return this.load();
    }
    async update(item) {
        if (!item) {
            logger_1.default.error("failed to update an IOrder: " + item);
            throw new repositoryExceptions_1.InvalidItemException("Invalid item");
        }
        const IOrders = await this.load();
        const index = IOrders.findIndex(IOrder => IOrder.getid() === item.getid());
        if (index === -1) {
            logger_1.default.error("failed to update an IOrder with id: " + item.getid());
            throw new repositoryExceptions_1.ItemNotFoundException("Item not found");
        }
        IOrders[index] = item;
        await this.save(IOrders);
        logger_1.default.info("IOrder updated with id: " + item.getid());
    }
    async delete(id) {
        const IOrders = await this.load();
        const index = IOrders.findIndex(IOrder => IOrder.getid() === id);
        if (index === -1) {
            logger_1.default.error("failed to delete an IOrder with id: " + id);
            throw new repositoryExceptions_1.ItemNotFoundException("Item not found");
        }
        IOrders.splice(index, 1);
        await this.save(IOrders);
        logger_1.default.info("IOrder deleted with id: " + id);
    }
}
exports.OrderRepository = OrderRepository;
//# sourceMappingURL=order.repository.js.map