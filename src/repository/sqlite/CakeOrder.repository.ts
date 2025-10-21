import { identifierCake } from "model/cake.model";
import { ID, Initializable, IRepository } from "repository/IRepository";
import logger from "../../util/logger";
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/repositoryExceptions";
import { ConnectionManager } from "./ConnectionManager";
import { ItemCategory } from "../../model/IItem";
import { ISQliteCake, SQLITECakeMapper } from "../../mappers/CakeMapper";



const TableName=ItemCategory.Cake;
const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS ${TableName}(
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    flavor TEXT NOT NULL,
    filling TEXT NOT NULL,
    size INTEGER NOT NULL,
    layers INTEGER NOT NULL,
    frostingType TEXT NOT NULL,
    frostingFlavor TEXT NOT NULL,
    decorationType TEXT NOT NULL,
    decorationColor TEXT NOT NULL,
    customMessage TEXT,
    shape TEXT NOT NULL,
    allergies TEXT,
    specialIngredients TEXT,
    packagingType TEXT NOT NULL
);`

const INSERT_CAKE=`INSERT INTO ${TableName}
 (id,type, flavor, filling, size, layers, frostingType, frostingFlavor, decorationType, decorationColor,
  customMessage, shape, allergies,
   specialIngredients, packagingType)
   VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
const SELECT_CAKE_BY_ID=`SELECT * FROM ${TableName} WHERE id=?;`
const GET_ALL=`SELECT * FROM ${TableName};`

const DELETE_CAKE_BY_ID=`DELETE FROM ${TableName} WHERE id=?;`
const UPDATE_CAKE=
`UPDATE ${TableName} SET type=?, flavor=?, filling=?, size=?, layers=?, frostingType=?,
    frostingFlavor=?, decorationType=?, decorationColor=?, customMessage=?, shape=?, allergies=?,
    specialIngredients=?, packagingType=? WHERE id=?;`





export class CakeOrderRepository implements IRepository<identifierCake>, Initializable {


    async init(): Promise<void> {
        try {
           const conn=await ConnectionManager.getConnection();
            await conn.exec(CREATE_TABLE);
        logger.info("cake table created or already exists.");
        }
       

         catch (error: unknown) {
            logger.error("Error during cake table initialization " + error as unknown as Error);
            throw new InitializationException("Failed to initialize the database(cake).", error as Error );
            
        }
       
    
}
async create(item: identifierCake): Promise<ID> {
    try {
        const conn = await ConnectionManager.getConnection();
        await conn.run(INSERT_CAKE, [
            item.getid(),
            item.getType(),
            item.getFlavor(),
            item.getFilling(),
            item.getSize(),
            item.getLayers(),
            item.getFrostingType(),
            item.getFrostingFlavor(),
            item.getDecorationType(),
            item.getDecorationColor(),
            item.getCustomMessage(),
            item.getShape(),
            item.getAllergies(),
            item.getSpecialIngredients(),
            item.getPackagingType(),
        ]);


        logger.info("Creating cake, id=%s params=%o", item.getid());

        return item.getid();
    } catch (error: unknown) {
        // Log full error (sqlite message + stack) before rethrowing
        logger.error("Failed to create cake order (raw): %o", error);
        throw new DbException("Failed to create cake order", error as Error);
    }
}
    async get(id: ID): Promise<identifierCake> {
    try {
        const conn = await ConnectionManager.getConnection();
        const result = await conn.get<ISQliteCake>(SELECT_CAKE_BY_ID, id);
      if (!result) {
        throw new ItemNotFoundException(`Cake with id ${id} not found`);
        }
      return new SQLITECakeMapper().map(result); 
    } catch (error: unknown) {
        logger.error("failed to get cake of id %s %o ", id,(error as Error).message);
        throw new DbException("Failed to get cake order", error as Error);
    }
    }
   async getall(): Promise<identifierCake[]> {
        try {
            const conn= await ConnectionManager.getConnection();
            const results= await conn.all<ISQliteCake[]>(GET_ALL);
            const cakes= new SQLITECakeMapper();
            return results.map((cake)=> cakes.map(cake));

        } catch (error) {
            logger.error("failed to get all cakes ");
        throw new DbException("Failed to get all cakes ", error as Error);
            
        }
       
    }
    async update(item: identifierCake): Promise<void> {
        try {
            const conn= await ConnectionManager.getConnection();
            await conn.run(UPDATE_CAKE, [
                item.getType(),
                item.getFlavor(),
                item.getFilling(),
                item.getSize(),
                item.getLayers(),
                item.getFrostingType(),
                item.getFrostingFlavor(),
                item.getDecorationType(),
                item.getDecorationColor(),
                item.getCustomMessage(),
                item.getShape(),
                item.getAllergies(),
                item.getSpecialIngredients(),
                item.getPackagingType(),
                item.getid()
            ]);
            
        } catch (error) {
            logger.error("Error updating cake of id %s: %o", item.getid(),(error as Error).message);
            throw new DbException("Failed to update cake"+item.getid(), error as Error);
            
        }
       
    }
    async delete(id: ID): Promise<void> {
        try {
               const conn= await ConnectionManager.getConnection();
        await conn.run(DELETE_CAKE_BY_ID, id);
            
        } catch (error) {
            logger.error("Error deleting cake of id %s: %o", id,(error as Error).message);
            throw new DbException("Failed to delete cake", error as Error);
            
        }
    

    }
    
}
