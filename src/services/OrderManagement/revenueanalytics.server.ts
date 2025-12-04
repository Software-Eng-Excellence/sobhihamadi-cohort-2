import { ItemCategory } from "../../model/IItem";
import { OrderManagementService } from "./ordermanagement.server";
import { BadRequestException } from "../../util/exceptions/http/BadRequestException";
import { Order } from "model/order.model";
import { identifierOrderItem } from "model/IOrder";




export class RevenueAnalyticsService {
    constructor(private orderManagementServer1: OrderManagementService) {}

    //get total revenue
    public async getTotalRevenue(): Promise<number> {
 
  
      const orders = await this.orderManagementServer1.listOrders();

      const totalRevenue = orders.reduce((sum, order) => {
           this.validateAnalyticsOrder(order);
        return sum + (order.getPrice() * order.getQuantity())}, 0);
      
    
      
      return totalRevenue;
     
    }
    //get revenue breakdown by item type
    public async getRevenueByCategory(): Promise<Map<ItemCategory, number>> {
     
 
        const orders = await this.orderManagementServer1.listOrders();
        
       
        
        const revenueByCategory = new Map<ItemCategory, number>();
        for (const order of orders) {
          this.validateAnalyticsOrder(order);
          const category = order.getItem().getCategory();
          const orderRevenue = order.getPrice() * order.getQuantity();
          const currentRevenue = revenueByCategory.get(category) || 0;
          revenueByCategory.set(category, currentRevenue + orderRevenue);
        }
        return revenueByCategory;
       
    }

   

    private validateAnalyticsOrder(order: identifierOrderItem): void {
  const missingItem = !order.getItem();
  const missingCategory = missingItem ? true : !order.getItem().getCategory();
  const invalidPrice = order.getPrice() == null || isNaN(order.getPrice());
  const invalidQuantity = order.getQuantity() == null || isNaN(order.getQuantity());

  if (missingItem || missingCategory || invalidPrice || invalidQuantity) {
  const details= {
      MissingItem: missingItem,
      MissingCategory: missingCategory,
      InvalidPrice: invalidPrice,
      InvalidQuantity: invalidQuantity,
      OrderId: order?.getid?.(),
    };
    throw new BadRequestException("Invalid order data for analytics", details);

  }
}

}