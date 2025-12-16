"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvancedAnalyticsController = void 0;
class AdvancedAnalyticsController {
    constructor(advancedAnalyticsServer) {
        this.advancedAnalyticsServer = advancedAnalyticsServer;
    }
    async getAverageOrderValue(req, res) {
        const AverageOrderValue = await this.advancedAnalyticsServer.getAverageOrderValue();
        res.status(200).json({ AverageOrderValue });
    }
    async getPriceRangeDistribution(req, res) {
        const PriceRangeDistribution = await this.advancedAnalyticsServer.getPriceRangeDistribution();
        res.status(200).json(PriceRangeDistribution);
    }
}
exports.AdvancedAnalyticsController = AdvancedAnalyticsController;
//# sourceMappingURL=advancedanalytics.controller.js.map