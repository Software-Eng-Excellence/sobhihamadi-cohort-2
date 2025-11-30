import { Book } from '../../src/model/book.model';
import { cakebuilder } from '../../src/model/builders/cake.builder';
import { Cake } from '../../src/model/cake.model';


describe('CakeBuilder', () => {
    it('should build a cake object with all properties', () => {
        const newCake = new cakebuilder()
            .settype("Birthday")
            .setflavor("Chocolate")
            .setfilling("Vanilla")
            .setsize(8)
            .setlayers(3)
            .setfrostingType("Buttercream")
            .setfrostingFlavor("Chocolate")
            .setdecorationType("Sprinkles")
            .setdecorationColor("Rainbow")
            .setcustomMessage("Happy Birthday!")
            .setshape("Round")
            .setallergies("None")
            .setspecialIngredients("Organic")
            .setpackagingType("Box")
            .build();

        const expectedCake = new Cake(
            "Birthday","Chocolate","Vanilla",8,3,"Buttercream","Chocolate","Sprinkles",
            "Rainbow","Happy Birthday!","Round","None","Organic","Box"
            
        );
        expect(newCake).toEqual(expectedCake);

          

    });
    it('should throw an error if a required field is missing', () => {
        const newCake2 = new cakebuilder()
            .settype("Birthday")
            .setflavor("Chocolate");
        expect(() => newCake2.build()).toThrow('Required field is missing');

});

});