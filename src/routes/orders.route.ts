import { OrderController } from "../controllers/order.controller";
import { Router } from "express";
import { OrderManagementServer } from "../services/ordermanagement.server";
import { asynchandler } from "../middleware/AsyncHandler";

const orderController=new OrderController(new OrderManagementServer());
const route= Router();



export default route;

route.route('/')
    .get(asynchandler(orderController.getAllOrders.bind(orderController)))
    .post(asynchandler(orderController.createOrder.bind(orderController)));

route.route('/:id')
    .get(asynchandler(orderController.getOrder.bind(orderController)))
    .put(asynchandler(orderController.updateOrder.bind(orderController)))
    .delete(asynchandler(orderController.deleteOrder.bind(orderController)));

