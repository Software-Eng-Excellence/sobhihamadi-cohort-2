"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvancedAnalyticsService = void 0;
const BadRequestException_1 = require("../../util/exceptions/http/BadRequestException");
class AdvancedAnalyticsService {
    constructor(ordervolumeAnalyticsServer1, RevenueAnalyticsServer1, ordermanagement1) {
        this.ordervolumeAnalyticsServer1 = ordervolumeAnalyticsServer1;
        this.RevenueAnalyticsServer1 = RevenueAnalyticsServer1;
        this.ordermanagement1 = ordermanagement1;
    }
    //Average order value
    async getAverageOrderValue() {
        const [orders, totalRevenue] = await Promise.all([
            this.ordervolumeAnalyticsServer1.getTotalOrders(),
            await this.RevenueAnalyticsServer1.getTotalRevenue(),
        ]);
        if (orders === 0) {
            return 0;
        }
        const averageOrderValue = totalRevenue / orders;
        return Math.round(averageOrderValue * 100) / 100;
    }
    async getPriceRangeDistribution() {
        const orders = await this.ordermanagement1.listOrders();
        const totalOrders = orders.length;
        if (totalOrders === 0) {
            return { priceRanges: [] };
        }
        for (const order of orders) {
            this.validateAnalyticsOrder(order);
        }
        // Define price ranges
        const ranges = [
            { range: "$0-50", min: 0, max: 50 },
            { range: "$51-100", min: 51, max: 100 },
            { range: "$101-200", min: 101, max: 200 },
            { range: "$201+", min: 201, max: Infinity }
        ];
        const priceRanges = ranges.map(range => {
            const count = orders.filter(order => order.getPrice() >= range.min && order.getPrice() <= range.max)
                .length;
            return {
                range: range.range,
                count: count,
                percentage: Math.round((count / totalOrders) * 100 * 100) / 100
            };
        });
        return { priceRanges };
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
                OrderId: order.getid?.(),
            };
            throw new BadRequestException_1.BadRequestException("Invalid order data for analytics", details);
        }
    }
}
exports.AdvancedAnalyticsService = AdvancedAnalyticsService;
//# sourceMappingURL=advancedanalytics.server.js.map