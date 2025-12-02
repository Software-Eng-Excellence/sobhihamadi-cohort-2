import { cakebuilder, IdentifierCakeBuilder } from "../../src/model/builders/cake.builder";
import { CakeRepositoryPostgre } from "../../src/repository/PostgreSQL/CakeRepositoryP";
import { ConnectionManager } from "../../src/repository/PostgreSQL/PostgreConnection";

describe("CakeRepositoryPostgre", () => {
  const repo = new CakeRepositoryPostgre();

  beforeAll(async () => {
    await repo.init();
  });

  beforeEach(async () => {
    const conn = await ConnectionManager.getPostgreConnection();
    await conn.query("TRUNCATE TABLE cake RESTART IDENTITY CASCADE;");
  });
  afterAll(async () => {
  const conn = await ConnectionManager.getPostgreConnection();
  await conn.end(); // close PostgreSQL connection
});

  it("should create a cake", async () => {
    const cake = cakebuilder
      .newbuilder()
      .settype("Birthday")
      .setflavor("Chocolate")
      .setfilling("Cream")
      .setsize(8)
      .setlayers(2)
      .setfrostingType("Buttercream")
      .setfrostingFlavor("Vanilla")
      .setdecorationType("Sprinkles")
      .setdecorationColor("Rainbow")
      .setcustomMessage("Happy Birthday!")
      .setshape("Round")
      .setallergies("Nuts")
      .setspecialIngredients("Gluten-Free Flour")
      .setpackagingType("Box")
      .build();

    const idCake = IdentifierCakeBuilder
      .newbuilder()
      .SetId(`cake-${Math.random().toString(36).slice(2, 10)}`)
      .SetCake(cake)
      .Build();

    const id = await repo.create(idCake);

    const fetched = await repo.get(id);
    expect(fetched.getid()).toBe(id);
    expect(fetched.getType()).toBe("Birthday");
    expect(fetched.getFlavor()).toBe("Chocolate");
  });

  it("should throw error if a required field is missing", () => {
    const cake = cakebuilder
      .newbuilder()
      .settype("Birthday")
      .setflavor("Chocolate")
      .setfilling("Cream");

    expect(() => cake.build()).toThrow("Required field is missing");
  });

  it("should fail to create a cake with duplicate ID", async () => {
    const cakeCore = cakebuilder
      .newbuilder()
      .settype("Birthday")
      .setflavor("Chocolate")
      .setfilling("Cream")
      .setsize(8)
      .setlayers(2)
      .setfrostingType("Buttercream")
      .setfrostingFlavor("Vanilla")
      .setdecorationType("Sprinkles")
      .setdecorationColor("Rainbow")
      .setcustomMessage("Happy Birthday!")
      .setshape("Round")
      .setallergies("Nuts")
      .setspecialIngredients("Flour")
      .setpackagingType("Box")
      .build();

    const id = `cake-${Math.random().toString(36).slice(2, 10)}`;
    const cake1 = IdentifierCakeBuilder.newbuilder().SetId(id).SetCake(cakeCore).Build();
    const cake2 = IdentifierCakeBuilder.newbuilder().SetId(id).SetCake(cakeCore).Build();

    await repo.create(cake1);
    await expect(repo.create(cake2)).rejects.toBeTruthy();
  });

  it("should rollback transaction if creation fails", async () => {
    const conn = await ConnectionManager.getPostgreConnection();
    const repo = new CakeRepositoryPostgre();
    await conn.query("BEGIN");

    try {
      const cake1 = cakebuilder
        .newbuilder()
        .settype("Birthday")
        .setflavor("Chocolate")
        .setfilling("Cream")
        .setsize(8)
        .setlayers(2)
        .setfrostingType("Buttercream")
        .setfrostingFlavor("Vanilla")
        .setdecorationType("Sprinkles")
        .setdecorationColor("Rainbow")
        .setcustomMessage("Happy Birthday!")
        .setshape("Round")
        .setallergies("Nuts")
        .setspecialIngredients("Flour")
        .setpackagingType("Box")
        .build();

      const id = "cake-rollback";
      const cakeEntity = IdentifierCakeBuilder.newbuilder().SetId(id).SetCake(cake1).Build();
      await repo.create(cakeEntity);

      const duplicate = IdentifierCakeBuilder.newbuilder().SetId(id).SetCake(cake1).Build();
      await repo.create(duplicate);

      throw new Error("Transaction did not rollback");
    } catch {
      await conn.query("ROLLBACK");
    }

    const result = await conn.query("SELECT * FROM cake WHERE id = 'cake-rollback'");
    expect(result.rows.length).toBe(0);
  });

  it("should get all cakes", async () => {
    const cake1 = cakebuilder
      .newbuilder()
      .settype("Birthday")
      .setflavor("Chocolate")
      .setfilling("Cream")
      .setsize(8)
      .setlayers(2)
      .setfrostingType("Buttercream")
      .setfrostingFlavor("Vanilla")
      .setdecorationType("Sprinkles")
      .setdecorationColor("Rainbow")
      .setcustomMessage("Cake One")
      .setshape("Round")
      .setallergies("Nuts")
      .setspecialIngredients("Sugar")
      .setpackagingType("Box")
      .build();

    const cake2 = cakebuilder
      .newbuilder()
      .settype("Wedding")
      .setflavor("Vanilla")
      .setfilling("Strawberry")
      .setsize(10)
      .setlayers(3)
      .setfrostingType("Fondant")
      .setfrostingFlavor("Almond")
      .setdecorationType("Flowers")
      .setdecorationColor("White")
      .setcustomMessage("Cake Two")
      .setshape("Square")
      .setallergies("None")
      .setspecialIngredients("Vanilla Beans")
      .setpackagingType("Wrap")
      .build();

    await repo.create(IdentifierCakeBuilder.newbuilder().SetId("cake-1").SetCake(cake1).Build());
    await repo.create(IdentifierCakeBuilder.newbuilder().SetId("cake-2").SetCake(cake2).Build());

    const all = await repo.getall();
    expect(all.length).toBe(2);
  });

  it("should update a cake", async () => {
    const cake = cakebuilder
      .newbuilder()
      .settype("Birthday")
      .setflavor("Chocolate")
      .setfilling("Cream")
      .setsize(8)
      .setlayers(2)
      .setfrostingType("Buttercream")
      .setfrostingFlavor("Vanilla")
      .setdecorationType("Sprinkles")
      .setdecorationColor("Rainbow")
      .setcustomMessage("Before Update")
      .setshape("Round")
      .setallergies("Nuts")
      .setspecialIngredients("Flour")
      .setpackagingType("Box")
      .build();

    const id = "cake-update";
    const entity = IdentifierCakeBuilder.newbuilder().SetId(id).SetCake(cake).Build();
    await repo.create(entity);

    // change a property
    (entity as any)._customMessage = "After Update";
    await repo.update(entity);

    const updated = await repo.get(id);
    expect(updated.getCustomMessage()).toBe("After Update");
  });

  it("should delete a cake", async () => {
    const cake = cakebuilder
      .newbuilder()
      .settype("Birthday")
      .setflavor("Chocolate")
      .setfilling("Cream")
      .setsize(8)
      .setlayers(2)
      .setfrostingType("Buttercream")
      .setfrostingFlavor("Vanilla")
      .setdecorationType("Sprinkles")
      .setdecorationColor("Rainbow")
      .setcustomMessage("Delete Me")
      .setshape("Round")
      .setallergies("Nuts")
      .setspecialIngredients("Flour")
      .setpackagingType("Box")
      .build();

    const id = "cake-delete";
    const entity = IdentifierCakeBuilder.newbuilder().SetId(id).SetCake(cake).Build();

    await repo.create(entity);
    await repo.delete(id);

    await expect(repo.get(id)).rejects.toThrow();
  });
});
