"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_controller_1 = require("../controllers/OrderControllers/order.controller");
const express_1 = require("express");
const ordermanagement_server_1 = require("../services/OrderManagement/ordermanagement.server");
const AsyncHandler_1 = require("../middleware/AsyncHandler");
const Authorize_1 = require("../middleware/Authorize");
const roles_1 = require("../config/roles");
const orderController = new order_controller_1.OrderController(new ordermanagement_server_1.OrderManagementService());
const route = (0, express_1.Router)();
exports.default = route;
route.route('/')
    .get((0, AsyncHandler_1.asynchandler)(orderController.getAllOrders.bind(orderController)))
    .post((0, AsyncHandler_1.asynchandler)(orderController.createOrder.bind(orderController)));
route.route('/:id')
    .get((0, Authorize_1.hasPermission)(roles_1.permissions.read_order), (0, AsyncHandler_1.asynchandler)(orderController.getOrder.bind(orderController)))
    .put((0, Authorize_1.hasPermission)(roles_1.permissions.update_order), (0, AsyncHandler_1.asynchandler)(orderController.updateOrder.bind(orderController)))
    .delete((0, AsyncHandler_1.asynchandler)(orderController.deleteOrder.bind(orderController)));
//# sourceMappingURL=orders.route.js.map