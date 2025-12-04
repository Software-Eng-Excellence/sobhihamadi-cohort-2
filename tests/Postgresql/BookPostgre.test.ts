// tests/Postgresql/BookPostgre.test.ts

import { bookBuilder, IdentifierBookBuilder } from "../../src/model/builders/book.builder";
import { BookRepositoryPostgre } from "../../src/repository/PostgreSQL/BookRepositoryP";

// IMPORTANT: mock ConnectionManager BEFORE importing it from the test
jest.mock("../../src/repository/PostgreSQL/PostgreConnection", () => {
  // in-memory "book" table
  const books = new Map<string, any>();

  const pool = {
    query: jest.fn(async (sql: string, params?: any[]) => {
      // normalize
      const trimmed = sql.trim();

      // CREATE TABLE IF NOT EXISTS book ...
      if (trimmed.startsWith("CREATE TABLE IF NOT EXISTS book")) {
        return { rows: [] };
      }

      // TRUNCATE TABLE book RESTART IDENTITY CASCADE;
      if (trimmed.startsWith("TRUNCATE TABLE book")) {
        books.clear();
        return { rows: [] };
      }

      // BEGIN / ROLLBACK (used in rollback test)
      if (trimmed === "BEGIN" || trimmed === "ROLLBACK") {
        return { rows: [] };
      }

      // INSERT INTO book (...)
      if (trimmed.startsWith("INSERT INTO book")) {
        const [
          id,
          bookTitle,
          author,
          genre,
          format,
          language,
          publisher,
          specialEdition,
          packaging,
        ] = params ?? [];
        // simulate unique primary key on id
        if (books.has(id)) {
          throw new Error("duplicate key value violates unique constraint \"book_pkey\"");
        }
        books.set(id, {
          id,
          bookTitle,
          author,
          genre,
          format,
          language,
          publisher,
          specialEdition,
          packaging,
        });
        return { rows: [] };
      }

      // UPDATE BOOK SET ...
      if (trimmed.startsWith("UPDATE BOOK SET")) {
        const [
          bookTitle,
          author,
          genre,
          format,
          language,
          publisher,
          specialEdition,
          packaging,
          id,
        ] = params ?? [];

        const existing = books.get(id);
        if (existing) {
          existing.bookTitle = bookTitle;
          existing.author = author;
          existing.genre = genre;
          existing.format = format;
          existing.language = language;
          existing.publisher = publisher;
          existing.specialEdition = specialEdition;
          existing.packaging = packaging;
        }
        return { rows: [] };
      }

      // DELETE FROM book WHERE id=$1;
      if (trimmed.startsWith("DELETE FROM book WHERE")) {
        const [id] = params ?? [];
        books.delete(id);
        return { rows: [] };
      }

      // SELECT * FROM book WHERE id=$1;
      if (trimmed.startsWith("SELECT * FROM book WHERE id=$1")) {
        const [id] = params ?? [];
        const row = books.get(id);
        return { rows: row ? [row] : [] };
      }

      // SELECT * FROM book WHERE id = 'book-rollback'
      if (trimmed.startsWith("SELECT * FROM book WHERE id =")) {
        // crude parsing just for the test query
        const match = trimmed.match(/WHERE id = '([^']+)'/);
        const id = match ? match[1] : "";
        const row = books.get(id);
        return { rows: row ? [row] : [] };
      }

      // SELECT * FROM book;
      if (trimmed === "SELECT * FROM book;" || trimmed === "SELECT * FROM book") {
        return { rows: Array.from(books.values()) };
      }

      // default: do nothing
      return { rows: [] };
    }),
    end: jest.fn(async () => {
      // no real connection to close
    }),
  };

  return {
    ConnectionManager: {
      getPostgreConnection: jest.fn().mockResolvedValue(pool),
    },
  };
});

import { ConnectionManager } from "../../src/repository/PostgreSQL/PostgreConnection";

describe("BookRepositoryPostgre", () => {
  const repo = new BookRepositoryPostgre();

  beforeAll(async () => {
    await repo.init();
  });

  beforeEach(async () => {
    const conn = await ConnectionManager.getPostgreConnection();
    await conn.query("TRUNCATE TABLE book RESTART IDENTITY CASCADE;");
  });

  afterAll(async () => {
    const conn = await ConnectionManager.getPostgreConnection();
    await conn.end(); // mocked end
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
    expect(check.rows.length).toBe(1);
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
    const entity = IdentifierBookBuilder
      .NewBuilder()
      .SetId(id)
      .SetBook(core)
      .Build();

    await repo.create(entity);

    const updatedCore = bookBuilder
      .newBuilder()
      .setBookTitle("Original")
      .setAuthor("After Update")
      .setGenre("Fiction")
      .setFormat("Hardcover")
      .setLanguage("English")
      .setPublisher("Pub")
      .setSpecialEdition("SE")
      .setPackaging("Pack")
      .build();

    const updatedEntity = IdentifierBookBuilder
      .NewBuilder()
      .SetId(id)
      .SetBook(updatedCore)
      .Build();

    await repo.update(updatedEntity);

    const updated = await repo.get(id);
    expect(updated).toEqual(updatedEntity);
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
