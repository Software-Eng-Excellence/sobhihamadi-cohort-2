import { IMapper } from './IMapper';
import { IdentifierToy, Toy } from '../model/toy.model';
import { IdentifierToyBuilder, ToyBuilder } from '../model/builders/toy.builder';


export class XMLToyMapper implements IMapper<string[], Toy> {
    reverseMap(data: Toy): string[] {
        throw new Error('Method not implemented.');
    }
    [x: string]: any;

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

    export interface IToyMapper{
        id: string,
        type: string,
        ageGroup: string,
         brand: string,
        material: string,
         batteryRequired: boolean,
         educational: boolean,

    }
    export class PostgreToyMapper implements IMapper<IToyMapper,Toy>{
        map(data: IToyMapper): IdentifierToy {
            return IdentifierToyBuilder.newBuilder()
            .setid(data.id)
            .setToy(
                ToyBuilder.newBuilder()
                .setAgeGroup(data.ageGroup)
                .setBatteryRequired(data.batteryRequired)
                .setBrand(data.brand).setEducational(data.educational)
                .setMaterial(data.material).setType(data.type)
                .build()
             
            )
            .build()
        }
        reverseMap(data: Toy): IToyMapper {
            throw new Error('Method not implemented.');
        }
        
    }