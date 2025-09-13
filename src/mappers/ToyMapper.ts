import { IMapper } from './IMapper';
import { Toy } from '../model/toy.model';
import { ToyBuilder } from '../model/builders/toy.builder';


export class XMLToyMapper implements IMapper<string[], Toy> {

    map(data: string[]): Toy {  
        return ToyBuilder.newBuilder()
            .setType(data[1])
            .setAgeGroup(data[2])
            .setBrand(data[3])
            .setMaterial(data[4])
            .setBatteryRequired(data[5] === 'true') // Assuming boolean is represented as 'true'/'false'
            .setEducational(data[6] === 'true') // Assuming boolean is represented as 'true'/'false'
            .build();
            
    }}