import { OrderManagement, FinancialCalculator, Validdator } from "./app";
import logger from "./util/logger";

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




const newItem = "Marble";
const newPrice = 22;

OrderManager.addOrder(newItem, newPrice);


logger.info("Orders after adding a new order: %o" , OrderManager.getOrders());

// Calculate Total Revenue directly
logger.info("Total Revenue:" + OrderManager.getrevenue());




// Calculate Average Buy Power directly

logger.info("Average Buy Power:" + OrderManager.getAverageByPower());

// Fetching an order directly
const fetchid = 2;
logger.info("Order with ID 2: %o" , OrderManager.fetchOrderbyid(fetchid));

// Attempt to fetch a non-existent order
const nonExistentId = 10;
const nonExistentOrder = OrderManager.fetchOrderbyid(nonExistentId);
logger.info("Order with ID 10 (non-existent):" + nonExistentOrder);