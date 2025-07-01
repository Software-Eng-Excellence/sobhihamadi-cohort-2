import { Item, ItemCategory } from "./Item.model";


export class Toy implements Item {
    
    getCategory(): ItemCategory {
        return ItemCategory.Toy;
    }
   
    private  type: string;
    private  ageGroup: string;
    private  brand: string;
    private  material: string;
    private  batteryRequired: boolean;
    private  educational: boolean;



    constructor(
        orderID: number,
        type: string,
        ageGroup: string,
        brand: string,
        material: string,
        batteryRequired: boolean,
        educational: boolean,
        price: number,
        quantity: number
    ) {
   
        this.type = type;
        this.ageGroup = ageGroup;
        this.brand = brand;
        this.material = material;
        this.batteryRequired = batteryRequired;
        this.educational = educational;
 
     
    }
 

   

    get Type(): string {
        return this.type;
    }

    get AgeGroup(): string {
        return this.ageGroup;
    }

    get Brand(): string {
        return this.brand;
    }

    get Material(): string {
        return this.material;
    }

    get BatteryRequired(): boolean {
        return this.batteryRequired;
    }

    get Educational(): boolean {
        return this.educational;
    }

   

   
}

