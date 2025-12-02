import { bookBuilder, IdentifierBookBuilder } from "../../src/model/builders/book.builder";
import { BookRepositoryPostgre } from "../../src/repository/PostgreSQL/BookRepositoryP";
import { ConnectionManager } from "../../src/repository/PostgreSQL/PostgreConnection";

describe("BookRepositoryPostgre", () => {
  const repo = new BookRepositoryPostgre();

  beforeAll(async () => {
    await repo.init();
  });

  beforeEach(async () => {
    const conn = await ConnectionManager.getPostgreConnection();
    await conn.query('TRUNCATE TABLE book RESTART IDENTITY CASCADE;');
  });
  afterAll(async () => {
  const conn = await ConnectionManager.getPostgreConnection();
  await conn.end(); // close PostgreSQL connection
});

  it("should create a book", async () => {
    const book = bookBuilder
      .newBuilder()
      .setBookTitle("The Great Gatsby")
      .setAuthor("F. Scott Fitzgerald")
      .setGenre("Fiction")
      .setFormat("Hardcover")
      .setLanguage("English")
      .setPublisher("Scribner")
      .setSpecialEdition("Anniversary Edition")
      .setPackaging("Gift Wrap")
      .build();

    const idBook = IdentifierBookBuilder
      .NewBuilder()
      .SetId(`book-${Math.random().toString(36).slice(2, 10)}`)
      .SetBook(book)
      .Build();

    const id = await repo.create(idBook);

    const fetched = await repo.get(id);
    expect(fetched.getid()).toBe(id);
    expect(fetched.getBookTitle()).toBe("The Great Gatsby");
    expect(fetched.getAuthor()).toBe("F. Scott Fitzgerald");
  });

  it("should throw error if a required field is missing", () => {
    const bad = bookBuilder
      .newBuilder()
      .setBookTitle("Only Title")
      .setAuthor("Only Author");
    expect(() => bad.build()).toThrow("Required field is missing");
  });

  it("should fail to create a book with duplicate ID", async () => {
    const core = bookBuilder
      .newBuilder()
      .setBookTitle("The Great Gatsby")
      .setAuthor("F. Scott Fitzgerald")
      .setGenre("Fiction")
      .setFormat("Hardcover")
      .setLanguage("English")
      .setPublisher("Scribner")
      .setSpecialEdition("Anniversary Edition")
      .setPackaging("Gift Wrap")
      .build();

    const id = `book-${Math.random().toString(36).slice(2, 10)}`;
    const b1 = IdentifierBookBuilder.NewBuilder().SetId(id).SetBook(core).Build();
    const b2 = IdentifierBookBuilder.NewBuilder().SetId(id).SetBook(core).Build();

    await repo.create(b1);
    await expect(repo.create(b2)).rejects.toBeTruthy();
  });

  it("should rollback transaction if creation fails", async () => {
    const conn = await ConnectionManager.getPostgreConnection();
    const localRepo = new BookRepositoryPostgre();
    await conn.query("BEGIN");

    try {
      const core = bookBuilder
        .newBuilder()
        .setBookTitle("Rollback Title")
        .setAuthor("A")
        .setGenre("G")
        .setFormat("F")
        .setLanguage("L")
        .setPublisher("P")
        .setSpecialEdition("S")
        .setPackaging("Pack")
        .build();

      const id = "book-rollback";
      const one = IdentifierBookBuilder.NewBuilder().SetId(id).SetBook(core).Build();
      await localRepo.create(one);

      const dup = IdentifierBookBuilder.NewBuilder().SetId(id).SetBook(core).Build();
      await localRepo.create(dup);

      throw new Error("no rollback");
    } catch {
      await conn.query("ROLLBACK");
    }

    const check = await conn.query("SELECT * FROM book WHERE id = 'book-rollback'");
    expect(check.rows.length).toBe(0);
  });

  it("should get all books", async () => {
    const a = bookBuilder
      .newBuilder()
      .setBookTitle("A")
      .setAuthor("Auth A")
      .setGenre("Fiction")
      .setFormat("Hardcover")
      .setLanguage("English")
      .setPublisher("Pub A")
      .setSpecialEdition("SE A")
      .setPackaging("Pack A")
      .build();

    const b = bookBuilder
      .newBuilder()
      .setBookTitle("B")
      .setAuthor("Auth B")
      .setGenre("History")
      .setFormat("Paperback")
      .setLanguage("English")
      .setPublisher("Pub B")
      .setSpecialEdition("SE B")
      .setPackaging("Pack B")
      .build();

    await repo.create(IdentifierBookBuilder.NewBuilder().SetId("book-1").SetBook(a).Build());
    await repo.create(IdentifierBookBuilder.NewBuilder().SetId("book-2").SetBook(b).Build());

    const all = await repo.getall();
    expect(all.length).toBe(2);
  });

  it("should update a book", async () => {
    const core = bookBuilder
      .newBuilder()
      .setBookTitle("Original")
      .setAuthor("Auth")
      .setGenre("Fiction")
      .setFormat("Hardcover")
      .setLanguage("English")
      .setPublisher("Pub")
      .setSpecialEdition("SE")
      .setPackaging("Pack")
      .build();

    const id = "book-update";
    const entity = IdentifierBookBuilder.NewBuilder().SetId(id).SetBook(core).Build();
    await repo.create(entity);
   
       // change a property
       (entity as any).author = "After Update";
       await repo.update(entity);
   
       const updated = await repo.get(id);
       expect(updated.getAuthor()
    ).toBe("After Update");
  });

  it("should delete a book", async () => {
    const core = bookBuilder
      .newBuilder()
      .setBookTitle("To Delete")
      .setAuthor("X")
      .setGenre("Drama")
      .setFormat("Hardcover")
      .setLanguage("English")
      .setPublisher("Y")
      .setSpecialEdition("Z")
      .setPackaging("Pack")
      .build();

    const id = "book-delete";
    const entity = IdentifierBookBuilder.NewBuilder().SetId(id).SetBook(core).Build();

    await repo.create(entity);
    await repo.delete(id);

    await expect(repo.get(id)).rejects.toThrow();
  });
});
