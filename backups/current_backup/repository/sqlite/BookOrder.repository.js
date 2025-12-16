"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookOrderRepository = void 0;
const ConnectionManager_1 = require("./ConnectionManager");
const logger_1 = __importDefault(require("../../util/logger"));
const repositoryExceptions_1 = require("../../util/exceptions/repositoryExceptions");
const BookMapper_1 = require("../../mappers/BookMapper");
const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS "book" (
    id TEXT PRIMARY KEY,
    bookTitle TEXT NOT NULL,
    author TEXT NOT NULL,
    genre TEXT NOT NULL,
    format TEXT NOT NULL,
    language TEXT  NOT NULL,
    publisher TEXT NOT NULL,
    specialEdition TEXT,
    packaging TEXT NOT NULL
);`;
const INSERT_BOOK = `INSERT INTO book (id, bookTitle, author, genre, format,
 language, publisher, specialEdition, packaging)
 VALUES (?,?,?,?,?,?,?, ?,?);`;
const SELECT_BOOK_BY_ID = `SELECT * FROM book WHERE id=?;`;
const GET_ALL = `SELECT * FROM book;`;
const DELETE_BOOK_BY_ID = `DELETE FROM book WHERE id=?;`;
const UPDATE_BOOK = `UPDATE book SET bookTitle=?, author=?,
  genre=?, format=?, language=?, publisher=?, specialEdition=?, packaging=? WHERE id=?;`;
class BookOrderRepository {
    getbyemail() {
        throw new Error("Method not implemented.");
    }
    mapRowToUser() {
        throw new Error("Method not implemented.");
    }
    async create(item) {
        try {
            const conn = await ConnectionManager_1.ConnectionManager.getConnection();
            await conn.run(INSERT_BOOK, [
                item.getid(),
                item.getBookTitle(),
                item.getAuthor(),
                item.getGenre(),
                item.getFormat(),
                item.getLanguage(),
                item.getPublisher(),
                item.getSpecialEdition(),
                item.getPackaging(),
            ]);
            logger_1.default.info("Creating book, id=%s params=%o", item.getid());
            return item.getid();
        }
        catch (error) {
            // Log full error (sqlite message + stack) before rethrowing
            logger_1.default.error("Failed to create book order (raw): %o", error);
            throw new repositoryExceptions_1.DbException("Failed to create book order");
        }
    }
    async get(id) {
        try {
            const conn = await ConnectionManager_1.ConnectionManager.getConnection();
            const result = await conn.get(SELECT_BOOK_BY_ID, id);
            if (!result) {
                throw new repositoryExceptions_1.ItemNotFoundException(`Book with id ${id} not found`);
            }
            return new BookMapper_1.PostgreBookMapper().map(result);
        }
        catch (error) {
            logger_1.default.error("failed to get book of id %s %o ", id, error.message);
            throw new repositoryExceptions_1.DbException("Failed to get book order");
        }
    }
    async getall() {
        try {
            const conn = await ConnectionManager_1.ConnectionManager.getConnection();
            const results = await conn.all(GET_ALL);
            const books = new BookMapper_1.PostgreBookMapper();
            return results.map((book) => books.map(book));
        }
        catch {
            logger_1.default.error("failed to get all books ");
            throw new repositoryExceptions_1.DbException("Failed to get all books ");
        }
    }
    async update(item) {
        try {
            const conn = await ConnectionManager_1.ConnectionManager.getConnection();
            await conn.run(UPDATE_BOOK, [
                item.getBookTitle(),
                item.getAuthor(),
                item.getGenre(),
                item.getFormat(),
                item.getLanguage(),
                item.getPublisher(),
                item.getSpecialEdition(),
                item.getPackaging(),
                item.getid(),
            ]);
        }
        catch (error) {
            // Log full error (sqlite message + stack) before rethrowing
            logger_1.default.error("Failed to update book order (raw): %o", error);
            throw new repositoryExceptions_1.DbException("Failed to update book order");
        }
    }
    async delete(id) {
        try {
            const conn = await ConnectionManager_1.ConnectionManager.getConnection();
            await conn.run(DELETE_BOOK_BY_ID, id);
        }
        catch (error) {
            // Log full error (sqlite message + stack) before rethrowing
            logger_1.default.error("Failed to delete book order (raw): %o", error);
            throw new repositoryExceptions_1.DbException("Failed to delete book order");
        }
    }
    async init() {
        try {
            const conn = await ConnectionManager_1.ConnectionManager.getConnection();
            await conn.exec(CREATE_TABLE);
            logger_1.default.info("book table created or already exists.");
        }
        catch (error) {
            logger_1.default.error("Error during book table initialization " + error);
            throw new repositoryExceptions_1.InitializationException("Failed to initialize the database(book).");
        }
    }
}
exports.BookOrderRepository = BookOrderRepository;
//# sourceMappingURL=BookOrder.repository.js.map