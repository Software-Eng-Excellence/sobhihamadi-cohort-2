import { ID } from "repository/IRepository";
import { identifierItem, IItem, ItemCategory } from "./IItem";




export class Cake implements IItem {
    
    getCategory(): ItemCategory {
        return ItemCategory.Cake;
    }

    private _type: string;
    private _flavor: string;
    private _filling: string;
    private _size: number;
    private _layers: number;
    private _frostingType: string;
    private _frostingFlavor: string;
    private _decorationType: string;
    private _decorationColor: string;
    private _customMessage: string;
    private _shape: string;
    private _allergies: string;
    private _specialIngredients: string;
    private _packagingType: string;
    
    constructor(
        type: string,
        flavor: string,
        filling: string,
        size: number,
        layers: number,
        frostingType: string,
        frostingFlavor: string,
        decorationType: string,
        decorationColor: string,
        customMessage: string,
        shape: string,
        allergies: string,
        specialIngredients: string,
        packagingType: string,
    
    ) {
        this._type = type;
        this._flavor = flavor;
        this._filling = filling;
        this._size = size;
        this._layers = layers;
        this._frostingType = frostingType;
        this._frostingFlavor = frostingFlavor;
        this._decorationType = decorationType;
        this._decorationColor = decorationColor;
        this._customMessage = customMessage;
        this._shape = shape;
        this._allergies = allergies;
        this._specialIngredients = specialIngredients;
        this._packagingType = packagingType;
        
    }

    getType(): string {
        return this._type;
    }

    getFlavor(): string {
        return this._flavor;
    }

    getFilling(): string {
        return this._filling;
    }

    getSize(): number {
        return this._size;
    }

    getLayers(): number {
        return this._layers;
    }

    getFrostingType(): string {
        return this._frostingType;
    }

    getFrostingFlavor(): string {
        return this._frostingFlavor;
    }

    getDecorationType(): string {
        return this._decorationType;
    }

    getDecorationColor(): string {
        return this._decorationColor;
    }

    getCustomMessage(): string {
        return this._customMessage;
    }

    getShape(): string {
        return this._shape;
    }

    getAllergies(): string {
        return this._allergies;
    }

    getSpecialIngredients(): string {
        return this._specialIngredients;
    }

    getPackagingType(): string {
        return this._packagingType;
    }

    


}
export class identifierCake extends Cake implements identifierItem {

    constructor(
        private id: ID,
        type: string,
        flavor: string,
        filling: string,
        size: number,
        layers: number,
        frostingType: string,
        frostingFlavor: string,
        decorationType: string,
        decorationColor: string,
        customMessage: string,
        shape: string,
        allergies: string,
        specialIngredients: string,
        packagingType: string,
    ) {
        super(
            type,
            flavor,
            filling,
            size,
            layers,
            frostingType,
            frostingFlavor,
            decorationType,
            decorationColor,
            customMessage,
            shape,
            allergies,
            specialIngredients,
            packagingType
        );
    }
   
    getid(): ID {
        return this.id;
    }
}
