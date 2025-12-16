"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentifierToyBuilder = exports.ToyBuilder = void 0;
const logger_1 = __importDefault(require("../../util/logger"));
const toy_model_1 = require("../../model/toy.model");
class ToyBuilder {
    static newBuilder() {
        return new ToyBuilder();
    }
    setType(type) {
        this._type = type;
        return this;
    }
    setAgeGroup(ageGroup) {
        this._ageGroup = ageGroup;
        return this;
    }
    setBrand(brand) {
        this._brand = brand;
        return this;
    }
    setMaterial(material) {
        this._material = material;
        return this;
    }
    setBatteryRequired(batteryRequired) {
        this._batteryRequired = batteryRequired;
        return this;
    }
    setEducational(educational) {
        this._educational = educational;
        return this;
    }
    build() {
        const requiredFields = [
            this._type,
            this._ageGroup,
            this._brand,
            this._material,
            this._batteryRequired,
            this._educational
        ];
        for (const field of requiredFields) {
            if (field === undefined || field === null || field === '') {
                logger_1.default.error('Required field is missing');
                throw new Error('Required field is missing');
            }
        }
        return new toy_model_1.Toy(this._type, this._ageGroup, this._brand, this._material, this._batteryRequired, this._educational);
    }
}
exports.ToyBuilder = ToyBuilder;
;
class IdentifierToyBuilder {
    static newBuilder() {
        return new IdentifierToyBuilder();
    }
    setid(id) {
        if (!id) {
            logger_1.default.error('ID cannot be empty');
            throw new Error('ID cannot be empty');
        }
        this.id = id;
        return this;
    }
    setToy(toy) {
        this.toy = toy;
        return this;
    }
    build() {
        if (!this.id || !this.toy) {
            logger_1.default.error('Identifier is missing');
            throw new Error('Identifier is missing');
        }
        return new toy_model_1.IdentifierToy(this.id, this.toy.getType(), this.toy.getAgeGroup(), this.toy.getBrand(), this.toy.getMaterial(), this.toy.getBatteryRequired(), this.toy.getEducational());
    }
}
exports.IdentifierToyBuilder = IdentifierToyBuilder;
//# sourceMappingURL=toy.builder.js.map