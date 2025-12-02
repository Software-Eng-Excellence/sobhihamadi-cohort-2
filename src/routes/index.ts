import { Router } from "express";
import OrderRoutes from "./orders.route";
import AnalyticsRoutes from "./analytics.route";
import UserRoutes from "./users.route";
import authRoutes from "./auth.route";
import { Authentication } from "../middleware/auth";
const routes=Router();


routes.use('/orders',Authentication,OrderRoutes);
routes.use('/analytics', Authentication,AnalyticsRoutes)
routes.use("/users" ,UserRoutes);
routes.use('/auth', authRoutes);

export default routes;
