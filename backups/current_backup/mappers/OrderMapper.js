"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonRequestOrderMapper = exports.SQLITEOrderMapper = exports.CSVOrderMapper = void 0;
const Order_builder_1 = require("../model/builders/Order.builder");
class CSVOrderMapper {
    constructor(itemMapper) {
        this.itemMapper = itemMapper;
    }
    map(data) {
        const item = this.itemMapper.map(data);
        return Order_builder_1.OrderBuilder.NewBuilder()
            .setId(data[0])
            .setItem(item)
            .setQuantity(parseInt(data[data.length - 1])) // Assuming the last element is quantity
            .setPrice(parseFloat(data[data.length - 2])) // Assuming the second last element is price
            .build();
    }
    reverseMap(data) {
        const itemData = this.itemMapper.reverseMap(data.getItem());
        return [
            data.getid(),
            ...itemData,
            data.getPrice().toString(),
            data.getQuantity().toString()
        ];
    }
}
exports.CSVOrderMapper = CSVOrderMapper;
class SQLITEOrderMapper {
    map({ data, item }) {
        const order = Order_builder_1.OrderBuilder.NewBuilder()
            .setId(data.id)
            .setItem(item)
            .setPrice(data.price)
            .setQuantity(data.quantity)
            .build();
        return Order_builder_1.identifierOrderItemBuilder.NewBuilder()
            .setOrder(order)
            .setItem(item)
            .build();
    }
    reverseMap(item) {
        return {
            data: {
                id: item.getid(),
                item: item.getItem().getid(),
                quantity: item.getQuantity(),
                item_Category: item.getItem().getCategory(),
                price: item.getPrice()
            },
            item: item.getItem()
        };
    }
}
exports.SQLITEOrderMapper = SQLITEOrderMapper;
class JsonRequestOrderMapper {
    constructor(itemMapper) {
        this.itemMapper = itemMapper;
    }
    map(data) {
        //extract item and build identifierItem
        const item = this.itemMapper.map(data.item);
        //extract order and build identifierOrder
        const order = Order_builder_1.OrderBuilder.NewBuilder()
            .setId(data.id)
            .setItem(item)
            .setQuantity(data.quantity)
            .setPrice(data.price)
            .build();
        return Order_builder_1.identifierOrderItemBuilder.NewBuilder()
            .setOrder(order)
            .setItem(item)
            .build();
    }
    reverseMap(data) {
        const itemJson = this.itemMapper.reverseMap(data.getItem());
        return {
            id: data.getid(),
            item: itemJson,
            quantity: data.getQuantity(),
            price: data.getPrice(),
        };
    }
}
exports.JsonRequestOrderMapper = JsonRequestOrderMapper;
//# sourceMappingURL=OrderMapper.js.map