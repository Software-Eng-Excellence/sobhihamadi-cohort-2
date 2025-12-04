import { IdentifierOrderItem, Order } from "../order.model";
import { identifierItem, IItem } from "../IItem";


  


export class OrderBuilder {

    private _id!: string;
    private _item!: IItem;
    private _quantity!: number;
    private _price!: number; 


    public static NewBuilder(): OrderBuilder {
        return new OrderBuilder();
    }
       
    setId(id: string): OrderBuilder {
        this._id = id;
        return this;
    }   
    setItem(item: IItem): OrderBuilder {
        this._item = item;
        return this;
    }
    setQuantity(quantity: number): OrderBuilder {
        this._quantity = quantity;
        return this;
    }
    setPrice(price: number): OrderBuilder {
        this._price = price;
        return this;
    }
    build(): Order {
        if (!this._id || !this._item || this._quantity <= 0 || this._price < 0) {
            throw new Error("Invalid order parameters");
        }   
        return new Order(this._id, this._item, this._quantity, this._price);
    }
}
export class identifierOrderItemBuilder {
    private order!: Order; 
    private _item!: identifierItem;


    public static NewBuilder(): identifierOrderItemBuilder {
        return new identifierOrderItemBuilder();
    }

    setItem(item: identifierItem): identifierOrderItemBuilder {
        this._item = item;
        return this;
    }
    setOrder(order: Order): identifierOrderItemBuilder {
        this.order = order;
        return this;
    }
    
    
    build(): IdentifierOrderItem {
        if (!this.order || !this._item) {
            throw new Error("Invalid order parameters");
        }
         return new IdentifierOrderItem(
            this.order.getid(),
            this._item.getCategory(),
            
        
            
            this._item,
             this.order.getQuantity(),
            this.order.getPrice()

        );
    }
}