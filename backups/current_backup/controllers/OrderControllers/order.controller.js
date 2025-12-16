"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const mappers_1 = require("../../mappers");
const logger_1 = __importDefault(require("../../util/logger"));
const BadRequestException_1 = require("../../util/exceptions/http/BadRequestException");
class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }
    async createOrder(req, res) {
        const orderData = mappers_1.JsonRequestFactory
            .Create(req.body.category).map(req.body);
        if (!orderData) {
            throw new BadRequestException_1.BadRequestException("Order data is required", { OrderNotFound: true });
        }
        const order = await this.orderService.createOrder(orderData);
        res.status(201).json(order);
    }
    async getOrder(req, res) {
        const orderId = req.params.id;
        if (!orderId) {
            throw new BadRequestException_1.BadRequestException("Order ID is required", { OrderIdMissing: true });
        }
        const order = await this.orderService.getOrderById(orderId);
        res.status(200).json(order);
    }
    //get all orders
    async getAllOrders(req, res) {
        const orders = await this.orderService.listOrders();
        res.status(200).json(orders);
    }
    //update order
    async updateOrder(req, res) {
        const id = req.params.id;
        if (!id) {
            throw new BadRequestException_1.BadRequestException("Order ID is required", { OrderIdMissing: true });
        }
        const orderData = mappers_1.JsonRequestFactory
            .Create(req.body.category).map(req.body);
        if (!orderData) {
            logger_1.default.error("Order data is missing in the request body");
            throw new BadRequestException_1.BadRequestException("Order data is required", { OrderNotFound: true });
        }
        if (orderData.getid() !== id) {
            throw new BadRequestException_1.BadRequestException("id in body is different from id in param", {
                IdMismatch: true,
                IdInBody: orderData.getid(),
                IdInParam: id
            });
        }
        await this.orderService.updateOrder(orderData);
        res.status(200).json({ message: "Order updated successfully" });
    }
    //delete order
    async deleteOrder(req, res) {
        const orderId = req.params.id;
        if (!orderId) {
            throw new BadRequestException_1.BadRequestException("Order ID is required", { OrderIdMissing: true });
        }
        await this.orderService.deleteOrder(orderId);
        res.status(200).json({ message: "Order deleted successfully" });
    }
}
exports.OrderController = OrderController;
//# sourceMappingURL=order.controller.js.map