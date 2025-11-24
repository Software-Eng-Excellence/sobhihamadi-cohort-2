import { Router } from "express";
import OrderRoutes from "./orders.route";
import AnalyticsRoutes from "./analytics.route";

const routes=Router();
routes.get('/',(req,res)=>{
    res.json({messages:'Hello, World!'});
});

routes.use('/orders', OrderRoutes);
routes.use('/analytics', AnalyticsRoutes)



export default routes;