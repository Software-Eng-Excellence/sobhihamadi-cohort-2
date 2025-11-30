import logger from '../../util/logger';
import { Cake } from '../../model/cake.model';



export class cakebuilder {
    private _type!: string;
    private _flavor!: string;
    private _filling!: string;
    private _size!: number;
    private _layers!: number;
    private _frostingType!: string;
    private _frostingFlavor!: string;
    private _decorationType!: string;
    private _decorationColor!: string;
    private _customMessage!: string;
    private _shape!: string;
    private _allergies!: string;
    private _specialIngredients!: string;
    private _packagingType!: string;

    public static newbuilder(): cakebuilder {
        return new cakebuilder();
    }

    settype(type: string): cakebuilder {
        this._type = type;
        return this;
    }
    setflavor(flavor: string): cakebuilder {
        this._flavor = flavor;
        return this;
    }
    setfilling(filling: string): cakebuilder {
        this._filling = filling;
        return this;
    }
    setsize(size: number): cakebuilder {
        this._size = size;
        return this;
    }
    setlayers(layers: number): cakebuilder {
        this._layers = layers;
        return this;
    }
    setfrostingType(frostingType: string): cakebuilder {
        this._frostingType = frostingType;
        return this;
    }
    setfrostingFlavor(frostingFlavor: string): cakebuilder {
        this._frostingFlavor = frostingFlavor;
        return this;
    }
    setdecorationType(decorationType: string): cakebuilder {
        this._decorationType = decorationType;
        return this;
    }
    setdecorationColor(decorationColor: string): cakebuilder {
        this._decorationColor = decorationColor;
        return this;
    }
    setcustomMessage(customMessage: string): cakebuilder {
        this._customMessage = customMessage;
        return this;
    }
    setshape(shape: string): cakebuilder {
        this._shape = shape;
        return this;
    }
    setallergies(allergies: string): cakebuilder {
        this._allergies = allergies;
        return this;
    }
    setspecialIngredients(specialIngredients: string): cakebuilder {
        this._specialIngredients = specialIngredients;
        return this;
    }
    setpackagingType(packagingType: string): cakebuilder {
        this._packagingType = packagingType;
        return this;
    }
    build(): Cake {
    const requiredFields = [
        this._type,
        this._flavor,
        this._filling,
        this._size,
        this._layers,
        this._frostingType,
        this._frostingFlavor,
        this._decorationType,
        this._decorationColor,
        this._customMessage,
        this._shape,
        this._allergies,
        this._specialIngredients,
        this._packagingType
    ];
    for (const field of requiredFields) {
        if (field === undefined || field === null) {
            logger.error('Required field is missing');
            throw new Error('Required field is missing');
        }
    }
    return new Cake(
        this._type,
        this._flavor,
        this._filling,
        this._size,
        this._layers,   
        this._frostingType,
        this._frostingFlavor,
        this._decorationType,
        this._decorationColor,
        this._customMessage,
        this._shape,
        this._allergies,
        this._specialIngredients,
        this._packagingType
    );
}

    
};
