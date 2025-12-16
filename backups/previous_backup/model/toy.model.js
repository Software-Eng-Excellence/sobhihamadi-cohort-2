"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentifierToy = exports.Toy = void 0;
const IItem_1 = require("./IItem");
class Toy {
    getCategory() {
        return IItem_1.ItemCategory.Toy;
    }
    constructor(type, ageGroup, brand, material, batteryRequired, educational) {
        this.type = type;
        this.ageGroup = ageGroup;
        this.brand = brand;
        this.material = material;
        this.batteryRequired = batteryRequired;
        this.educational = educational;
    }
    getType() {
        return this.type;
    }
    getAgeGroup() {
        return this.ageGroup;
    }
    getBrand() {
        return this.brand;
    }
    getMaterial() {
        return this.material;
    }
    getBatteryRequired() {
        return this.batteryRequired;
    }
    getEducational() {
        return this.educational;
    }
}
exports.Toy = Toy;
class IdentifierToy extends Toy {
    constructor(id, type, ageGroup, brand, material, batteryRequired, educational) {
        super(type, ageGroup, brand, material, batteryRequired, educational);
        this.id = id;
    }
    getid() {
        return this.id;
    }
}
exports.IdentifierToy = IdentifierToy;
//# sourceMappingURL=toy.model.js.map