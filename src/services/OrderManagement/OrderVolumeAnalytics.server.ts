import { ItemCategory } from "../../model/IItem";
import { OrderManagementService } from "./ordermanagement.server";
import { BadRequestException } from "../../util/exceptions/http/BadRequestException";
import { identifierOrderItem } from "model/IOrder";



export class OrderVolumeAnalyticsService {
    constructor(private orderManagementServer1: OrderManagementService) {}

    public async getTotalOrders(): Promise<number> {
        const orders= await this.orderManagementServer1.listOrders();

         for (const order of orders) {
      this.validateAnalyticsOrder(order);
    }
        return orders.length;
        
    }
    //Generate order counts grouped by item category
    public async getOrderCountsByCategory(): Promise<Map<ItemCategory, number>> {
         const orders = await this.orderManagementServer1.listOrders(); 
        const orderCounts = new Map<ItemCategory, number>();
    
        for (const order of orders) {
            this.validateAnalyticsOrder(order);
            const category = order.getItem().getCategory();
            const currentCount = orderCounts.get(category) || 0;
            orderCounts.set(category, currentCount + 1);
        }
        return orderCounts;
        
    }

     private validateAnalyticsOrder(order: identifierOrderItem): void {

    const missingItem = !order.getItem();
    const missingCategory = missingItem ? true : !order.getItem().getCategory();
    const invalidPrice = order.getPrice() == null || isNaN(order.getPrice());
    const invalidQuantity =
      order.getQuantity() == null || isNaN(order.getQuantity());

   
    

    if (  missingItem || missingCategory || invalidPrice || invalidQuantity) {
      const details = {
        MissingItem: missingItem,
        MissingCategory: missingCategory,
        InvalidPrice: invalidPrice,
        InvalidQuantity: invalidQuantity,
        OrderId: order?.getid?.(),
      };

      throw new BadRequestException(
        "Invalid order data for analytics",
        details
      );
    }
}
    
}