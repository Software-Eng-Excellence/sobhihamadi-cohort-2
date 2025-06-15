import dotenv  from "dotenv";
import path from "path";
dotenv.config({path:path.join(__dirname,'../../.env')}); // Load environment variables from .env file

export default  {
  logDir: process.env.LOG_DIR || './logs', // Directory for log files
  isDev: process.env.NODE_ENV == 'development', // Check if the environment is development
}