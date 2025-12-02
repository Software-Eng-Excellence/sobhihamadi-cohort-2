import { id } from "repository/IRepository";
import { identifierItem, IItem } from "./IItem";

export interface IOrder{
    getid(): string;
    getItem(): IItem
    getQuantity(): number;
    getPrice(): number;
}
export interface identifierOrderItem extends IOrder, id{


}