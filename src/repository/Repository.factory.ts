import { ItemCategory } from "../model/IItem";
import { identifierOrderItem, IOrder } from "../model/IOrder";
import { Initializable, IRepository } from "./IRepository";
import { OrderRepository } from "./sqlite/Order.repository";
import { CakeOrderRepository } from "./sqlite/CakeOrder.repository";

import { CakeRepositoryPostgre } from "./PostgreSQL/CakeRepositoryP";
import { BookRepositoryPostgre } from "./PostgreSQL/BookRepositoryP";
import { ToyPostgreRepository } from "./PostgreSQL/ToyRepositoryP";
import { BookOrderRepository } from "./sqlite/BookOrder.repository";
import { ToyOrderRepository } from "./sqlite/ToyOrder.repository";
import { DBMode } from "../config/db_mode";




export  class RepositoryFactory {
    
    public static async create(mode:DBMode,category:ItemCategory): Promise<IRepository<identifierOrderItem>>{
         let repository: IRepository<identifierOrderItem> & Initializable;
        switch(mode){
             
             case DBMode.POSTGRES:{
                
            switch(category){
                case ItemCategory.Cake:
                    repository= new OrderRepository(new CakeRepositoryPostgre());
                    break;
                   
                case ItemCategory.Book:
                    repository=  new OrderRepository( new BookRepositoryPostgre());
                    break;
    
                 case ItemCategory.Toy:
                    repository= new OrderRepository(new ToyPostgreRepository());
                    break;
                default:
                    throw new Error("Invalid category");

            }
            await repository.init();
            return repository;
           
        }
            case DBMode.SQLITE:{    

            switch(category){
            case ItemCategory.Cake:
                repository= new OrderRepository(new CakeOrderRepository());
                break;
                
        case ItemCategory.Book:
            repository= new OrderRepository(new BookOrderRepository());
            break;
          case ItemCategory.Toy:
                    repository= new OrderRepository(new ToyOrderRepository());
                    break;
            default:
                throw new Error("Invalid category");
            }
            await repository.init();
            return repository;
            
        }    
        case DBMode.CSV:{
          throw new Error("file csv Mode  is deprecated");
                  

                }

               
            }

     
        }

                



}
