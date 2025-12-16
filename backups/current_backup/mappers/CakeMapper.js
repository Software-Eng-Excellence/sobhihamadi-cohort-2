"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonRequestCakeMapper = exports.SQLITECakeMapper = exports.CSVCakeMapper = void 0;
const cake_builder_1 = require("../model/builders/cake.builder");
class CSVCakeMapper {
    map(data) {
        return cake_builder_1.cakebuilder.newbuilder()
            .settype(data[1])
            .setflavor(data[2])
            .setfilling(data[3])
            .setsize(parseInt(data[4]))
            .setlayers(parseInt(data[5]))
            .setfrostingType(data[6])
            .setfrostingFlavor(data[7])
            .setdecorationType(data[8])
            .setdecorationColor(data[9])
            .setcustomMessage(data[10])
            .setshape(data[11])
            .setallergies(data[12])
            .setspecialIngredients(data[13])
            .setpackagingType(data[14])
            .build();
    }
    reverseMap(data) {
        return [
            data.getType(),
            data.getFlavor(),
            data.getFilling(),
            data.getSize().toString(),
            data.getLayers().toString(),
            data.getFrostingType(),
            data.getFrostingFlavor(),
            data.getDecorationType(),
            data.getDecorationColor(),
            data.getCustomMessage(),
            data.getShape(),
            data.getAllergies(),
            data.getSpecialIngredients(),
            data.getPackagingType()
        ];
    }
}
exports.CSVCakeMapper = CSVCakeMapper;
class SQLITECakeMapper {
    map(data) {
        return cake_builder_1.IdentifierCakeBuilder.newbuilder()
            .SetId(data.id)
            .SetCake(cake_builder_1.cakebuilder.newbuilder()
            .settype(data.type)
            .setflavor(data.flavor)
            .setfilling(data.filling)
            .setsize(data.size)
            .setlayers(data.layers)
            .setfrostingType(data.frostingType)
            .setfrostingFlavor(data.frostingFlavor)
            .setdecorationType(data.decorationType)
            .setdecorationColor(data.decorationColor)
            .setcustomMessage(data.customMessage)
            .setshape(data.shape)
            .setallergies(data.allergies)
            .setspecialIngredients(data.specialIngredients)
            .setpackagingType(data.packagingType)
            .build())
            .Build();
    }
    reverseMap(data) {
        return {
            id: data.getid(),
            type: data.getType(),
            flavor: data.getFlavor(),
            filling: data.getFilling(),
            size: data.getSize(),
            layers: data.getLayers(),
            frostingType: data.getFrostingType(),
            frostingFlavor: data.getFrostingFlavor(),
            decorationType: data.getDecorationType(),
            decorationColor: data.getDecorationColor(),
            customMessage: data.getCustomMessage(),
            shape: data.getShape(),
            allergies: data.getAllergies(),
            specialIngredients: data.getSpecialIngredients(),
            packagingType: data.getPackagingType()
        };
    }
}
exports.SQLITECakeMapper = SQLITECakeMapper;
class JsonRequestCakeMapper {
    map(data) {
        const cake = cake_builder_1.cakebuilder.newbuilder()
            .settype(data.type)
            .setflavor(data.flavor)
            .setfilling(data.filling)
            .setsize(data.size)
            .setlayers(data.layers)
            .setfrostingType(data.frostingType)
            .setfrostingFlavor(data.frostingFlavor)
            .setdecorationType(data.decorationType)
            .setdecorationColor(data.decorationColor)
            .setcustomMessage(data.customMessage)
            .setshape(data.shape)
            .setallergies(data.allergies)
            .setspecialIngredients(data.specialIngredients)
            .setpackagingType(data.packagingType)
            .build();
        return cake_builder_1.IdentifierCakeBuilder.newbuilder()
            .SetId(data.id)
            .SetCake(cake)
            .Build();
    }
    reverseMap(data) {
        return {
            id: data.getid(),
            type: data.getType(),
            flavor: data.getFlavor(),
            filling: data.getFilling(),
            size: data.getSize(),
            layers: data.getLayers(),
            frostingType: data.getFrostingType(),
            frostingFlavor: data.getFrostingFlavor(),
            decorationType: data.getDecorationType(),
            decorationColor: data.getDecorationColor(),
            customMessage: data.getCustomMessage(),
            shape: data.getShape(),
            allergies: data.getAllergies(),
            specialIngredients: data.getSpecialIngredients(),
            packagingType: data.getPackagingType()
        };
    }
}
exports.JsonRequestCakeMapper = JsonRequestCakeMapper;
//# sourceMappingURL=CakeMapper.js.map