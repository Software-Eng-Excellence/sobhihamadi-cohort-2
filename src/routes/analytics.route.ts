import { RevenueController } from "../controllers/revenue.controller";
import { Router } from "express";
import { asynchandler } from "../middleware/AsyncHandler";
import { OrderManagementServer } from "../services/ordermanagement.server";
import { RevenueAnalyticsServer } from "../services/revenueanalytics.server";
import { OrderVolumeController } from "../controllers/ordervolume.controller";
import { OrderVolumeAnalyticsServer } from "../services/OrderVolumeAnalytics.server";
import { AdvancedAnalyticsController } from "../controllers/advancedanalytics.controller";
import { AdvancedAnalyticsServer } from "../services/advancedanalytics.server";

const orderManagementServer = new OrderManagementServer();

const orderVolumeAnalyticsServer = new OrderVolumeAnalyticsServer(orderManagementServer);
const revenueAnalyticsServer = new RevenueAnalyticsServer(orderManagementServer);
const advancedanalyticsServer = new AdvancedAnalyticsServer(
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