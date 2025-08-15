import logger from '../../util/logger';
import { Toy } from '../../model/toy.model';

export class ToyBuilder {
    private _type!: string;
    private _ageGroup!: string;
    private _brand!: string;
    private _material!: string;
    private _batteryRequired!: boolean;
    private _educational!: boolean;

    setType(type: string): ToyBuilder {
        this._type = type;
        return this;
    }
    setAgeGroup(ageGroup: string): ToyBuilder {
        this._ageGroup = ageGroup;
        return this;
    }
    setBrand(brand: string): ToyBuilder {
        this._brand = brand;
        return this;
    }
    setMaterial(material: string): ToyBuilder {
        this._material = material;
        return this;
    }
    setBatteryRequired(batteryRequired: boolean): ToyBuilder {
        this._batteryRequired = batteryRequired;
        return this;
    }
    setEducational(educational: boolean): ToyBuilder {
        this._educational = educational;
        return this;
    }
    build(): Toy {
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
                logger.error('Required field is missing');
                throw new Error('Required field is missing');
            }
        }
        return new Toy(
            this._type,
            this._ageGroup,
            this._brand,
            this._material,
            this._batteryRequired,
            this._educational
        );
    }
};
