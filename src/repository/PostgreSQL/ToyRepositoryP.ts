import { IdentifierToy } from "model/toy.model";
import { ID, Initializable, IRepository } from "repository/IRepository";
import { ConnectionManager } from "./PostgreConnection";
import logger from "../../util/logger";
import { InitializationException } from "../../util/exceptions/repositoryExceptions";
import { IToyMapper, PostgreToyMapper } from "../../mappers/ToyMapper";


const CREATE_TABLE_TOYS = `CREATE TABLE IF NOT EXISTS toy (
    "id" TEXT PRIMARY KEY,
    "type" TEXT NOT NULL,
    "ageGroup" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "batteryRequired" BOOLEAN NOT NULL,
    "educational" BOOLEAN NOT NULL
);`;
const INSERT_TOY_QUERY = `INSERT INTO toy
    ("id", "type", "ageGroup", "brand", "material", "batteryRequired", "educational")
    VALUES ($1, $2, $3, $4, $5, $6, $7)`;
const SELECT_TOY_BY_ID=`SELECT * FROM toy WHERE id=$1;`;
const SELECT_ALL=`SELECT * FROM toy;`;
const UPDATE_TOY_QUERY=`UPDATE toy SET
    "type"=$1,
    "ageGroup"=$2,
    "brand"=$3,
    "material"=$4,    
    "batteryRequired"=$5,
    "educational"=$6
    WHERE id=$7;`;
    const DELETE_TOY_QUERY=`DELETE FROM toy WHERE id=$1;`;
    const DROP_TABLE_TOYS=`DROP TABLE IF EXISTS toy;`;

export class ToyPostgreRepository implements IRepository<IdentifierToy>, Initializable{

    async drop(): Promise<void> {
        const conn=await ConnectionManager.getPostgreConnection();
        await conn.query(DROP_TABLE_TOYS);
        logger.info("PostgreSQL toy table dropped.");
    }
    
    async init(): Promise<void> {
        try {
            const conn= await ConnectionManager.getPostgreConnection();
            await conn.query(CREATE_TABLE_TOYS);
            logger.info("PostgreSQL toy table created or already exists.");
            
        } catch (error) {
            logger.error("Error during PostgreSQL toy table initialization " + error as unknown as Error);
            throw new InitializationException("Failed to initialize the PostgreSQL toy database.", error as Error );
            
        }
        
    }
    async create(item: IdentifierToy): Promise<ID> {
        try {
             const conn=await ConnectionManager.getPostgreConnection();
        await conn.query(INSERT_TOY_QUERY, [
            item.getid(),
            item.getType(),
            item.getAgeGroup(),
            item.getBrand(),    
            item.getMaterial(),
            item.getBatteryRequired(),
            item.getEducational()
        ]);
        logger.info(`Toy with ID ${item.getid()} inserted into PostgreSQL database.`);
        return  item.getid();
            
        } catch (error) {
            logger.error("Error inserting toy into PostgreSQL database " + error as unknown as Error);
            throw new Error("Failed to insert toy into PostgreSQL database.");
            
        }
       
        
    }
    async get(id: ID): Promise<IdentifierToy> {
        try {
                    const conn=await ConnectionManager.getPostgreConnection();
        const Toy=await conn.query<IToyMapper>(SELECT_TOY_BY_ID,[id]);
        if (Toy.rows.length === 0) {
            throw new Error(`Toy with ID ${id} not found.`);
        }
        logger.info("Toy retrieved from PostgreSQL database with ID: %s", id);
        const toys=new PostgreToyMapper();
        return toys.map(Toy.rows[0]);
      
            
        } catch (error) {
            logger.error("Error during getting toy from PostgreSQL " + error as unknown as Error);
            throw new Error("Failed to get toy from PostgreSQL database.");
            
        }


        }
     async getall(): Promise<IdentifierToy[]> {
        try {
             const conn = await ConnectionManager.getPostgreConnection();
                const result= await conn.query<IToyMapper>(SELECT_ALL);
                const toys= new PostgreToyMapper();
    
                logger.info("get ALL toys from PostgreSQL database ");
                return result.rows.map((toy)=> toys.map(toy));
            
        } catch (error) {
            logger.error("Error during getting all toys from PostgreSQL " + error as unknown as Error);
            throw new Error("Failed to get all toys from PostgreSQL database.");
            
        }

            
                
     
    }
  async  update(item: IdentifierToy): Promise<void> {
       try {

        const conn=await ConnectionManager.getPostgreConnection();
        await conn.query(UPDATE_TOY_QUERY, [
            item.getType(),
            item.getAgeGroup(),
            item.getBrand(),    
            item.getMaterial(),
            item.getBatteryRequired(),
            item.getEducational(),
            item.getid()
        ]);
        logger.info(`Toy with ID ${item.getid()} updated in PostgreSQL database.`);
        
       } catch (error) {
        logger.error("Error during updating toy in PostgreSQL " + error as unknown as Error);
        throw new Error("Failed to update toy in PostgreSQL database.");
        
       }
    }
   async delete(id: ID): Promise<void> {
        try {
            const conn=await ConnectionManager.getPostgreConnection();
            await conn.query(DELETE_TOY_QUERY,[id]);
            logger.info("Toy deleted from PostgreSQL database with ID: %s", id);
            
        } catch (error) {
            logger.error("Error during deleting toy from PostgreSQL " + error as unknown as Error);
            throw new Error("Failed to delete toy from PostgreSQL database.");
            
        }
 
    }


    
    }
  

