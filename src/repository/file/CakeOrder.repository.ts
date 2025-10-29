import { CSVOrderMapper } from "../../mappers/OrderMapper";
import { OrderRepository } from "./order.repository";
import { IOrder } from "../../model/IOrder";
import { CSVCakeMapper } from "../../mappers/CakeMapper";
import { readCSV, writeCSV } from "../../util/parsers/csvparser";
import { DbException } from "../../util/exceptions/repositoryExceptions";


export class cakeOrderRepository extends OrderRepository {
   

 private mapper= new CSVOrderMapper(new CSVCakeMapper());
   constructor(private readonly filepath: string) {
      super();
   }

   protected async load(): Promise<IOrder[]> {

    try {
        // read 2d the csv file
        const csv=await readCSV(this.filepath);
        //return the list of objects
        return csv.map(this.mapper.map.bind(this.mapper));
        
    } catch (error: unknown) {
        throw new DbException("Failed to load data from CSV file.", error as Error);

        
    }


        
        
        
       
    }
   protected async save(orders: IOrder[]): Promise<void> {

    try {
          const Header = [
            "Type","Flavor","Filling","Size","Layers","FrostingType","FrostingFlavor","DecorationType","DecorationColor",
            "CustomMessage","Shape","Allergies","SpecialIngredients","PackagingType","Price","Quantity"
        ];
       //convert orders to 2d string
        const rawItems = orders.map(this.mapper.reverseMap.bind(this.mapper));
        await writeCSV(this.filepath, [Header, ...rawItems]);
        
    }
        // generate the list of headers
      

 catch (error: unknown) {
        throw new DbException("Failed to load data from CSV file.", error as Error);

        
    }


    }


}