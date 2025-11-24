import { BadRequestException } from "../util/exceptions/http/BadRequestException";
import { OrderManagementServer } from "./ordermanagement.server";
import { OrderVolumeAnalyticsServer } from "./OrderVolumeAnalytics.server";
import { RevenueAnalyticsServer } from "./revenueanalytics.server";




export class AdvancedAnalyticsServer {
    constructor(private readonly ordervolumeAnalyticsServer1: OrderVolumeAnalyticsServer,
        private readonly RevenueAnalyticsServer1: RevenueAnalyticsServer,
    private readonly ordermanagement1: OrderManagementServer) {}

    

//Average order value
public async getAverageOrderValue(): Promise<number> {
    const orders= await this.ordervolumeAnalyticsServer1.getTotalOrders();
    const totalRevenue= await this.RevenueAnalyticsServer1.getTotalRevenue();
    if(orders===0){
        return 0;
    }
    const averageOrderValue= totalRevenue/orders;
    return Math.round(averageOrderValue * 100) / 100;

}

public async getPriceRangeDistribution(): Promise<{
    priceRanges: Array<{
        range: string;
        count: number;
        percentage: number;
    }>;
}> {
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
        const count = orders.filter(order => 
            order.getPrice() >= range.min && order.getPrice() <= range.max
        )
        .length;
        
        return {
            range: range.range,
            count: count,
            percentage: Math.round((count / totalOrders) * 100 * 100) / 100
        };
    });
    
    return { priceRanges };
}


  private validateAnalyticsOrder(order: any): void {
    const missingItem = !order.getItem();
    const missingCategory = missingItem ? true : !order.getItem().getCategory();
    const invalidPrice = order.getPrice() == null || isNaN(order.getPrice());
    const invalidQuantity =
      order.getQuantity() == null || isNaN(order.getQuantity());

    if (missingItem || missingCategory || invalidPrice || invalidQuantity) {
      const details = {
        MissingItem: missingItem,
        MissingCategory: missingCategory,
        InvalidPrice: invalidPrice,
        InvalidQuantity: invalidQuantity,
        OrderId: order.getid?.(),
      };

      throw new BadRequestException("Invalid order data for analytics", details);
    }
  }
}