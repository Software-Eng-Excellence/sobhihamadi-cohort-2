"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonRequestFactory = void 0;
const IItem_1 = require("../model/IItem");
const CakeMapper_1 = require("./CakeMapper");
const OrderMapper_1 = require("./OrderMapper");
class JsonRequestFactory {
    static Create(type) {
        switch (type) {
            case IItem_1.ItemCategory.Cake:
                return new OrderMapper_1.JsonRequestOrderMapper(new CakeMapper_1.JsonRequestCakeMapper());
            default:
                throw new Error(`No mapper found for category: ${type}`);
        }
    }
}
exports.JsonRequestFactory = JsonRequestFactory;
//# sourceMappingURL=index.js.map