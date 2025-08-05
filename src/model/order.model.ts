import { Item } from "./Item.model";

export interface Order{
    getId(): string;
    getItem(): Item
    getQuantity(): number;
    getPrice(): number;
}