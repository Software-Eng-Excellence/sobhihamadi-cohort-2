"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.identifierOrderItemBuilder = exports.OrderBuilder = void 0;
const order_model_1 = require("../order.model");
class OrderBuilder {
    static NewBuilder() {
        return new OrderBuilder();
    }
    setId(id) {
        this._id = id;
        return this;
    }
    setItem(item) {
        this._item = item;
        return this;
    }
    setQuantity(quantity) {
        this._quantity = quantity;
        return this;
    }
    setPrice(price) {
        this._price = price;
        return this;
    }
    build() {
        if (!this._id || !this._item || this._quantity <= 0 || this._price < 0) {
            throw new Error("Invalid order parameters");
        }
        return new order_model_1.Order(this._id, this._item, this._quantity, this._price);
    }
}
exports.OrderBuilder = OrderBuilder;
class identifierOrderItemBuilder {
    static NewBuilder() {
        return new identifierOrderItemBuilder();
    }
    setItem(item) {
        this._item = item;
        return this;
    }
    setOrder(order) {
        this.order = order;
        return this;
    }
    build() {
        if (!this.order || !this._item) {
            throw new Error("Invalid order parameters");
        }
        return new order_model_1.IdentifierOrderItem(this.order.getid(), this._item.getCategory(), this._item, this.order.getQuantity(), this.order.getPrice());
    }
}
exports.identifierOrderItemBuilder = identifierOrderItemBuilder;
//# sourceMappingURL=Order.builder.js.map