import {FinancialCalculator, Order, OrderManagement, Validdator } from "../src/app";

describe("OrderManagement", () => {
    //Before all, new validator and new calculator
    //Before each test, new order manager
    let validator: Validdator;
    let calculator: FinancialCalculator;
    let orderManager: OrderManagement;
    let basevalidator : (order: Order) => void;
    
    beforeAll(() => {
         validator = new Validdator();
         calculator = new FinancialCalculator();
    });
    beforeEach(() => {
        basevalidator = validator.validate;
        validator.validate = jest.fn();

         orderManager = new OrderManagement(validator, calculator);
    }
    );
    afterAll(() => {
        // Cleanup if necessary
        validator.validate = basevalidator; // Restore original validate method
});
    it("should add an order", () => {
        //Arrange
      
        const item="Sponge";
        const price = 15;
        //Act
        orderManager.addOrder(item, price);
        //Assert
        expect(orderManager.getOrders()).toEqual([{id: 1, item, price}]);
    }
    );
      it("should get a specific order", () => {
        //Arrange
        
        const item="Sponge";
        const price = 15;
        //Add an order first
        orderManager.addOrder(item, price);
        //Act
       const order= orderManager.fetchOrderbyid(1);
        //Assert
        expect(order).toEqual({id: 1, item, price});

        

    }
    );
    it("should get all orders", () => {
        //Arrange
     
        orderManager.addOrder("Sponge", 15);
        orderManager.addOrder("Chocolate", 20);
        
        //Act
        const orders = orderManager.getOrders();
        
        //Assert
        expect(orders).toEqual([
            { id: 1, item: "Sponge", price: 15 },
            { id: 2, item: "Chocolate", price: 20 }
        ]);
    });

it("should call finance calculator getrevenue", () => {
    //Arrange
     const item="Sponge";
        const price = 15;
        orderManager.addOrder(item, price);
        const spy= jest.spyOn(calculator, 'getrevenue');
        
    //Act
    orderManager.getrevenue();
    //Assert
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith([{id:1, item, price}]);
    expect(spy).toHaveReturnedWith(15);
});
it("should throw addiction error if validator does not pass", () => {
    //Arrange
    const item = "Sponge";
    const price = 15;
    //Mock the validator to throw an error
    validator.validate = jest.fn().mockImplementation(() => {
        throw new Error("Validation failed");
    });
    //Act & Assert
    expect(() => {
        orderManager.addOrder(item, price);
    }).toThrow("Validation failed");
   
});
});
    describe("financial calculations", () => {
    it("should calculate financial calculator", () => {
        //Arrange
       
       const calc= new FinancialCalculator();
       const orders = [
            { id: 1, item: "Sponge", price: 15 },
            { id: 2, item: "Chocolate", price: 20 },
            { id: 3, item: "Fruit", price: 18 }
        ];
        
        //Act
        const revenue = calc.getrevenue(orders);
        const averageBuyPower = calc.getAverageByPower(orders);
        
        //Assert
        expect(revenue).toBe(53); // 15 + 20
        expect(averageBuyPower).toBe(17.666666666666668); // (15 + 20) / 2
    });


});


