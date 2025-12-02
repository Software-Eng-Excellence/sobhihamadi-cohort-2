import { RevenueController } from "../controllers/OrderControllers/revenue.controller";
import { Router } from "express";
import { asynchandler } from "../middleware/AsyncHandler";
import { OrderManagementService } from "../services/OrderManagement/ordermanagement.server";
import { RevenueAnalyticsService } from "../services/OrderManagement/revenueanalytics.server";
import { OrderVolumeController } from "../controllers/OrderControllers/ordervolume.controller";
import { OrderVolumeAnalyticsService } from "../services/OrderManagement/OrderVolumeAnalytics.server";
import { AdvancedAnalyticsController } from "../controllers/OrderControllers/advancedanalytics.controller";
import { AdvancedAnalyticsService } from "../services/OrderManagement/advancedanalytics.server";

const orderManagementServer = new OrderManagementService();

const orderVolumeAnalyticsServer = new OrderVolumeAnalyticsService(orderManagementServer);
const revenueAnalyticsServer = new RevenueAnalyticsService(orderManagementServer);
const advancedanalyticsServer = new AdvancedAnalyticsService(
   orderVolumeAnalyticsServer, revenueAnalyticsServer, orderManagementServer);


const revenueController=new RevenueController(revenueAnalyticsServer);
const ordervolumeController=new OrderVolumeController(orderVolumeAnalyticsServer);
const advancedanalyticsController=new AdvancedAnalyticsController(advancedanalyticsServer);

const route= Router();



export default route;

route.get('/total-revenue', asynchandler(revenueController.getTotalRevenue.bind(revenueController)));
route.get('/revenue-by-category', asynchandler(revenueController.getRevenueByCategory.bind(revenueController)));
route.get('/total-orders', asynchandler(ordervolumeController.gettotalOrder.bind(ordervolumeController)));
route.get('/orders-by-category', asynchandler(ordervolumeController.getOrderCountsByCategory.bind(ordervolumeController)));
route.get('/average-order-value', asynchandler(advancedanalyticsController.getAverageOrderValue.bind(advancedanalyticsController)));
route.get('/price-range-distribution', asynchandler(advancedanalyticsController.getPriceRangeDistribution.bind(advancedanalyticsController)));