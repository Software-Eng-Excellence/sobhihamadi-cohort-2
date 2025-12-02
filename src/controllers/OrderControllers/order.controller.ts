import { NextFunction, Request, Response } from "express";
import { OrderManagementService } from "../../services/OrderManagement/ordermanagement.server";
import { IdentifierOrderItem } from "../../model/order.model";

import { JsonRequestFactory } from "../../mappers";
import logger from "../../util/logger";


import { BadRequestException } from "../../util/exceptions/http/BadRequestException";




export class OrderController {
    constructor(private readonly orderService: OrderManagementService,
    ) {}


    public async createOrder(req: Request, res: Response){
        
            const orderData:IdentifierOrderItem= JsonRequestFactory
            .Create(req.body.category).map(req.body);
            
            if(!orderData){
                throw new BadRequestException("Order data is required",{OrderNotFound: true});
            }
            const order= await this.orderService.createOrder(orderData);
            res.status(201).json(order);
        }
      


    public async getOrder(req: Request, res: Response){
       
        const orderId=req.params.id;
        if(!orderId){
            throw new BadRequestException("Order ID is required",{OrderIdMissing:true});
            }
        const order= await this.orderService.getOrderById(orderId);
        res.status(200).json(order);
        
      
    }


    //get all orders
    public async getAllOrders(req: Request, res: Response){
        
            const orders= await this.orderService.listOrders();
            res.status(200).json(orders);
        }
       
    


//update order
 public async updateOrder(req: Request, res: Response){

 
            const id=req.params.id;
            if(!id){
                throw new BadRequestException("Order ID is required",{OrderIdMissing:true});
            }
            const orderData:IdentifierOrderItem= JsonRequestFactory
            .Create(req.body.category).map(req.body);
            
            if(!orderData){
                logger.error("Order data is missing in the request body");
                throw new BadRequestException("Order data is required",{OrderNotFound: true});
            }
            if(orderData.getid()!==id){
                throw new BadRequestException("id in body is different from id in param",{
                    IdMismatch:true,
                    IdInBody: orderData.getid(),
                    IdInParam: id
                
                });
            }
            await this.orderService.updateOrder(orderData);
            res.status(200).json({message:"Order updated successfully"});
       

    
    }
//delete order
    public async deleteOrder(req: Request, res: Response){
    
            const orderId=req.params.id;
            if(!orderId){
                throw new BadRequestException("Order ID is required",{OrderIdMissing:true});
            }
            await this.orderService.deleteOrder(orderId);
            res.status(200).json({message:"Order deleted successfully"});
       

}
}