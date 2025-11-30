import { IItem } from "./IItem";
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
    getId(): string {
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
