import { ItemCategory } from "../model/IItem";
import {  PostgreBookMapper } from "./BookMapper";
import { SQLITECakeMapper } from "./CakeMapper";
import {  PostgreToyMapper } from "./ToyMapper";
import { IMapper } from "./IMapper";

export class FactoryMapper {
  public static create(category: ItemCategory): IMapper<unknown,unknown> {
    switch (category) {
      case ItemCategory.Book:
        return new PostgreBookMapper();
      case ItemCategory.Cake:
        return new SQLITECakeMapper();
      case ItemCategory.Toy:
        return new PostgreToyMapper();
      default:
        throw new Error(`No mapper found for category: ${category}`);
    }
  }
}
    