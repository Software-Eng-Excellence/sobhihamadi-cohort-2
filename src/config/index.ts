import dotenv  from "dotenv";
import path from "path";
dotenv.config({path:path.join(__dirname,'../../.env')}); // Load environment variables from .env file

export default  {
  secret: process.env || 'default secret',
}