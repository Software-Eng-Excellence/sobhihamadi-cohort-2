import { Toy } from "../../src/model/toy.model";
import { XMLToyMapper } from "../../src/mappers/ToyMapper";
describe('Toy Mapper', () => {
    it('should map JSON object to Toy object correctly', () => {
        const mapper = new XMLToyMapper();
        const toy = mapper.map(["", "Action Figure","8-12","FunToys","Plastic","true","false"]);
            
        const expectedToy = new Toy(
            "Action Figure",
            "8-12",
            "FunToys",
            "Plastic",
            true,
            false
        );
        expect(toy).toEqual(expectedToy);
        

    }),
        it('should throw an error if a required field is missing', () => {
            const mapper2 = new XMLToyMapper();
            expect(() => mapper2.map(["", "Action Figure","8-12"])).toThrow('Required field is missing');
           
        })
    });