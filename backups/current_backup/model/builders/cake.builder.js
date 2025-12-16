"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentifierCakeBuilder = exports.cakebuilder = void 0;
const logger_1 = __importDefault(require("../../util/logger"));
const cake_model_1 = require("../../model/cake.model");
class cakebuilder {
    static newbuilder() {
        return new cakebuilder();
    }
    settype(type) {
        this.type = type;
        return this;
    }
    setflavor(flavor) {
        this.flavor = flavor;
        return this;
    }
    setfilling(filling) {
        this.filling = filling;
        return this;
    }
    setsize(size) {
        this.size = size;
        return this;
    }
    setlayers(layers) {
        this.layers = layers;
        return this;
    }
    setfrostingType(frostingType) {
        this.frostingType = frostingType;
        return this;
    }
    setfrostingFlavor(frostingFlavor) {
        this.frostingFlavor = frostingFlavor;
        return this;
    }
    setdecorationType(decorationType) {
        this.decorationType = decorationType;
        return this;
    }
    setdecorationColor(decorationColor) {
        this.decorationColor = decorationColor;
        return this;
    }
    setcustomMessage(customMessage) {
        this.customMessage = customMessage;
        return this;
    }
    setshape(shape) {
        this.shape = shape;
        return this;
    }
    setallergies(allergies) {
        this.allergies = allergies;
        return this;
    }
    setspecialIngredients(specialIngredients) {
        this.specialIngredients = specialIngredients;
        return this;
    }
    setpackagingType(packagingType) {
        this.packagingType = packagingType;
        return this;
    }
    build() {
        const requiredFields = [
            this.type,
            this.flavor,
            this.filling,
            this.size,
            this.layers,
            this.frostingType,
            this.frostingFlavor,
            this.decorationType,
            this.decorationColor,
            this.customMessage,
            this.shape,
            this.allergies,
            this.specialIngredients,
            this.packagingType
        ];
        for (const field of requiredFields) {
            if (field === undefined || field === null) {
                logger_1.default.error('Required field is missing');
                throw new Error('Required field is missing');
            }
        }
        return new cake_model_1.Cake(this.type, this.flavor, this.filling, this.size, this.layers, this.frostingType, this.frostingFlavor, this.decorationType, this.decorationColor, this.customMessage, this.shape, this.allergies, this.specialIngredients, this.packagingType);
    }
}
exports.cakebuilder = cakebuilder;
;
class IdentifierCakeBuilder {
    static newbuilder() {
        return new IdentifierCakeBuilder();
    }
    SetId(id) {
        if (!id) {
            logger_1.default.error('ID cannot be empty');
            throw new Error('ID cannot be empty');
        }
        this._id = id;
        return this;
    }
    SetCake(cake) {
        if (!cake) {
            logger_1.default.error('Cake cannot be null');
            throw new Error('Cake cannot be null');
        }
        this.cake = cake;
        return this;
    }
    Build() {
        // Validate required fields
        if (!this._id || !this.cake) {
            logger_1.default.error('ID or Cake is missing');
            throw new Error('ID or Cake is missing');
        }
        return new cake_model_1.identifierCake(this._id, this.cake.getType(), this.cake.getFlavor(), this.cake.getFilling(), this.cake.getSize(), this.cake.getLayers(), this.cake.getFrostingType(), this.cake.getFrostingFlavor(), this.cake.getDecorationType(), this.cake.getDecorationColor(), this.cake.getCustomMessage(), this.cake.getShape(), this.cake.getAllergies(), this.cake.getSpecialIngredients(), this.cake.getPackagingType());
    }
}
exports.IdentifierCakeBuilder = IdentifierCakeBuilder;
//# sourceMappingURL=cake.builder.js.map