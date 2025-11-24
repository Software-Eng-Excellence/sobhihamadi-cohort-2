import { IdentifierOrderItem, Order } from "../model/order.model";
import { ServerException } from "../util/exceptions/serverexception";
import { RepositoryFactory } from "../repository/Repository.factory";
import config from "../config";
import { ItemCategory } from "../model/IItem";
import { identifierOrderItem } from "../model/IOrder";
import { IRepository } from "../repository/IRepository";
import { NotFoundException } from "../util/exceptions/http/NotFoundException";
import { BadRequestException } from "../util/exceptions/http/BadRequestException";


export class OrderManagementServer {

//create order 
public async  createOrder(order:IdentifierOrderItem): Promise<IdentifierOrderItem> {

           //validation and creation logic
    this.validateOrder(order);
  
   
    
    // Implementation of order management server logic goes here
    const repo=await this.getrepo(order.getItem().getCategory())
    await repo.create(order)
    return order;
        
    
}
//get order
public async getOrderById(orderId: string): Promise<identifierOrderItem> {
    const categories=Object.values(ItemCategory);
    for(const category of categories){
   
        const repo=await this.getrepo(category)
        const order= await repo.get(orderId);
   
            return order;
        
            
      

}
 throw new NotFoundException(`Order with id ${orderId} not found`);



}
//update order
public async updateOrder(order:identifierOrderItem ): Promise<void> {

    this.validateOrder(order);
    const repo=await this.getrepo(order.getItem().getCategory())

    const existing = await repo.get(order.getid());
    if (!existing) {
      throw new NotFoundException(`Order with id ${order.getid()} not found`);
    }
    await repo.update(order);
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
 throw new NotFoundException(`Order with id ${orderId} not found`);
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
        const Details={
            ItemNotDefined: !order.getItem(),
            PriceNegative: order.getPrice() <= 0,
            QuantityNegative: order.getQuantity() <= 0
        }
        throw new BadRequestException("Invalid order:item, price, and quantity are required", Details);
    }
}




}


