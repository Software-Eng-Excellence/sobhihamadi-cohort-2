import { Response, Router } from "express";
import OrderRoutes from "./orders.route";
import AnalyticsRoutes from "./analytics.route";
import UserRoutes from "./users.route";
import authRoutes from "./auth.route";
import { Authentication } from "../middleware/auth";
import logger from "../util/logger";
import { ConnectionManager as PostgreConnection } from "../repository/PostgreSQL/PostgreConnection";
import { ConnectionManager as SqliteConnection } from "../repository/sqlite/ConnectionManager";

const routes=Router();


routes.use('/orders',Authentication,OrderRoutes);
routes.use('/analytics', Authentication,AnalyticsRoutes)
routes.use("/users" ,UserRoutes);
routes.use('/auth', authRoutes);
logger.info('routes loaded,/orders, /analytics, /users, /auth');

routes.get('/health/status', (req, res:Response) => {
    res.status(200).json({ status: 'OK',message:'Application is healthy' });
});
routes.get('/greet', (req, res:Response) => {
    res.status(200).json({ message: 'Hello, World!' });
})

routes.get('/health/db', async (req, res:Response) => {
    try {
        const dbconnection=await CheckDatabaseConnection();
        if (dbconnection) {
             res.status(200).json({ status: 'Database connection is healthy' });
        } else {
               res.status(500).json({ status: 'Database connection is not healthy' });
        }
        // Add your database connection check here
        // Example: await db.query('SELECT 1');
       
    } catch (error) {
        logger.error('Database connection failed', error);
         res.status(500).json({ status: 'Database connection failed' });
    }
});

async function CheckDatabaseConnection(): Promise<boolean> {
    const sqlUp  = SqliteConnection.getConnection().then(() => true).catch(() => false);
const pgUp   = PostgreConnection.getPostgreConnection().then(() => true).catch(() => false);
return Promise.any([sqlUp, pgUp]); 

}
logger.info('routes loaded,/health/status, /health/db');


export default routes;
