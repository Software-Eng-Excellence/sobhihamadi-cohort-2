import { Item } from "./Item.model";

interface Order{
    getId(): string;
    getItem(): Item
    getQuantity(): number;
    getPrice(): number;
}