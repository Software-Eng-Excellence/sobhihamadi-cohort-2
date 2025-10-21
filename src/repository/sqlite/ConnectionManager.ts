import config from "../../config";
import { Database as SqliteDatabase,open } from "sqlite"
import { Database,Statement } from "sqlite3"
import { DatabaseConnectionException } from "../../util/exceptions/DatabaseConnectionException";


export class ConnectionManager {
 //get instance of database connection
 //return a db connection instance"the same instance every time it is called"

 private constructor() {}
    
private static db: SqliteDatabase<Database, Statement> | null = null;

public static async getConnection(): Promise<SqliteDatabase<Database, Statement>> {
    if (this.db== null) {
        try {
             this.db=await open({
        filename: config.storagePath.sqlite.orders,
        driver: Database
       });
            
        } catch (error : unknown) {
            throw new DatabaseConnectionException("Failed to connect to the database.", error as Error);
            
        }
      
    }
    return this.db;
   

}

}
  