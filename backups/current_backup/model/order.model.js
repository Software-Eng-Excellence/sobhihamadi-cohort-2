"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentifierOrderItem = exports.Order = void 0;
class Order {
    constructor(id, item, quantity, price) {
        this.id = id;
        this.item = item;
        this.quantity = quantity;
        this.price = price;
    }
    getid() {
        return this.id;
    }
    getItem() {
        return this.item;
    }
    getQuantity() {
        return this.quantity;
    }
    getPrice() {
        return this.price;
    }
}
exports.Order = Order;
class IdentifierOrderItem {
    constructor(id, category, IdentifierItem, quantity, price) {
        this.id = id;
        this.category = category;
        this.IdentifierItem = IdentifierItem;
        this.quantity = quantity;
        this.price = price;
    }
    getid() {
        return this.id;
    }
    getQuantity() {
        return this.quantity;
    }
    getItem() {
        return this.IdentifierItem;
    }
    getPrice() {
        return this.price;
    }
    getCategory() {
        return this.category;
    }
}
exports.IdentifierOrderItem = IdentifierOrderItem;
//# sourceMappingURL=order.model.js.map