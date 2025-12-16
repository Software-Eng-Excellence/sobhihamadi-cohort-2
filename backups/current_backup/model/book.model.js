"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentifierBook = exports.Book = void 0;
const IItem_1 = require("./IItem");
class Book {
    getCategory() {
        return IItem_1.ItemCategory.Book;
    }
    constructor(bookTitle, author, genre, format, language, publisher, specialEdition, packaging) {
        this.bookTitle = bookTitle;
        this.author = author;
        this.genre = genre;
        this.format = format;
        this.language = language;
        this.publisher = publisher;
        this.specialEdition = specialEdition;
        this.packaging = packaging;
    }
    getBookTitle() {
        return this.bookTitle;
    }
    getAuthor() {
        return this.author;
    }
    getGenre() {
        return this.genre;
    }
    getFormat() {
        return this.format;
    }
    getLanguage() {
        return this.language;
    }
    getPublisher() {
        return this.publisher;
    }
    getSpecialEdition() {
        return this.specialEdition;
    }
    getPackaging() {
        return this.packaging;
    }
}
exports.Book = Book;
class IdentifierBook extends Book {
    constructor(id, bookTitle, author, genre, format, language, publisher, specialEdition, packaging) {
        super(bookTitle, author, genre, format, language, publisher, specialEdition, packaging);
        this.id = id;
    }
    getid() {
        return this.id;
    }
}
exports.IdentifierBook = IdentifierBook;
//# sourceMappingURL=book.model.js.map