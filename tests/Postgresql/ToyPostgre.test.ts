// tests/Postgresql/ToyPostgre.test.ts

import { ToyBuilder, IdentifierToyBuilder } from "../../src/model/builders/toy.builder";
import { ToyPostgreRepository } from "../../src/repository/PostgreSQL/ToyRepositoryP";

// 1) Mock PostgreConnection BEFORE importing it elsewhere
jest.mock("../../src/repository/PostgreSQL/PostgreConnection", () => {
  // In-memory "toy" table
  const toys = new Map<string, any>();

  let inTx = false;
  let txSnapshot: Map<string, any> | null = null;

  const pool = {
    query: jest.fn(async (sql: string, params?: any[]) => {
      const trimmed = sql.trim();

      // CREATE TABLE IF NOT EXISTS toy (...)
      if (trimmed.startsWith("CREATE TABLE IF NOT EXISTS toy")) {
        return { rows: [] };
      }

      // TRUNCATE TABLE toy RESTART IDENTITY CASCADE;
      if (trimmed.startsWith("TRUNCATE TABLE toy")) {
        toys.clear();
        txSnapshot = null;
        inTx = false;
        return { rows: [] };
      }

      // BEGIN / ROLLBACK – minimal transaction simulation
      if (trimmed === "BEGIN") {
        inTx = true;
        txSnapshot = new Map(toys);
        return { rows: [] };
      }

      if (trimmed === "ROLLBACK") {
        if (inTx && txSnapshot) {
          toys.clear();
          for (const [k, v] of txSnapshot.entries()) {
            toys.set(k, v);
          }
        }
        inTx = false;
        txSnapshot = null;
        return { rows: [] };
      }

      // INSERT INTO toy (id, type, ageGroup, brand, material, batteryRequired, educational)
      if (trimmed.startsWith("INSERT INTO toy")) {
        const [
          id,
          type,
          ageGroup,
          brand,
          material,
          batteryRequired,
          educational,
        ] = params ?? [];

        if (toys.has(id)) {
          // simulate PK violation
          throw new Error('duplicate key value violates unique constraint "toy_pkey"');
        }

        toys.set(id, {
          id,
          type,
          ageGroup,
          brand,
          material,
          batteryRequired,
          educational,
        });

        return { rows: [] };
      }

      // UPDATE toy SET "type"=$1,"ageGroup"=$2,"brand"=$3,"material"=$4,"batteryRequired"=$5,"educational"=$6 WHERE "id"=$7;
      if (trimmed.startsWith("UPDATE toy SET")) {
        const [
          type,
          ageGroup,
          brand,
          material,
          batteryRequired,
          educational,
          id,
        ] = params ?? [];

        const existing = toys.get(id);
        if (existing) {
          existing.type = type;
          existing.ageGroup = ageGroup;
          existing.brand = brand;
          existing.material = material;
          existing.batteryRequired = batteryRequired;
          existing.educational = educational;
        }
        return { rows: [] };
      }

      // DELETE FROM toy WHERE id=$1;
      if (trimmed.startsWith("DELETE FROM toy WHERE id")) {
        const [id] = params ?? [];
        toys.delete(id);
        return { rows: [] };
      }

      // SELECT * FROM toy WHERE id=$1;
      if (trimmed.startsWith("SELECT * FROM toy WHERE id=$1")) {
        const [id] = params ?? [];
        const row = toys.get(id);
        return { rows: row ? [row] : [] };
      }

      // SELECT * FROM toy WHERE id = 'toy-rollback'
      if (trimmed.startsWith("SELECT * FROM toy WHERE id =")) {
        const match = trimmed.match(/WHERE id = '([^']+)'/);
        const id = match ? match[1] : "";
        const row = toys.get(id);
        return { rows: row ? [row] : [] };
      }

      // SELECT * FROM toy;
      if (trimmed === "SELECT * FROM toy;" || trimmed === "SELECT * FROM toy") {
        return { rows: Array.from(toys.values()) };
      }

      // default
      return { rows: [] };
    }),

    end: jest.fn(async () => {
      // nothing to close in memory
    }),
  };

  return {
    ConnectionManager: {
      getPostgreConnection: jest.fn().mockResolvedValue(pool),
    },
  };
});

// after the mock, we can safely import ConnectionManager
import { ConnectionManager } from "../../src/repository/PostgreSQL/PostgreConnection";

describe("ToyRepositoryPostgre", () => {
  const repo = new ToyPostgreRepository();

  beforeAll(async () => {
    await repo.init();
  });

  beforeEach(async () => {
    const conn = await ConnectionManager.getPostgreConnection();
    await conn.query("TRUNCATE TABLE toy RESTART IDENTITY CASCADE;");
  });

  afterAll(async () => {
    const conn = await ConnectionManager.getPostgreConnection();
    await conn.end(); // mocked end
  });

  it("should create a toy", async () => {
    const toy = ToyBuilder.newBuilder()
      .setType("Car")
      .setAgeGroup("3-6")
      .setBrand("Hot Wheels")
      .setMaterial("Plastic")
      .setBatteryRequired(false)
      .setEducational(true)
      .build();

    const idToy = IdentifierToyBuilder.newBuilder()
      .setid(`toy-${Math.random().toString(36).slice(2, 10)}`)
      .setToy(toy)
      .build();

    const id = await repo.create(idToy);

    const fetched = await repo.get(id);
    expect(fetched.getid()).toBe(id);
    expect(fetched.getType()).toBe("Car");
    expect(fetched.getBrand()).toBe("Hot Wheels");
  });

  it("should throw error if a required field is missing", () => {
    const toy = ToyBuilder.newBuilder()
      .setType("Car")
      .setBrand("Hot Wheels");

    expect(() => toy.build()).toThrow("Required field is missing");
  });

  it("should fail to create a toy with duplicate ID", async () => {
    const toyCore = ToyBuilder.newBuilder()
      .setType("Car")
      .setAgeGroup("3-6")
      .setBrand("Hot Wheels")
      .setMaterial("Plastic")
      .setBatteryRequired(false)
      .setEducational(true)
      .build();

    const id = `toy-${Math.random().toString(36).slice(2, 10)}`;
    const toy1 = IdentifierToyBuilder.newBuilder().setid(id).setToy(toyCore).build();
    const toy2 = IdentifierToyBuilder.newBuilder().setid(id).setToy(toyCore).build();

    await repo.create(toy1);
    await expect(repo.create(toy2)).rejects.toBeTruthy();
  });

  it("should rollback transaction if creation fails", async () => {
    const conn = await ConnectionManager.getPostgreConnection();
    const localRepo = new ToyPostgreRepository();
    await conn.query("BEGIN");

    try {
      const toy = ToyBuilder.newBuilder()
        .setType("Car")
        .setAgeGroup("3-6")
        .setBrand("Hot Wheels")
        .setMaterial("Plastic")
        .setBatteryRequired(false)
        .setEducational(true)
        .build();

      const id = "toy-rollback";
      const toyEntity = IdentifierToyBuilder.newBuilder().setid(id).setToy(toy).build();
      await localRepo.create(toyEntity);

      const duplicate = IdentifierToyBuilder.newBuilder().setid(id).setToy(toy).build();
      await localRepo.create(duplicate);

      throw new Error("Transaction did not rollback");
    } catch {
      await conn.query("ROLLBACK");
    }

    const result = await conn.query("SELECT * FROM toy WHERE id = 'toy-rollback'");
    expect(result.rows.length).toBe(0);
  });

  it("should get all toys", async () => {
    const toy1 = ToyBuilder.newBuilder()
      .setType("Car")
      .setAgeGroup("3-6")
      .setBrand("Hot Wheels")
      .setMaterial("Plastic")
      .setBatteryRequired(false)
      .setEducational(true)
      .build();

    const toy2 = ToyBuilder.newBuilder()
      .setType("Doll")
      .setAgeGroup("6-9")
      .setBrand("Barbie")
      .setMaterial("Vinyl")
      .setBatteryRequired(false)
      .setEducational(false)
      .build();

    await repo.create(IdentifierToyBuilder.newBuilder().setid("toy-1").setToy(toy1).build());
    await repo.create(IdentifierToyBuilder.newBuilder().setid("toy-2").setToy(toy2).build());

    const all = await repo.getall();
    expect(all.length).toBe(2);
  });

  it("should update a toy", async () => {
    const toy = ToyBuilder.newBuilder()
      .setType("Car")
      .setAgeGroup("3-6")
      .setBrand("Hot Wheels")
      .setMaterial("Plastic")
      .setBatteryRequired(false)
      .setEducational(true)
      .build();

    const id = "toy-update";
    const entity = IdentifierToyBuilder.newBuilder().setid(id).setToy(toy).build();
    await repo.create(entity);

    // build a new updated core and entity (better than mutating `entity as any`)
    const updatedCore = ToyBuilder.newBuilder()
      .setType("Doll")
      .setAgeGroup("3-6")
      .setBrand("Hot Wheels")
      .setMaterial("Plastic")
      .setBatteryRequired(false)
      .setEducational(true)
      .build();

    const updatedEntity = IdentifierToyBuilder.newBuilder().setid(id).setToy(updatedCore).build();
    await repo.update(updatedEntity);

    const updated = await repo.get(id);
    expect(updated.getType()).toBe("Doll");
  });

  it("should delete a toy", async () => {
    const toy = ToyBuilder.newBuilder()
      .setType("Car")
      .setAgeGroup("3-6")
      .setBrand("Hot Wheels")
      .setMaterial("Plastic")
      .setBatteryRequired(false)
      .setEducational(true)
      .build();

    const id = "toy-delete";
    const entity = IdentifierToyBuilder.newBuilder().setid(id).setToy(toy).build();

    await repo.create(entity);
    await repo.delete(id);

    await expect(repo.get(id)).rejects.toThrow();
  });
});
