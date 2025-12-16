"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookRepositoryPostgre = void 0;
const PostgreConnection_1 = require("./PostgreConnection");
const logger_1 = __importDefault(require("../../util/logger"));
const repositoryExceptions_1 = require("../../util/exceptions/repositoryExceptions");
const BookMapper_1 = require("../../mappers/BookMapper");
const CREATE_TABLE_BOOKS_QUERY = `CREATE TABLE IF NOT EXISTS book (
    "id" TEXT PRIMARY KEY,
    "bookTitle" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "specialEdition" TEXT,
    "packaging" TEXT NOT NULL
);`;
const UPDATE_BOOK = `UPDATE BOOK SET 
"bookTitle"=$1,
"author"=$2,
"genre"=$3,
"format"=$4,
"language"=$5,
"publisher"=$6,
"specialEdition"=$7,
"packaging"=$8
WHERE "id"=$9;
`;
const INSERT_BOOK_QUERY = `INSERT INTO book
 ("id", "bookTitle", "author", "genre", "format", "language", "publisher", "specialEdition", "packaging")
 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
const DELETE_BOOK_BY_ID = `DELETE FROM book WHERE id=$1;`;
const GET_ALL = `SELECT * FROM book;`;
const SELECT_BY_ID = `SELECT * FROM book WHERE id=$1;`;
class BookRepositoryPostgre {
    getbyemail() {
        throw new Error("Method not implemented.");
    }
    mapRowToUser() {
        throw new Error("Method not implemented.");
    }
    async init() {
        try {
            const conn = await PostgreConnection_1.ConnectionManager.getPostgreConnection();
            await conn.query(CREATE_TABLE_BOOKS_QUERY);
            logger_1.default.info("PostgreSQL book table created or already exists.");
        }
        catch (error) {
            console.error("ERROR IN BookRepositoryPostgre.init:", error);
            logger_1.default.error("Error during PostgreSQL book table initialization", error);
            throw new repositoryExceptions_1.InitializationException("Failed to initialize the PostgreSQL book database.");
        }
    }
    async create(item) {
        const conn = await PostgreConnection_1.ConnectionManager.getPostgreConnection();
        await conn.query(INSERT_BOOK_QUERY, [
            item.getid(),
            item.getBookTitle(),
            item.getAuthor(),
            item.getGenre(),
            item.getFormat(),
            item.getLanguage(),
            item.getPublisher(),
            item.getSpecialEdition(),
            item.getPackaging()
        ]);
        logger_1.default.info(`Book with ID ${item.getid()} inserted into PostgreSQL database.`);
        return item.getid();
    }
    async get(id) {
        const conn = await PostgreConnection_1.ConnectionManager.getPostgreConnection();
        const result = await conn.query(SELECT_BY_ID, [id]);
        if (result.rows.length === 0) {
            throw new Error(`Book with ID ${id} not found.`);
        }
        logger_1.default.info("Book retrieved from PostgreSQL database with ID: %s", id);
        return new BookMapper_1.PostgreBookMapper().map(result.rows[0]);
    }
    async getall() {
        try {
            const conn = await PostgreConnection_1.ConnectionManager.getPostgreConnection();
            const result = await conn.query(GET_ALL);
            const books = new BookMapper_1.PostgreBookMapper();
            logger_1.default.info("get ALL books from PostgreSQL database ");
            return result.rows.map((book) => books.map(book));
        }
        catch (error) {
            logger_1.default.error("Error during getting all books from PostgreSQL " + error);
            throw new Error("Failed to get all books from PostgreSQL database.");
        }
    }
    async update(item) {
        try {
            const conn = await PostgreConnection_1.ConnectionManager.getPostgreConnection();
            await conn.query(UPDATE_BOOK, [
                item.getBookTitle(),
                item.getAuthor(),
                item.getGenre(),
                item.getFormat(),
                item.getLanguage(),
                item.getPublisher(),
                item.getSpecialEdition(),
                item.getPackaging(),
                item.getid()
            ]);
            logger_1.default.info("Book updated in PostgreSQL database with ID: %s", item.getid());
        }
        catch (error) {
            logger_1.default.error("Error during updating book in PostgreSQL " + error);
            throw new Error("Failed to update book in PostgreSQL database.");
        }
    }
    async delete(id) {
        try {
            const conn = await PostgreConnection_1.ConnectionManager.getPostgreConnection();
            await conn.query(DELETE_BOOK_BY_ID, [id]);
            logger_1.default.info("book deleted from PostgreSQL database with ID:%s", id);
        }
        catch (error) {
            logger_1.default.error("Error during deleting book from PostgreSQL " + error);
            throw new Error("Failed to delete book from PostgreSQL database.");
        }
    }
}
exports.BookRepositoryPostgre = BookRepositoryPostgre;
//# sourceMappingURL=BookRepositoryP.js.map