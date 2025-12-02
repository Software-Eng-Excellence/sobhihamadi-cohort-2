import { Request, Response } from "express";
import { AdvancedAnalyticsService } from "../../services/OrderManagement/advancedanalytics.server";



export class AdvancedAnalyticsController {
    constructor(private advancedAnalyticsServer: AdvancedAnalyticsService) {}

   public  async getAverageOrderValue(req:Request,res:Response) {
         const AverageOrderValue=await this.advancedAnalyticsServer.getAverageOrderValue();
        res.status(200).json({AverageOrderValue});
        
    }

   public async getPriceRangeDistribution(req:Request,res:Response)  {
        const  PriceRangeDistribution =await this.advancedAnalyticsServer.getPriceRangeDistribution();
   
        res.status(200).json( PriceRangeDistribution);
         
      
    }

}