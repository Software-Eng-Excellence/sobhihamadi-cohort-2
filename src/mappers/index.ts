import { ItemCategory } from "../model/IItem";

import { JsonRequestCakeMapper } from "./CakeMapper";
import { JsonRequestOrderMapper } from "./OrderMapper";




export class JsonRequestFactory {
    public static Create(type:ItemCategory):  JsonRequestOrderMapper {
        switch (type) {
            case ItemCategory.Cake:
                return new JsonRequestOrderMapper( new JsonRequestCakeMapper());

           
            default:
                throw new Error(`No mapper found for category: ${type}`);
        }
    }
}