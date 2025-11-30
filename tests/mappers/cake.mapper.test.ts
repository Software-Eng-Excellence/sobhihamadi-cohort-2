import { Cake } from "../../src/model/cake.model";
import { CSVCakeMapper } from "../../src/mappers/CakeMapper";
describe('Cake Mapper', () => {
    it('should map CSV row to Cake object correctly', () => {
        const mapper = new CSVCakeMapper();
        const cake = mapper.map(["", "Birthday","Chocolate","Vanilla","8","3","Buttercream","Chocolate","Sprinkles",
        "Rainbow","Happy Birthday!","Round","None","Organic","Box"]);
         

        const expectedCake = new Cake(
            "Birthday","Chocolate","Vanilla",8,3,"Buttercream","Chocolate","Sprinkles",
            "Rainbow","Happy Birthday!","Round","None","Organic","Box"
            
        );
        expect(cake).toEqual(expectedCake);
        

    }),
        it('should throw an error if a required field is missing', () => {
            const mapper2 = new CSVCakeMapper();
            expect(() => mapper2.map(["", "Birthday","Chocolate"])).toThrow('Required field is missing');
        })
    });