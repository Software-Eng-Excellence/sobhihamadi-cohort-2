"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevenueController = void 0;
class RevenueController {
    constructor(revenueAnalyticsServer) {
        this.revenueAnalyticsServer = revenueAnalyticsServer;
    }
    async getTotalRevenue(req, res) {
        const totalRevenue = await this.revenueAnalyticsServer.getTotalRevenue();
        res.status(200).json({ totalRevenue });
    }
    async getRevenueByCategory(req, res) {
        const revenueByCategory = await this.revenueAnalyticsServer.getRevenueByCategory();
        const result = {};
        revenueByCategory.forEach((value, key) => {
            result[key] = value;
        });
        res.status(200).json(result);
    }
}
exports.RevenueController = RevenueController;
//# sourceMappingURL=revenue.controller.js.map