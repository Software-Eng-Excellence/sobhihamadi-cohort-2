"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevenueAnalyticsService = void 0;
const BadRequestException_1 = require("../../util/exceptions/http/BadRequestException");
class RevenueAnalyticsService {
    constructor(orderManagementServer1) {
        this.orderManagementServer1 = orderManagementServer1;
    }
    //get total revenue
    async getTotalRevenue() {
        const orders = await this.orderManagementServer1.listOrders();
        const totalRevenue = orders.reduce((sum, order) => {
            this.validateAnalyticsOrder(order);
            return sum + (order.getPrice() * order.getQuantity());
        }, 0);
        return totalRevenue;
    }
    //get revenue breakdown by item type
    async getRevenueByCategory() {
        const orders = await this.orderManagementServer1.listOrders();
        const revenueByCategory = new Map();
        for (const order of orders) {
            this.validateAnalyticsOrder(order);
            const category = order.getItem().getCategory();
            const orderRevenue = order.getPrice() * order.getQuantity();
            const currentRevenue = revenueByCategory.get(category) || 0;
            revenueByCategory.set(category, currentRevenue + orderRevenue);
        }
        return revenueByCategory;
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
exports.RevenueAnalyticsService = RevenueAnalyticsService;
//# sourceMappingURL=revenueanalytics.server.js.map