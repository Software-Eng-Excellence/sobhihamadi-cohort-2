import { IItem, ItemCategory } from "./IItem";


export class Toy implements IItem {
    
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
        
        type: string,
        ageGroup: string,
        brand: string,
        material: string,
        batteryRequired: boolean,
        educational: boolean,

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

