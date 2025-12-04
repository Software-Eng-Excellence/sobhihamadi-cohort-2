// tests/Postgresql/CakePostgre.test.ts

import { cakebuilder, IdentifierCakeBuilder } from "../../src/model/builders/cake.builder";
import { CakeRepositoryPostgre } from "../../src/repository/PostgreSQL/CakeRepositoryP";

// 1. Mock PostgreConnection BEFORE importing it in the test
jest.mock("../../src/repository/PostgreSQL/PostgreConnection", () => {
  // In-memory "cake" table
  const cakes = new Map<string, any>();

  const pool = {
    query: jest.fn(async (sql: string, params?: any[]) => {
      const trimmed = sql.trim();

      // CREATE TABLE IF NOT EXISTS cake (...)
      if (trimmed.startsWith("CREATE TABLE IF NOT EXISTS cake")) {
        return { rows: [] };
      }

      // TRUNCATE TABLE cake RESTART IDENTITY CASCADE;
      if (trimmed.startsWith("TRUNCATE TABLE cake")) {
        cakes.clear();
        return { rows: [] };
      }

      // BEGIN / ROLLBACK (if you use transactions in tests)
      if (trimmed === "BEGIN" || trimmed === "ROLLBACK") {
        return { rows: [] };
      }

      // INSERT INTO cake (...)
      if (trimmed.startsWith("INSERT INTO cake")) {
        const [
          id,
          type,
          flavor,
          filling,
          size,
          layers,
          frostingType,
          frostingFlavor,
          decorationType,
          decorationColor,
          customMessage,
          shape,
          allergies,
          specialIngredients,
          packagingType,
        ] = params ?? [];

        if (cakes.has(id)) {
          throw new Error('duplicate key value violates unique constraint "cake_pkey"');
        }

        cakes.set(id, {
          id,
          type,
          flavor,
          filling,
          size,
          layers,
          frostingType,
          frostingFlavor,
          decorationType,
          decorationColor,
          customMessage,
          shape,
          allergies,
          specialIngredients,
          packagingType,
        });

        return { rows: [] };
      }

      // UPDATE cake SET ...
      if (trimmed.startsWith("UPDATE cake SET")) {
        const [
          type,
          flavor,
          filling,
          size,
          layers,
          frostingType,
          frostingFlavor,
          decorationType,
          decorationColor,
          customMessage,
          shape,
          allergies,
          specialIngredients,
          packagingType,
          id,
        ] = params ?? [];

        const existing = cakes.get(id);
        if (existing) {
          existing.type = type;
          existing.flavor = flavor;
          existing.filling = filling;
          existing.size = size;
          existing.layers = layers;
          existing.frostingType = frostingType;
          existing.frostingFlavor = frostingFlavor;
          existing.decorationType = decorationType;
          existing.decorationColor = decorationColor;
          existing.customMessage = customMessage;
          existing.shape = shape;
          existing.allergies = allergies;
          existing.specialIngredients = specialIngredients;
          existing.packagingType = packagingType;
        }
        return { rows: [] };
      }

      // DELETE FROM cake WHERE id=$1;
      if (trimmed.startsWith("DELETE FROM cake WHERE id")) {
        const [id] = params ?? [];
        cakes.delete(id);
        return { rows: [] };
      }

      // SELECT * FROM cake WHERE id=$1;
      if (trimmed.startsWith("SELECT * FROM cake WHERE id=$1")) {
        const [id] = params ?? [];
        const row = cakes.get(id);
        return { rows: row ? [row] : [] };
      }

      // SELECT * FROM cake WHERE id = 'cake-rollback' (if you do a special query)
      if (trimmed.startsWith("SELECT * FROM cake WHERE id =")) {
        const match = trimmed.match(/WHERE id = '([^']+)'/);
        const id = match ? match[1] : "";
        const row = cakes.get(id);
        return { rows: row ? [row] : [] };
      }

      // SELECT * FROM cake;
      if (trimmed === "SELECT * FROM cake;" || trimmed === "SELECT * FROM cake") {
        return { rows: Array.from(cakes.values()) };
      }

      // default
      return { rows: [] };
    }),
    end: jest.fn(async () => {
      // nothing to close
    }),
  };

  return {
    ConnectionManager: {
      getPostgreConnection: jest.fn().mockResolvedValue(pool),
    },
  };
});

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
    await conn.end();
  });

  it("should create a cake", async () => {
    const cake = cakebuilder
      .newbuilder()
      .settype("Birthday")
      .setflavor("Vanilla")
      .setfilling("Cream")
      .setsize(2)
      .setlayers(3)
      .setfrostingType("Buttercream")
      .setfrostingFlavor("Vanilla")
      .setdecorationType("Sprinkles")
      .setdecorationColor("Red")
      .setcustomMessage("Happy Birthday")
      .setshape("Round")
      .setallergies("None")
      .setspecialIngredients("Strawberries")
      .setpackagingType("Box")
      .build();

    const id = "cake-1";
    const entity = IdentifierCakeBuilder.newbuilder().SetId(id).SetCake(cake).Build();

    const createdId = await repo.create(entity);
    expect(createdId).toBe(id);

    const fetched = await repo.get(id);
    expect(fetched.getid()).toBe(id);
    expect(fetched.getFlavor()).toBe("Vanilla");
    expect(fetched.getType()).toBe("Birthday");
  });

  it("should get all cakes", async () => {
    const a = cakebuilder
      .newbuilder()
      .settype("Wedding")
      .setflavor("Chocolate")
      .setfilling("Ganache")
      .setsize(3)
      .setlayers(4)
      .setfrostingType("Fondant")
      .setfrostingFlavor("Chocolate")
      .setdecorationType("Flowers")
      .setdecorationColor("White")
      .setcustomMessage("Congrats")
      .setshape("Square")
      .setallergies("Nuts")
      .setspecialIngredients("Almonds")
      .setpackagingType("Box")
      .build();

    const b = cakebuilder
      .newbuilder()
      .settype("Birthday")
      .setflavor("Vanilla")
      .setfilling("Cream")
      .setsize(1)
      .setlayers(2)
      .setfrostingType("Buttercream")
      .setfrostingFlavor("Vanilla")
      .setdecorationType("Sprinkles")
      .setdecorationColor("Blue")
      .setcustomMessage("HB")
      .setshape("Round")
      .setallergies("None")
      .setspecialIngredients("Strawberries")
      .setpackagingType("Box")
      .build();

    await repo.create(IdentifierCakeBuilder.newbuilder().SetId("cake-a").SetCake(a).Build());
    await repo.create(IdentifierCakeBuilder.newbuilder().SetId("cake-b").SetCake(b).Build());

    const all = await repo.getall();
    expect(all.length).toBe(2);
  });

  it("should update a cake", async () => {
    const core = cakebuilder
      .newbuilder()
      .settype("Birthday")
      .setflavor("Vanilla")
      .setfilling("Cream")
      .setsize(2)
      .setlayers(3)
      .setfrostingType("Buttercream")
      .setfrostingFlavor("Vanilla")
      .setdecorationType("Sprinkles")
      .setdecorationColor("Red")
      .setcustomMessage("HB")
      .setshape("Round")
      .setallergies("None")
      .setspecialIngredients("Strawberries")
      .setpackagingType("Box")
      .build();

    const id = "cake-update";
    const entity = IdentifierCakeBuilder.newbuilder().SetId(id).SetCake(core).Build();
    await repo.create(entity);

    const updatedCore = cakebuilder
      .newbuilder()
      .settype("Birthday")
      .setflavor("Chocolate") // changed
      .setfilling("Cream")
      .setsize(2)
      .setlayers(3)
      .setfrostingType("Buttercream")
      .setfrostingFlavor("Vanilla")
      .setdecorationType("Sprinkles")
      .setdecorationColor("Red")
      .setcustomMessage("HB")
      .setshape("Round")
      .setallergies("None")
      .setspecialIngredients("Strawberries")
      .setpackagingType("Box")
      .build();

    const updatedEntity = IdentifierCakeBuilder.newbuilder().SetId(id).SetCake(updatedCore).Build();
    await repo.update(updatedEntity);

    const updated = await repo.get(id);
    expect(updated.getFlavor()).toBe("Chocolate");
  });

  it("should delete a cake", async () => {
    const core = cakebuilder
      .newbuilder()
      .settype("Birthday")
      .setflavor("Vanilla")
      .setfilling("Cream")
      .setsize(2)
      .setlayers(3)
      .setfrostingType("Buttercream")
      .setfrostingFlavor("Vanilla")
      .setdecorationType("Sprinkles")
      .setdecorationColor("Red")
      .setcustomMessage("HB")
      .setshape("Round")
      .setallergies("None")
      .setspecialIngredients("Strawberries")
      .setpackagingType("Box")
      .build();

    const id = "cake-delete";
    const entity = IdentifierCakeBuilder.newbuilder().SetId(id).SetCake(core).Build();

    await repo.create(entity);
    await repo.delete(id);

    await expect(repo.get(id)).rejects.toThrow();
  });
});
