import { Request, Response } from "express";
import { OrderVolumeAnalyticsService } from "../../services/OrderManagement/OrderVolumeAnalytics.server";




export class OrderVolumeController {
    constructor(private readonly ordervolumeService:OrderVolumeAnalyticsService) {}

    public async gettotalOrder(req:Request, res:Response){
        const Orderslength= await this.ordervolumeService.getTotalOrders();
        res.status(200).json({Orderslength});
    }

    public async getOrderCountsByCategory(req:Request, res:Response){
        const orderCountsByCategory= await this.ordervolumeService.getOrderCountsByCategory();
        const result: { [key: string]: number } = {};
        orderCountsByCategory.forEach((value, key) => {
            result[key] = value;
        }
        );
        res.status(200).json(result);
    }

}