import { OrderBuilder } from "./builders/Order.builder";
import { identifierItem, IItem } from "./IItem";
import { IOrder } from "./IOrder";

export class Order implements IOrder {
    private _id: string;
    private _item: IItem;
    private _quantity: number;
    private _price: number;

    constructor(id: string, item: IItem, quantity: number, price: number) {
        this._id = id;
        this._item = item;
        this._quantity = quantity;
        this._price = price;
    }
    getid(): string {
        return this._id;
    }
    getItem(): IItem {
        return this._item;
    }
    getQuantity(): number {
        return this._quantity;
    }
    getPrice(): number {
        return this._price;
    }
  

}

export class IdentifierOrderItem  implements IdentifierOrderItem {
    constructor(private id: string, private IdentifierItem: identifierItem,private quantity: number, private price: number) {
 
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
   
}