import { ToyBuilder } from '../../src/model/builders/toy.builder';
import { Toy } from '../../src/model/toy.model';
describe('ToyBuilder', () => {
    it('should build a toy object with all properties', () => {
        const newToy = new ToyBuilder()
            .setType("Action Figure")
            .setAgeGroup("6-12")
            .setBrand("ToyBrand")
            .setMaterial("Plastic")
            .setBatteryRequired(false)
            .setEducational(true)
            .build();

        const expectedToy = new Toy(
            "Action Figure",
            "6-12",
            "ToyBrand",
            "Plastic",
            false,
            true
        );
        expect(newToy).toEqual(expectedToy);

    });
    it('should throw an error if a required field is missing', () => {
        const newToy2 = new ToyBuilder()
            .setType("Action Figure")
            .setAgeGroup("6-12");
        expect(() => newToy2.build()).toThrow('Required field is missing');
    });           


});