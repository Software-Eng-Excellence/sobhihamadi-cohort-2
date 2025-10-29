import { IdentifierBook } from "model/book.model";
import { ID, Initializable, IRepository } from "repository/IRepository";


export class BookOrderRepository implements IRepository<IdentifierBook>, Initializable{
    create(item: IdentifierBook): Promise<ID> {
        throw new Error("Method not implemented.");
    }
    get(id: ID): Promise<IdentifierBook> {
        throw new Error("Method not implemented.");
    }
    getall(): Promise<IdentifierBook[]> {
        throw new Error("Method not implemented.");
    }
    update(item: IdentifierBook): Promise<void> {
        throw new Error("Method not implemented.");
    }
    delete(id: ID): Promise<void> {
        throw new Error("Method not implemented.");
    }
    init(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
}