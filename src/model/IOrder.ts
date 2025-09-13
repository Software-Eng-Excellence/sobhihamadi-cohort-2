import { IItem } from "./IItem";

export interface IOrder{
    getId(): string;
    getItem(): IItem
    getQuantity(): number;
    getPrice(): number;
}