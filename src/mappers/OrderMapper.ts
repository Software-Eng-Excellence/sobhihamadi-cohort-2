import { IMapper } from "./IMapper";
import { Order } from "../model/Order.model";
import { OrderBuilder } from "../model/builders/Order.builder";
import { IItem } from "../model/IItem";

export class CSVOrderMapper implements IMapper <string[], Order>{
    constructor(private itemMapper: IMapper<string[], IItem>) {

    }
  
    map(data: string[]): Order {
          const item: IItem = this.itemMapper.map(data);
        return OrderBuilder.NewBuilder()
            .setId(data[0])
            .setItem(item)
          
            .setQuantity(parseInt(data[data.length - 1])) // Assuming the last element is quantity
            .setPrice(parseFloat(data[data.length - 2])) // Assuming the second last element is price
            .build();


    }
    
    }
