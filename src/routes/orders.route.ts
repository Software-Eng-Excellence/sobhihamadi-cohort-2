import { OrderController } from "../controllers/OrderControllers/order.controller";
import { Router } from "express";
import { OrderManagementService } from "../services/OrderManagement/ordermanagement.server";
import { asynchandler } from "../middleware/AsyncHandler";
import { hasPermission } from "../middleware/Authorize";
import { permissions } from "../config/roles";

const orderController=new OrderController(new OrderManagementService());
const route= Router();



export default route;

route.route('/')
    .get (asynchandler(orderController.getAllOrders.bind(orderController)))
    .post(asynchandler(orderController.createOrder.bind(orderController)));

route.route('/:id')
    .get(hasPermission(permissions.read_order),asynchandler(orderController.getOrder.bind(orderController)))
    .put(hasPermission(permissions.update_order),asynchandler(orderController.updateOrder.bind(orderController)))
    .delete(asynchandler(orderController.deleteOrder.bind(orderController)));

