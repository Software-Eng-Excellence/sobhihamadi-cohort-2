import { OrderManagement, FinancialCalculator, PremuimOrderManagement, Validdator } from "app";

const orders = [
  { id: 1, item: "Sponge", price: 15 },
  { id: 2, item: "Chocolate", price: 20 },
  { id: 3, item: "Fruit", price: 18 },
  { id: 4, item: "Red Velvet", price: 25 },
  { id: 5, item: "Coffee", price: 8 },
];
const OrderManager=new OrderManagement(new Validdator(), new FinancialCalculator());
for(const order of orders) {
    OrderManager.addOrder(order.item, order.price);
}



// Adding a new order directly
const newItem = "Marble";
const newPrice = 22;

OrderManager.addOrder(newItem, newPrice);


console.log("Orders after adding a new order:", OrderManager.getOrders());

// Calculate Total Revenue directly
console.log("Total Revenue:", OrderManager.getrevenue());




// Calculate Average Buy Power directly

console.log("Average Buy Power:", OrderManager.getAverageByPower());

// Fetching an order directly
const fetchid = 2;
console.log("Order with ID 2:", OrderManager.fetchOrderbyid(fetchid));

// Attempt to fetch a non-existent order
const nonExistentId = 10;
const nonExistentOrder = OrderManager.fetchOrderbyid(nonExistentId);
console.log("Order with ID 10 (non-existent):", nonExistentOrder);