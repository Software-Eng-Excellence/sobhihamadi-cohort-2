"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgreBookMapper = exports.JsonBookMapper = void 0;
const book_builder_1 = require("../model/builders/book.builder");
class JsonBookMapper {
    reverseMap() {
        throw new Error("Method not implemented.");
    }
    map(data) {
        return book_builder_1.bookBuilder.newBuilder()
            .setBookTitle(data[1])
            .setAuthor(data[2])
            .setGenre(data[3])
            .setFormat(data[4])
            .setLanguage(data[5])
            .setPublisher(data[6])
            .setSpecialEdition(data[7])
            .setPackaging(data[8])
            .build();
    }
}
exports.JsonBookMapper = JsonBookMapper;
class PostgreBookMapper {
    map(data) {
        return book_builder_1.IdentifierBookBuilder.NewBuilder()
            .SetId(data.id)
            .SetBook(book_builder_1.bookBuilder.newBuilder()
            .setBookTitle(data.bookTitle)
            .setAuthor(data.author)
            .setFormat(data.format)
            .setGenre(data.genre).setLanguage(data.language)
            .setPackaging(data.packaging).setPublisher(data.publisher)
            .setSpecialEdition(data.specialEdition ?? '').build())
            .Build();
    }
    reverseMap(data) {
        return {
            id: data.getid(),
            bookTitle: data.getBookTitle(),
            author: data.getAuthor(),
            genre: data.getGenre(),
            format: data.getFormat(),
            language: data.getLanguage(),
            publisher: data.getPublisher(),
            specialEdition: data.getSpecialEdition(),
            packaging: data.getPackaging(),
        };
    }
}
exports.PostgreBookMapper = PostgreBookMapper;
//# sourceMappingURL=BookMapper.js.map