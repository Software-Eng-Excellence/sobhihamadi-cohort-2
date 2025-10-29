import { PostgreBookMapper } from "../../src/mappers/BookMapper";
import { ItemCategory } from "../../src/model/IItem";

import { FactoryMapper } from "../../src/mappers/factorymapper";
import { SQLITECakeMapper } from "../../src/mappers/CakeMapper";
import { PostgreToyMapper } from "../../src/mappers/ToyMapper";
describe("FactoryMapper", () => {
  it(" should return PostgreBookMapper", () => {
    const mapper = FactoryMapper.create(ItemCategory.Book);
    expect(mapper).toBeInstanceOf(PostgreBookMapper);
   
  });

  it("Cake -> SQLITECakeMapper", () => {
    const mapper = FactoryMapper.create(ItemCategory.Cake);
    expect(mapper).toBeInstanceOf(SQLITECakeMapper);
   
  });

  it("Toy -> PostgreToyMapper", () => {
    const mapper = FactoryMapper.create(ItemCategory.Toy);
    expect(mapper).toBeInstanceOf(PostgreToyMapper);
   
  });

  it("Invalid category throws", () => {
    expect(() => FactoryMapper.create("InvalidCategory" as ItemCategory))
      .toThrow(/No mapper found|Unknown category|Invalid category/);
  });
});
