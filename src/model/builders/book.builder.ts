import { Book } from "../../model/book.model";
import logger from "../../util/logger";



export class bookBuilder {
     bookTitle!: string;
        author!: string;
        genre!: string;
        format!: string;
        language!: string;
        publisher!: string;
        specialEdition!: string;
        packaging!: string;
    setBookTitle(bookTitle: string): bookBuilder {
        this.bookTitle = bookTitle;
        return this;
    }
    setAuthor(author: string): bookBuilder {
        this.author = author;
        return this;
    }
    setGenre(genre: string): bookBuilder {
        this.genre = genre;
        return this;
    }
    setFormat(format: string): bookBuilder {
        this.format = format;
        return this;
    }
    setLanguage(language: string): bookBuilder {
        this.language = language;
        return this;
    }
    setPublisher(publisher: string): bookBuilder {
        this.publisher = publisher;
        return this;
    }
    setSpecialEdition(specialEdition: string): bookBuilder {
        this.specialEdition = specialEdition;
        return this;
    }
    setPackaging(packaging: string): bookBuilder {
        this.packaging = packaging;
        return this;
    }
    build(): Book {
        const requiredFields = [
            this.bookTitle,
            this.author,
            this.genre,
            this.format,
            this.language,
            this.publisher,
            this.specialEdition,
            this.packaging
        ]
        for (const field of requiredFields) {
            if (!field) {
                logger.error('Required field is missing,could not build book');
                throw new Error('Required field is missing');
            }}
        return new Book(
            this.bookTitle,
            this.author,
            this.genre,
            this.format,
            this.language,
            this.publisher,
            this.specialEdition,
            this.packaging
        );
    }

};
