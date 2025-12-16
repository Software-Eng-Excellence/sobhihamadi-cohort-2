"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderManagementService = void 0;
const Repository_factory_1 = require("../../repository/Repository.factory");
const config_1 = __importDefault(require("../../config"));
const IItem_1 = require("../../model/IItem");
const NotFoundException_1 = require("../../util/exceptions/http/NotFoundException");
const BadRequestException_1 = require("../../util/exceptions/http/BadRequestException");
class OrderManagementService {
    //create order 
    async createOrder(order) {
        //validation and creation logic
        this.validateOrder(order);
        // Implementation of order management server logic goes here
        const repo = await this.getrepo(order.getItem().getCategory());
        await repo.create(order);
        return order;
    }
    //get order
    async getOrderById(orderId) {
        const categories = Object.values(IItem_1.ItemCategory);
        for (const category of categories) {
            const repo = await this.getrepo(category);
            const order = await repo.get(orderId);
            return order;
        }
        throw new NotFoundException_1.NotFoundException(`Order with id ${orderId} not found`);
    }
    //update order
    async updateOrder(order) {
        this.validateOrder(order);
        const repo = await this.getrepo(order.getItem().getCategory());
        const existing = await repo.get(order.getid());
        if (!existing) {
            throw new NotFoundException_1.NotFoundException(`Order with id ${order.getid()} not found`);
        }
        await repo.update(order);
    }
    //delete order
    async deleteOrder(orderId) {
        const categories = Object.values(IItem_1.ItemCategory);
        for (const category of categories) {
            const repo = await this.getrepo(category);
            const order = await repo.get(orderId);
            if (order) {
                await repo.delete(orderId);
                return;
            }
        }
        throw new NotFoundException_1.NotFoundException(`Order with id ${orderId} not found`);
    }
    //list orders
    async listOrders() {
        const allorders = [];
        const categories = Object.values(IItem_1.ItemCategory);
        for (const category of categories) {
            const repo = await this.getrepo(category);
            const orders = await repo.getall();
            allorders.push(...orders);
        }
        return allorders;
    }
    //get total orders
    getrepo(category) {
        return Repository_factory_1.RepositoryFactory.create(config_1.default.DBMode, category);
    }
    validateOrder(order) {
        if (!order.getItem() || order.getPrice() <= 0 || order.getQuantity() <= 0) {
            const Details = {
                ItemNotDefined: !order.getItem(),
                PriceNegative: order.getPrice() <= 0,
                QuantityNegative: order.getQuantity() <= 0
            };
            throw new BadRequestException_1.BadRequestException("Invalid order:item, price, and quantity are required", Details);
        }
    }
}
exports.OrderManagementService = OrderManagementService;
//# sourceMappingURL=ordermanagement.server.js.map