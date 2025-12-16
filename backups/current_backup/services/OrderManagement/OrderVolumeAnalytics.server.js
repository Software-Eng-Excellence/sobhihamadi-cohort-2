"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderVolumeAnalyticsService = void 0;
const BadRequestException_1 = require("../../util/exceptions/http/BadRequestException");
class OrderVolumeAnalyticsService {
    constructor(orderManagementServer1) {
        this.orderManagementServer1 = orderManagementServer1;
    }
    async getTotalOrders() {
        const orders = await this.orderManagementServer1.listOrders();
        for (const order of orders) {
            this.validateAnalyticsOrder(order);
        }
        return orders.length;
    }
    //Generate order counts grouped by item category
    async getOrderCountsByCategory() {
        const orders = await this.orderManagementServer1.listOrders();
        const orderCounts = new Map();
        for (const order of orders) {
            this.validateAnalyticsOrder(order);
            const category = order.getItem().getCategory();
            const currentCount = orderCounts.get(category) || 0;
            orderCounts.set(category, currentCount + 1);
        }
        return orderCounts;
    }
    validateAnalyticsOrder(order) {
        const missingItem = !order.getItem();
        const missingCategory = missingItem ? true : !order.getItem().getCategory();
        const invalidPrice = order.getPrice() == null || isNaN(order.getPrice());
        const invalidQuantity = order.getQuantity() == null || isNaN(order.getQuantity());
        if (missingItem || missingCategory || invalidPrice || invalidQuantity) {
            const details = {
                MissingItem: missingItem,
                MissingCategory: missingCategory,
                InvalidPrice: invalidPrice,
                InvalidQuantity: invalidQuantity,
                OrderId: order?.getid?.(),
            };
            throw new BadRequestException_1.BadRequestException("Invalid order data for analytics", details);
        }
    }
}
exports.OrderVolumeAnalyticsService = OrderVolumeAnalyticsService;
//# sourceMappingURL=OrderVolumeAnalytics.server.js.map