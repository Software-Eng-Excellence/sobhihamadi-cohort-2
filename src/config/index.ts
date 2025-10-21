import dotenv  from "dotenv";
import path from "path";
dotenv.config({path:path.join(__dirname,'../../.env')}); // Load environment variables from .env file

export default  {
  logDir: process.env.LOG_DIR || './logs', // Directory for log files
  isDev: true, // Check if the environment is development
  storagePath: {
  csv:
    {
      cake:'src/data/data/cake orders.csv',
},

sqlite:{
  orders:'src/data/data/orders.db'


},
postgres:{
  url: process.env.DATABASE_URL || 'postgresql://USER:PASSWORD@HOST:PORT/DB?sslmode=require',
}
}}