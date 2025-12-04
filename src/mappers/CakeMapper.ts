
import { cakebuilder, IdentifierCakeBuilder } from '../model/builders/cake.builder';
import { Cake, identifierCake } from '../model/cake.model';
import { IMapper } from './IMapper';



export class CSVCakeMapper implements IMapper<string[], Cake> {
 

     map(data: string[]): Cake {

    return cakebuilder.newbuilder()
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
     reverseMap(data: Cake): string[] {
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
export interface ISQliteCake {
   id: string;
   type: string;           
   flavor: string;
   filling: string;
   size: number;
   layers: number;
   frostingType: string;
   frostingFlavor: string;
   decorationType: string;
   decorationColor: string;
   customMessage: string;
   shape: string;
   allergies: string;
   specialIngredients: string;
   packagingType: string;
}

export class SQLITECakeMapper implements IMapper<ISQliteCake, Cake> {
  
   map(data: ISQliteCake): identifierCake {
      return IdentifierCakeBuilder.newbuilder()
         .SetId(data.id)
         .SetCake(
            cakebuilder.newbuilder()
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
               .build()
         )
         .Build();
   }


   reverseMap(data: identifierCake): ISQliteCake {
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

export class JsonRequestCakeMapper implements IMapper<ISQliteCake, identifierCake> {
   
    map(data: ISQliteCake): identifierCake {
      
        const cake = cakebuilder.newbuilder()
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
        return IdentifierCakeBuilder.newbuilder()
            .SetId(data.id)
            .SetCake(cake)
            .Build();
    }
    reverseMap(data: identifierCake): ISQliteCake {
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
