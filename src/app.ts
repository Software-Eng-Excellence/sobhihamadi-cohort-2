//SOLID PRINCIPLES

//S - Single Responsibility Principle (SRP)
//O - open closed principle (OCP):
//L - Liskov Substitution Principle (LSP)
//I - Interface Segregation Principle (ISP)
//D - Dependency Inversion Principle (DIP)


export interface Order {
    id: number;
    item: string;
    price: number;
}

export class OrderManagement { 
    constructor(private validator: Ivalidator,private calculator: Icalculator) {
       
    }

    //get orders, add orders
    private orders: Order[] = [];
    
    getOrders() {
        return this.orders;
    }
    addOrder(item: string, price:number) {
        const order: Order = {
            id: this.orders.length + 1,item, price};
        // Validate the order before adding
        this.validator.validate(order);
        this.orders.push(order);

      
}

fetchOrderbyid(id:number){
    return this.getOrders().find(order => order.id === id) 

}
getrevenue() {
    return this.calculator.getrevenue(this.orders);
}   
getAverageByPower() {
    return this.calculator.getAverageByPower(this.orders);  
}
}
 export class PremuimOrderManagement extends OrderManagement {
    // Additional functionality for premium orders can be added here
    addOrder(item: string, price: number) {
        // You can add additional validation or functionality for premium orders here
        price*10/100;
        super.addOrder(item, price);
    }   }
interface Ivalidator{
    validate(order: Order): void;
}
interface possibleItems {
    getpossibleItems(): string[];

}

export class Validdator implements Ivalidator {
    private  Rules: Ivalidator[] = [
        new ItemValidator(),
        new PriceValidator(),
        new MaxPriceValidator()
    ];
validate(order: Order): void {
    for (const rule of this.Rules) {
        rule.validate(order);
    }
}
  
}

    export class ItemValidator implements Ivalidator, possibleItems {
        //validate item
         private static possibleItems = [
        "Sponge",
        "Chocolate",
        "Fruit",
        "Red Velvet",
        "Birthday",
        "Carrot",
        "Marble",
        "Coffee"
    ];
        getpossibleItems(): string[] {
            return ItemValidator.possibleItems;
        }
             validate(order: Order): void {
            if (!ItemValidator.possibleItems.includes(order.item)) {
                throw new Error(`Invalid item. Must be one of: ${ItemValidator.possibleItems.join(", ")}`);
            }

         }
        }

        export class PriceValidator implements Ivalidator {
            validate(order: Order): void {
                if (order.price <= 0) {
                    throw new Error("Price must be greater than zero");
                }
            }
        }
        export class MaxPriceValidator implements Ivalidator {
          

            validate(order: Order): void {
                if (order.price > 100) {
                    throw new Error(`Price must be less than 100 `);
                }
            }
        }
interface Icalculator {
    getrevenue(orders: Order[]): number;
    getAverageByPower(orders: Order[]): number;
}

export class FinancialCalculator implements Icalculator {


    //calculate total revenue,
    //calculate average buy power
     public getrevenue(orders: Order[]) {
        return orders.reduce((total, order) => total + order.price, 0);
    }   
    //  average buy power
    public  getAverageByPower(orders: Order[]){
        return orders.length === 0 ? 0 : this.getrevenue(orders) / orders.length;
    }
}

//Main application logic
