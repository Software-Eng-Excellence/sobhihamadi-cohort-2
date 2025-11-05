import { IdentifierOrderItem, Order } from "../model/order.model";
import { ServerException } from "../util/exceptions/serverexception";
import { RepositoryFactory } from "../repository/Repository.factory";
import config from "../config";
import { ItemCategory } from "../model/IItem";
import { identifierOrderItem } from "../model/IOrder";
import { IRepository } from "../repository/IRepository";


export class OrderManagementServer {

//create order 
public async  createOrder(order:IdentifierOrderItem): Promise<IdentifierOrderItem> {
    //validation and creation logic
    this.validateOrder(order);
    //genrate unique id for order
    
    // Implementation of order management server logic goes here
    const repo=await this.getrepo(order.getItem().getCategory())
    repo.create(order)
    return order;
}
//get order
public async getOrderById(orderId: string): Promise<identifierOrderItem> {
    const categories=Object.values(ItemCategory);
    for(const category of categories){
        const repo=await this.getrepo(category)
        const order= await repo.get(orderId);
        if(order){
            return order;
        }

}
 throw new ServerException(`Order with id ${orderId} not found`);



}
//update order
public async updateOrder(order:identifierOrderItem ): Promise<void> {

    this.validateOrder(order);
    const repo=await this.getrepo(order.getItem().getCategory())
    repo.update(order);
}

//delete order
public async deleteOrder(orderId: string): Promise<void> {
    const categories=Object.values(ItemCategory);
    for(const category of categories){
        const repo=await this.getrepo(category)
        const order= await repo.get(orderId);
        if(order){
            await repo.delete(orderId);
            return;
        }

}
 throw new ServerException(`Order with id ${orderId} not found`);
    }


    //list orders
public async listOrders(): Promise<identifierOrderItem[]> {
    const allorders: identifierOrderItem[] = [];
    const categories=Object.values(ItemCategory);
    for(const category of categories){
        const repo=await this.getrepo(category);
        const orders= await repo.getall();
        allorders.push(...orders);
    }
    return allorders;
}

//get total orders




private getrepo(category:ItemCategory): Promise< IRepository<identifierOrderItem>> 
{
    return RepositoryFactory.create(config.DBMode,category);



}
private validateOrder(order:identifierOrderItem): void {
    if(!order.getItem() || order.getPrice() <= 0 || order.getQuantity() <= 0) {
        throw new ServerException("Invalid order:item, price, and quantity are required");
    }
}




}


