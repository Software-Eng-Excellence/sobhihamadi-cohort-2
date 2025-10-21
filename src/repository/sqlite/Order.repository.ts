import { identifierOrderItem } from "model/IOrder";
import { ID, Initializable, IRepository, IRepositoryWithInit } from "repository/IRepository";
import { ConnectionManager } from "./ConnectionManager";
import logger from "../../util/logger";
import { DbException, InitializationException } from "../../util/exceptions/repositoryExceptions";
import { identifierItem } from "model/IItem";
import { ISQLITEOrderData, SQLITEOrderMapper } from "../../mappers/OrderMapper";
import { IdentifierOrderItem, Order } from "model/order.model";


const INSERT_ORDER=`INSERT INTO "order" (id, item, quantity, Item_Category, price) VALUES (?, ?, ?, ?, ?);`
 const CREATE_TABLE=`CREATE TABLE IF NOT EXISTS "order" (
            id TEXT PRIMARY KEY,
            item TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            Item_Category TEXT NOT NULL,
            price INTEGER NOT NULL
        );`

const SELECT_BY_ID=`SELECT * FROM "order" WHERE id=?;`
const GET_ALL=`SELECT * FROM "order" where item_category= ?;`
const DELETE_BY_ID=`DELETE FROM "order" WHERE id=?;`
const UPDATE_ORDER=`UPDATE "order" SET item=?, quantity=?, Item_Category=?, price=? WHERE id=?;`
export class OrderRepository implements IRepository<identifierOrderItem>, Initializable {
   
    constructor(private readonly itemrepository: IRepository<identifierItem> & Initializable) {
        // Initialize your repository here (e.g., connect to the database)
       
    }
    async create(order: identifierOrderItem): Promise<ID> {
        
        //transaction    
            //insert data into order table
            // insert data into 'item' table
        //commit
        //return the id of the created item

        //if error, log and rollback 


  let conn;
        
        try {
          conn= await ConnectionManager.getConnection();
            // Start a transaction
            await  conn.exec("BEGIN TRANSACTION;");
            const itemId= await this.itemrepository.create(order.getItem() as identifierItem);
            await conn.run(INSERT_ORDER,[
                order.getid(),
                  itemId,
                 order.getQuantity(),
                  order.getItem().getCategory(),
                   order.getPrice(),
                 

            ]);
            // Commit the transaction
                await conn.exec("COMMIT;");
            return order.getid();


        } catch (error : unknown) {
           
            throw new DbException("Failed to create item in the database.", error as Error);
            
        }
    }
    async get(id: ID): Promise<identifierOrderItem> {
        try {
            const conn = await ConnectionManager.getConnection();
            const result = await conn.get<ISQLITEOrderData>(SELECT_BY_ID, id);
            if(!result){
                throw new Error(`Order with id ${id} not found`);
            }
           const cake= await this.itemrepository.get(result.item);
           
            return new SQLITEOrderMapper().map({data: result,item:cake});
        } catch (error: unknown) {
            logger.error("Error getting order of id %s %o", id,(error as Error).message);
            throw new DbException("Failed to get order of id", error as Error);
        }

     
    }
   async getall(): Promise<identifierOrderItem[]> {
        try {
            const conn= await ConnectionManager.getConnection();
            const items= await this.itemrepository.getall();
            if(items.length===0){
                return [];}
            const orders= await conn.all<ISQLITEOrderData[]>(GET_ALL, items[0].getCategory());

            //bind orders to items
          const BindedOrders= orders.map((order)=>{
                const foundItem= items.find((item)=> item.getid()===order.item);
                if(!foundItem){
                    throw new DbException(`Item with id ${order.item} not found for order ${order.id}`, new Error("Data inconsistency"));
                }
                return {order,foundItem};
            });
                

            //for each binded order, map it into an indentifier Order
            const identifierOrders= BindedOrders.map(({order,foundItem})=>{
                return new SQLITEOrderMapper().map({data: order, item: foundItem});
            });
            //return list of identifier orders
            return identifierOrders;

        
            
        } catch (error) {
            logger.error("Error getting all orders: %o",(error as Error).message);
            throw new DbException("Failed to get all orders", error as Error);
        }
      
    }
    async update(order: IdentifierOrderItem):Promise<void>{
        
        let conn;
       try {
             conn= await ConnectionManager.getConnection();
           conn.exec("BEGIN TRANSACTION;");
            await this.itemrepository.update(order.getItem());
            await conn.run(UPDATE_ORDER, [
                    order.getItem().getid(),
                    order.getItem().getCategory(),
                    order.getPrice(),
                    order.getQuantity(),
                    order.getid()
           
            ]);
        conn.exec("COMMIT;");
        
       } catch (error) {
        logger.error("Error updating order of id %s: %o", order.getid(),(error as Error).message);
        conn && conn.exec("ROLLBACK;");
        throw new DbException("Failed to update order", error as Error);
        
       }
    }
   async delete(id: ID): Promise<void> {
    let conn;
    try {
          conn= await ConnectionManager.getConnection();
         await conn.exec("BEGIN TRANSACTION;");
            await this.itemrepository.delete(id);

         await conn.run(DELETE_BY_ID, id);
            await conn.exec("COMMIT;");
        
    } catch (error) {
        logger.error("Error deleting order of id %s: %o", id,(error as Error).message);
        conn && await conn.exec("ROLLBACK;");
        throw new DbException("Failed to delete order", error as Error);
        
    }
      
         
    }
    async init(): Promise<void> {
        try {
             const conn=await ConnectionManager.getConnection();
             await conn.exec(CREATE_TABLE);
             await this.itemrepository.init();
             logger.info("Order table created or already exists.");
           
        }
      
         catch (error: unknown) {
            logger.error("Error during database initialization: " + error as unknown as Error);
            throw new InitializationException("Failed to initialize the database.", error as Error );
            
        }
       
        
       
       



}}
