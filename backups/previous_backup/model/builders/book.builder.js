"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentifierBookBuilder = exports.bookBuilder = void 0;
const book_model_1 = require("../../model/book.model");
const logger_1 = __importDefault(require("../../util/logger"));
class bookBuilder {
    static newBuilder() {
        return new bookBuilder();
    }
    setBookTitle(bookTitle) {
        this.bookTitle = bookTitle;
        return this;
    }
    setAuthor(author) {
        this.author = author;
        return this;
    }
    setGenre(genre) {
        this.genre = genre;
        return this;
    }
    setFormat(format) {
        this.format = format;
        return this;
    }
    setLanguage(language) {
        this.language = language;
        return this;
    }
    setPublisher(publisher) {
        this.publisher = publisher;
        return this;
    }
    setSpecialEdition(specialEdition) {
        this.specialEdition = specialEdition;
        return this;
    }
    setPackaging(packaging) {
        this.packaging = packaging;
        return this;
    }
    build() {
        const requiredFields = [
            this.bookTitle,
            this.author,
            this.genre,
            this.format,
            this.language,
            this.publisher,
            this.specialEdition,
            this.packaging
        ];
        for (const field of requiredFields) {
            if (!field) {
                logger_1.default.error('Required field is missing,could not build book');
                throw new Error('Required field is missing');
            }
        }
        return new book_model_1.Book(this.bookTitle, this.author, this.genre, this.format, this.language, this.publisher, this.specialEdition, this.packaging);
    }
}
exports.bookBuilder = bookBuilder;
;
class IdentifierBookBuilder {
    static NewBuilder() {
        return new IdentifierBookBuilder();
    }
    SetId(id) {
        if (!id) {
            logger_1.default.error('ID cannot be empty');
            throw new Error('ID cannot be empty');
        }
        this.id = id;
        return this;
    }
    SetBook(book) {
        this.book = book;
        return this;
    }
    Build() {
        if (!this.id || !this.book) {
            logger_1.default.error('ID is required to build IdentifierBook');
            throw new Error('ID is required to build IdentifierBook');
        }
        return new book_model_1.IdentifierBook(this.id, this.book.getBookTitle(), this.book.getAuthor(), this.book.getGenre(), this.book.getFormat(), this.book.getLanguage(), this.book.getPublisher(), this.book.getSpecialEdition(), this.book.getPackaging());
    }
}
exports.IdentifierBookBuilder = IdentifierBookBuilder;
//# sourceMappingURL=book.builder.js.map