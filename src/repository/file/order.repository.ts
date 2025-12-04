import { InvalidItemException, ItemNotFoundException } from "../../util/exceptions/repositoryExceptions";

import { IRepository } from "repository/IRepository";
import logger from "../../util/logger";
import { IOrder } from "model/IOrder";
import { User } from "model/user.model";


export abstract class OrderRepository implements IRepository<IOrder> {
    getbyemail(): Promise<User> {
        throw new Error("Method not implemented.");
    }
    init(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    mapRowToUser(): User {
        throw new Error("Method not implemented.");
    }

    protected abstract load(): Promise<IOrder[]>;

    protected abstract save(IOrders: IOrder[]): Promise<void> ;


    async create(item: IOrder): Promise<string> {
        if (!item) {
            logger.error("failed to create an IOrder: " + item);
            throw new InvalidItemException("Invalid item");
        }
        const IOrders = await this.load();
        const id= IOrders.push(item);
        await this.save(IOrders);
        logger.info("IOrder created with id: " +id );
        return String(id);
    }
    async get(id: string): Promise<IOrder> {
        const IOrders = await this.load();
        const findIOrder = IOrders.find(IOrder => IOrder.getid() === id);
        if (!findIOrder) {
            logger.error("failed to fint an IOrder with id: " + id);
            throw new ItemNotFoundException("Failed to find the element");
        }
        logger.info("IOrder found with id: " + id);
        return findIOrder;
    } 
    async getall(): Promise<IOrder[]> {
        logger.info("all IOrders retrieved");
        return this.load();
    }
    async update(item: IOrder): Promise<void> {
        if (!item) {
            logger.error("failed to update an IOrder: " + item);
            throw new InvalidItemException("Invalid item");
        }
        const IOrders = await this.load();
        const index = IOrders.findIndex(IOrder => IOrder.getid() === item.getid());
        if (index === -1) {
            logger.error("failed to update an IOrder with id: " + item.getid());
            throw new ItemNotFoundException("Item not found");
        }
        IOrders[index] = item;
        await this.save(IOrders);
        logger.info("IOrder updated with id: " + item.getid());

    }
    async delete(id: string): Promise<void> {

        const IOrders = await this.load();
        const index =IOrders.findIndex(IOrder => IOrder.getid() === id);
        if (index === -1) {
            logger.error("failed to delete an IOrder with id: " + id);
            throw new ItemNotFoundException("Item not found");
        }
        IOrders.splice(index, 1);
        await this.save(IOrders);
        logger.info("IOrder deleted with id: " + id);
    }
    
}