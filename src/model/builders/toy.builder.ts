import logger from '../../util/logger';
import { IdentifierToy, Toy } from '../../model/toy.model';

export class ToyBuilder {
    private _type!: string;
    private _ageGroup!: string;
    private _brand!: string;
    private _material!: string;
    private _batteryRequired!: boolean;
    private _educational!: boolean;

    public static newBuilder(): ToyBuilder {
        return new ToyBuilder();
    }

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

export class IdentifierToyBuilder {
    private id!: string;
    private toy!: Toy;

    public static newBuilder(): IdentifierToyBuilder {
        return new IdentifierToyBuilder();
    }
    setid(id: string): IdentifierToyBuilder {
           if (!id) {
            logger.error('ID cannot be empty');
            throw new Error('ID cannot be empty');
        }
        this.id = id;
        return this;
    }
    setToy(toy: Toy): IdentifierToyBuilder {
        this.toy = toy;
        return this;
    }   
    build(): IdentifierToy {
        if (!this.id || !this.toy) {
            logger.error('Identifier is missing');
            throw new Error('Identifier is missing');
        }
        return new IdentifierToy(
            this.id,
            this.toy.getType(),
            this.toy.getAgeGroup(),
            this.toy.getBrand(),
            this.toy.getMaterial(),
            this.toy.getBatteryRequired(),
            this.toy.getEducational()
            
        );
    }
}
