import { ToyBuilder, IdentifierToyBuilder } from "../../src/model/builders/toy.builder";
import { ToyPostgreRepository } from "../../src/repository/PostgreSQL/ToyRepositoryP";
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
  await conn.end(); // close PostgreSQL connection
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

    // change a property
    (entity as any).type = "Doll";
    await repo.update(entity);

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
