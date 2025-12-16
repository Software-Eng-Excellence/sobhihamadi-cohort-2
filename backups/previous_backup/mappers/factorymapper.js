"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FactoryMapper = void 0;
const IItem_1 = require("../model/IItem");
const BookMapper_1 = require("./BookMapper");
const CakeMapper_1 = require("./CakeMapper");
const ToyMapper_1 = require("./ToyMapper");
class FactoryMapper {
    static create(category) {
        switch (category) {
            case IItem_1.ItemCategory.Book:
                return new BookMapper_1.PostgreBookMapper();
            case IItem_1.ItemCategory.Cake:
                return new CakeMapper_1.SQLITECakeMapper();
            case IItem_1.ItemCategory.Toy:
                return new ToyMapper_1.PostgreToyMapper();
            default:
                throw new Error(`No mapper found for category: ${category}`);
        }
    }
}
exports.FactoryMapper = FactoryMapper;
//# sourceMappingURL=factorymapper.js.map