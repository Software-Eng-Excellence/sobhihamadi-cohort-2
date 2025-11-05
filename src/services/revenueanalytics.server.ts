import { ItemCategory } from "model/IItem";
import { OrderManagementServer } from "./ordermanagement.server";



export class RevenueAnalyticsServer {
    constructor(private orderManagementServer1: OrderManagementServer) {}

    //get total revenue
    public async getTotalRevenue(): Promise<number> {
      const orders= await this.orderManagementServer1.listOrders();
      const totalRevenue = orders.map(order=> order.getPrice() * order.getQuantity());
      let total=0;
      for(const revenue of totalRevenue){
        total += revenue;
      }
        return total;
    }
    //get revenue breakdown by item type
    public async getRevenueByCategory(): Promise<Map<ItemCategory, number>> {
        const orders = await this.orderManagementServer1.listOrders(); 
        const revenueByCategory = new Map<ItemCategory, number>();
        for (const order of orders) {
            const category = order.getItem().getCategory();
            const orderRevenue = order.getPrice() * order.getQuantity();
            const currentRevenue = revenueByCategory.get(category) || 0;
            revenueByCategory.set(category, currentRevenue + orderRevenue);
        }
        return revenueByCategory;
    }
}