import dotenv  from "dotenv";
import path from "path";
import { DBMode } from "../config/db_mode";
import type { StringValue } from "ms";
dotenv.config({path:path.join(__dirname,'../../.env')}); // Load environment variables from .env file

export default  {
  logDir: process.env.LOG_DIR || './logs', // Directory for log files
  isDev: process.env.NODE_ENV==="development", // Check if the environment is development
  isProduction:process.env.NODE_ENV==="production",
  storagePath: {
  csv:
    {
      cake:'src/data/data/cake orders.csv',
},

sqlite:{
  orders:  process.env.SQL_DATABASE_URL||'src/data/data/orders.db'


},
postgres:{
  url: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_sAkJNoWI37Tv@ep-silent-violet-ag127b62-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
}
},
port: process.env.PORT ? parseInt(process.env.PORT) : 3000, // Server port
host: process.env.HOST || 'localhost', // Server host


DBMode:DBMode.SQLITE || DBMode.POSTGRES, // Database mode
auth:
{
  tokenExpiry: (process.env.TOKEN_EXPIRY || '15m') as StringValue, // Token expiry duration
  secretkey: process.env.JWT_SECRET_KEY || 'secret-111222242421',// Secret key for authentication
  tokenrefrechExpiry: (process.env.TOKEN_REFRECH_EXPIRY || '7d') as StringValue
}

};