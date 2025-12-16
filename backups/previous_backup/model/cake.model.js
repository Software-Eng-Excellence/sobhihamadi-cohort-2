"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.identifierCake = exports.Cake = void 0;
const IItem_1 = require("./IItem");
class Cake {
    getCategory() {
        return IItem_1.ItemCategory.Cake;
    }
    constructor(type, flavor, filling, size, layers, frostingType, frostingFlavor, decorationType, decorationColor, customMessage, shape, allergies, specialIngredients, packagingType) {
        this.type = type;
        this.flavor = flavor;
        this.filling = filling;
        this.size = size;
        this.layers = layers;
        this.frostingType = frostingType;
        this.frostingFlavor = frostingFlavor;
        this.decorationType = decorationType;
        this.decorationColor = decorationColor;
        this.customMessage = customMessage;
        this.shape = shape;
        this.allergies = allergies;
        this.specialIngredients = specialIngredients;
        this.packagingType = packagingType;
    }
    getType() {
        return this.type;
    }
    getFlavor() {
        return this.flavor;
    }
    getFilling() {
        return this.filling;
    }
    getSize() {
        return this.size;
    }
    getLayers() {
        return this.layers;
    }
    getFrostingType() {
        return this.frostingType;
    }
    getFrostingFlavor() {
        return this.frostingFlavor;
    }
    getDecorationType() {
        return this.decorationType;
    }
    getDecorationColor() {
        return this.decorationColor;
    }
    getCustomMessage() {
        return this.customMessage;
    }
    getShape() {
        return this.shape;
    }
    getAllergies() {
        return this.allergies;
    }
    getSpecialIngredients() {
        return this.specialIngredients;
    }
    getPackagingType() {
        return this.packagingType;
    }
}
exports.Cake = Cake;
class identifierCake extends Cake {
    constructor(id, type, flavor, filling, size, layers, frostingType, frostingFlavor, decorationType, decorationColor, customMessage, shape, allergies, specialIngredients, packagingType) {
        super(type, flavor, filling, size, layers, frostingType, frostingFlavor, decorationType, decorationColor, customMessage, shape, allergies, specialIngredients, packagingType);
        this.id = id;
    }
    getid() {
        return this.id;
    }
}
exports.identifierCake = identifierCake;
//# sourceMappingURL=cake.model.js.map