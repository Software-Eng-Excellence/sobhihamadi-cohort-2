import { ItemCategory } from "model/IItem";
import { OrderManagementServer } from "./ordermanagement.server";



export class OrderVolumeAnalyticsServer {
    constructor(private orderManagementServer1: OrderManagementServer) {}

    public async getTotalOrders(): Promise<number> {
        const orders= await this.orderManagementServer1.listOrders();
        return orders.length;
    }
    //Generate order counts grouped by item category
    public async getOrderCountsByCategory(): Promise<Map<ItemCategory, number>> {
         const orders = await this.orderManagementServer1.listOrders(); 
        const orderCounts = new Map<ItemCategory, number>();
    
        for (const order of orders) {
            const category = order.getItem().getCategory();
            const currentCount = orderCounts.get(category) || 0;
            orderCounts.set(category, currentCount + 1);
        }
        return orderCounts;
        
    }
    
}