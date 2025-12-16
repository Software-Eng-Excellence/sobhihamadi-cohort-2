"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderVolumeController = void 0;
class OrderVolumeController {
    constructor(ordervolumeService) {
        this.ordervolumeService = ordervolumeService;
    }
    async gettotalOrder(req, res) {
        const Orderslength = await this.ordervolumeService.getTotalOrders();
        res.status(200).json({ Orderslength });
    }
    async getOrderCountsByCategory(req, res) {
        const orderCountsByCategory = await this.ordervolumeService.getOrderCountsByCategory();
        const result = {};
        orderCountsByCategory.forEach((value, key) => {
            result[key] = value;
        });
        res.status(200).json(result);
    }
}
exports.OrderVolumeController = OrderVolumeController;
//# sourceMappingURL=ordervolume.controller.js.map