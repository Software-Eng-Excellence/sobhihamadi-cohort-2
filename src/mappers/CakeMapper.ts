import { cakebuilder } from '../model/builders/cake.builder';
import { Cake } from '../model/cake.model';
import { IMapper } from './IMapper';


export class CSVCakeMapper implements IMapper<string[], Cake> {
     [x: string]: any;

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
}
    