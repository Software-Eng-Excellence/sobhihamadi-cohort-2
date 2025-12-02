import { Request, Response } from "express";
import { RevenueAnalyticsService } from "../../services/OrderManagement/revenueanalytics.server";




export class RevenueController {

    public constructor(private revenueAnalyticsServer: RevenueAnalyticsService) {}

    public async getTotalRevenue(req: Request, res: Response) {

   
            
        const totalRevenue = await this.revenueAnalyticsServer.getTotalRevenue();
            
       
        res.status(200).json({ totalRevenue });

    }

    public async getRevenueByCategory(req: Request, res: Response) {

        



        const revenueByCategory = await this.revenueAnalyticsServer.getRevenueByCategory();
        const result: { [key: string]: number } = {};
        revenueByCategory.forEach((value, key) => {
            result[key] = value;
        });
        res.status(200).json(result);
    }

}