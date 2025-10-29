import { IdentifierToy } from "model/toy.model";
import { ID, Initializable, IRepository } from "repository/IRepository";



export class ToyOrderRepository implements IRepository<IdentifierToy>, Initializable {
    init(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    create(item: IdentifierToy): Promise<ID> {
        throw new Error("Method not implemented.");
    }
    get(id: ID): Promise<IdentifierToy> {
        throw new Error("Method not implemented.");
    }
    getall(): Promise<IdentifierToy[]> {
        throw new Error("Method not implemented.");
    }
    update(item: IdentifierToy): Promise<void> {
        throw new Error("Method not implemented.");
    }
    delete(id: ID): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
    
}