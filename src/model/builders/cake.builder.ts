import logger from '../../util/logger';
import { Cake, identifierCake } from '../../model/cake.model';



export class cakebuilder {
    private type!: string;
    private flavor!: string;
    private filling!: string;
    private size!: number;
    private layers!: number;
    private frostingType!: string;
    private frostingFlavor!: string;
    private decorationType!: string;
    private decorationColor!: string;
    private customMessage!: string;
    private shape!: string;
    private allergies!: string;
    private specialIngredients!: string;
    private packagingType!: string;

    public static newbuilder(): cakebuilder {
        return new cakebuilder();
    }

    settype(type: string): cakebuilder {
        this.type = type;
        return this;
    }
    setflavor(flavor: string): cakebuilder {
        this.flavor = flavor;
        return this;
    }
    setfilling(filling: string): cakebuilder {
        this.filling = filling;
        return this;
    }
    setsize(size: number): cakebuilder {
        this.size = size;
        return this;
    }
    setlayers(layers: number): cakebuilder {
        this.layers = layers;
        return this;
    }
    setfrostingType(frostingType: string): cakebuilder {
        this.frostingType = frostingType;
        return this;
    }
    setfrostingFlavor(frostingFlavor: string): cakebuilder {
        this.frostingFlavor = frostingFlavor;
        return this;
    }
    setdecorationType(decorationType: string): cakebuilder {
        this.decorationType = decorationType;
        return this;
    }
    setdecorationColor(decorationColor: string): cakebuilder {
        this.decorationColor = decorationColor;
        return this;
    }
    setcustomMessage(customMessage: string): cakebuilder {
        this.customMessage = customMessage;
        return this;
    }
    setshape(shape: string): cakebuilder {
        this.shape = shape;
        return this;
    }
    setallergies(allergies: string): cakebuilder {
        this.allergies = allergies;
        return this;
    }
    setspecialIngredients(specialIngredients: string): cakebuilder {
        this.specialIngredients = specialIngredients;
        return this;
    }
    setpackagingType(packagingType: string): cakebuilder {
        this.packagingType = packagingType;
        return this;
    }
   build(): Cake {
    
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
            logger.error('Required field is missing');
            throw new Error('Required field is missing');
        }
    }

   

    return new Cake(
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
    );
}
    
};
export class IdentifierCakeBuilder {
    private _id!: string;
    private cake!: Cake;

    static newbuilder(): IdentifierCakeBuilder {
        return new IdentifierCakeBuilder();
    }

    SetId(id: string): IdentifierCakeBuilder {
        if (!id) {
            logger.error('ID cannot be empty');
            throw new Error('ID cannot be empty');
        }
        this._id = id;
        return this;
    }

    SetCake(cake: Cake): IdentifierCakeBuilder {
        if (!cake) {
            logger.error('Cake cannot be null');
            throw new Error('Cake cannot be null');
        }
        this.cake = cake;
        return this;
    }

    Build(): identifierCake {
        // Validate required fields
        if (!this._id || !this.cake) {
            logger.error('ID or Cake is missing');
            throw new Error('ID or Cake is missing');
        }


        return new identifierCake(
            this._id,
            this.cake.getType(),
            this.cake.getFlavor(),
            this.cake.getFilling(),
            this.cake.getSize(),
            this.cake.getLayers(),
            this.cake.getFrostingType(),
            this.cake.getFrostingFlavor(),
            this.cake.getDecorationType(),
            this.cake.getDecorationColor(),
           this.cake.getCustomMessage(),
            this.cake.getShape(),
           this.cake.getAllergies(),
           this.cake.getSpecialIngredients(),
            this.cake.getPackagingType()
        );
    }   
}