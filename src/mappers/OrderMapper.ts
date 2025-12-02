import { IMapper } from "./IMapper";
import { IdentifierOrderItem, Order } from "../model/order.model";
import { identifierOrderItemBuilder, OrderBuilder } from "../model/builders/Order.builder";
import { identifierItem, IItem } from "../model/IItem";
import { IOrder } from "model/IOrder";

export class CSVOrderMapper implements IMapper <string[], IOrder>{
    constructor(private itemMapper: IMapper<string[], IItem>) {

    }
  
    map(data: string[]): IOrder {
          const item: IItem = this.itemMapper.map(data);
        return OrderBuilder.NewBuilder()
            .setId(data[0])
            .setItem(item)
          
            .setQuantity(parseInt(data[data.length - 1])) // Assuming the last element is quantity
            .setPrice(parseFloat(data[data.length - 2])) // Assuming the second last element is price
            .build();


    }
    reverseMap(data: IOrder): string[] {
        const itemData = this.itemMapper.reverseMap(data.getItem());
        return [
            data.getid(),
            ...itemData,
            data.getPrice().toString(),
            data.getQuantity().toString()
        ];

    }}


export interface ISQLITEOrderData {
    id: string;
    item: string;
    quantity: number;
    item_Category: string;
    price: number;
}

export class SQLITEOrderMapper implements IMapper<{data: ISQLITEOrderData, item: identifierItem}, IdentifierOrderItem> {
    map({data, item}: {data: ISQLITEOrderData, item: identifierItem}): IdentifierOrderItem {
      const order = OrderBuilder.NewBuilder()
        .setId(data.id)
        .setItem(item)
  
        .setPrice(data.price)
        .setQuantity(data.quantity)
        .build();
        return identifierOrderItemBuilder.NewBuilder()
        .setOrder(order)
        .setItem(item)
        .build();
    }

    reverseMap(item: IdentifierOrderItem): {data: ISQLITEOrderData, item: identifierItem} {
        return {
            data: {
                id: item.getid(),
                item: item.getItem().getid(),
                quantity: item.getQuantity(),
                item_Category: item.getItem().getCategory(),
                price: item.getPrice()
            },
            item: item.getItem() as identifierItem
        };
    }
}
  
interface IJsonItem {
    id: string;
}
interface IJsonOrder {
    id: string;
    item: IJsonItem;
    quantity: number;
    price: number;
}

export class JsonRequestOrderMapper implements IMapper<any, IdentifierOrderItem> {
    constructor(private itemMapper: IMapper<any, identifierItem>) {

    }

    map(data: any): IdentifierOrderItem {
        //extract item and build identifierItem
        const item= this.itemMapper.map(data.IdentifierItem);

        //extract order and build identifierOrder
        const order = OrderBuilder.NewBuilder()
            .setId(data.id)
            .setItem(item)
            .setQuantity(data.quantity)
            .setPrice(data.price)
            .build();
        return identifierOrderItemBuilder.NewBuilder()
            .setOrder(order)
            .setItem(item)
            .build();
    }
    reverseMap(data: IdentifierOrderItem): any {
        return {
            
             ...data
        };
    }




    
}