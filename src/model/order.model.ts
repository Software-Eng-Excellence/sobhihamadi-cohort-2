
import { identifierItem, IItem, ItemCategory } from "./IItem";
import { IOrder } from "./IOrder";

export class Order implements IOrder {
    private id: string;
    private item: IItem;
    private quantity: number;
    private price: number;

    constructor(id: string, item: IItem, quantity: number, price: number) {
        this.id = id;
        this.item = item;
        this.quantity = quantity;
        this.price = price;
    }
    getid(): string {
        return this.id;
    }
    getItem(): IItem {
        return this.item;
    }
    getQuantity(): number {
        return this.quantity;
    }
    getPrice(): number {
        return this.price;
    }
  

}

export class IdentifierOrderItem  implements IdentifierOrderItem {
    
    constructor(private id: string,  private category: ItemCategory, private IdentifierItem: identifierItem,private quantity: number, private price: number) {
 
    }
    getid(): string {
        return this.id;
    }
    getQuantity(): number {
        return this.quantity;
    }


    getItem(): identifierItem {
        return this.IdentifierItem;

    }

    getPrice(): number {
        return this.price;
    }
    getCategory(): ItemCategory {
        return this.category;
    }

    
   
}