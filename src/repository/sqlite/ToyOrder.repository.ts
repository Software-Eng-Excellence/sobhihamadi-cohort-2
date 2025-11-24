import { IdentifierToy } from "../../model/toy.model";
import { ID, Initializable, IRepository } from "../../repository/IRepository";
import { ConnectionManager } from "./ConnectionManager";
import logger from "../../util/logger";
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/repositoryExceptions";
import { IToyMapper, PostgreToyMapper } from "../../mappers/ToyMapper";

const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS toy (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    ageGroup TEXT NOT NULL,
    brand TEXT NOT NULL,

    material TEXT NOT NULL,
    educational BOOLEAN NOT NULL,
    batteryRequired BOOLEAN NOT NULL

);`
const INSERT_TOY=`INSERT INTO toy (id, type, ageGroup, brand, material, educational, batteryRequired)
 VALUES (?,?,?,?,?,?,?);`
const SELECT_TOY_BY_ID=`SELECT * FROM toy WHERE id=?;`
const GET_ALL=`SELECT * FROM toy;`
const DELETE_TOY_BY_ID=`DELETE FROM toy WHERE id=?;`
const UPDATE_TOY=`UPDATE toy SET type=?, ageGroup=?, brand=?, material=?, educational=?, batteryRequired=? WHERE id=?;`

export class ToyOrderRepository implements IRepository<IdentifierToy>, Initializable {
   async  init(): Promise<void> {
         try {
           const conn=await ConnectionManager.getConnection();
            await conn.exec(CREATE_TABLE);
        logger.info("toy table created or already exists.");
        }
       

         catch (error: unknown) {
            logger.error("Error during toy table initialization " + error as unknown as Error);
            throw new InitializationException("Failed to initialize the database(toy).", error as Error );
            
        }
    }
    async create(item: IdentifierToy): Promise<ID> {
        try {
            const conn= await ConnectionManager.getConnection();
            const result= await conn.run(
                INSERT_TOY,[
                    item.getid(),
                    item.getType(),
                    item.getAgeGroup(),
                    item.getBrand(),
                    item.getMaterial(),
                    item.getEducational(),
                    item.getBatteryRequired(),
                ]);
            logger.info("Creating toy, id=%s params=%o", item.getid());

        return item.getid();
    } catch (error: unknown) {
        // Log full error (sqlite message + stack) before rethrowing
        logger.error("Failed to create toy order (raw): %o", error);
        throw new DbException("Failed to create toy order", error as Error);
    }

    }
    async get(id: ID): Promise<IdentifierToy> {
         try {
        const conn = await ConnectionManager.getConnection();
        const result = await conn.get<IToyMapper>(SELECT_TOY_BY_ID, id);
      if (!result) {
        throw new ItemNotFoundException(`toy with id ${id} not found`);
        }
      return new PostgreToyMapper().map(result); 
    } catch (error: unknown) {
        logger.error("failed to get toy of id %s %o ", id,(error as Error).message);
        throw new DbException("Failed to get toy order", error as Error);
    }
    }
    async getall(): Promise<IdentifierToy[]> {
      try {
            const conn= await ConnectionManager.getConnection();
            const results= await conn.all<IToyMapper[]>(GET_ALL);
            const cakes= new PostgreToyMapper();
            return results.map((cake)=> cakes.map(cake));

        } catch (error) {
            logger.error("failed to get all toys ");
        throw new DbException("Failed to get all toys ", error as Error);
            
        }
    }
   async  update(item: IdentifierToy): Promise<void> {
       try {    
        const conn= await ConnectionManager.getConnection();
        await conn.run( UPDATE_TOY,[
            item.getType(),
            item.getAgeGroup(),
            item.getBrand(),
            item.getMaterial(),
            item.getEducational(),
            item.getBatteryRequired(),
            item.getid()
        ]);
       } catch (error: unknown) {
        // Log full error (sqlite message + stack) before rethrowing
        logger.error("Failed to update toy order (raw): %o", error);
        throw new DbException("Failed to update toy order", error as Error);
       }
    }
  async  delete(id: ID): Promise<void> {
        try {
            const conn= await ConnectionManager.getConnection();
            await conn.run( DELETE_TOY_BY_ID,[id]);
        } catch (error: unknown) {
            // Log full error (sqlite message + stack) before rethrowing
            logger.error("Failed to delete toy order (raw): %o", error);
            throw new DbException("Failed to delete toy order", error as Error);
           }
    }
    
    
}