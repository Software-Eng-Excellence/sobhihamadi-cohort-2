import { bookBuilder } from "../../src/model/builders/book.builder";
import { Book } from "../../src/model/book.model";
describe('BookBuilder', () => {
    it('should build a book object with all properties', () => {
        const newbook = new bookBuilder()
            .setBookTitle("The Great Adventure")
            .setAuthor("John Doe")
            .setGenre("Adventure")
            .setFormat("Hardcover")
            .setLanguage("English")
            .setPublisher("Adventure Press")
            .setSpecialEdition("Limited Edition")
            .setPackaging("Gift Wrap")
            .build();

            const expectedBook = new Book(
                 "The Great Adventure",
                 "John Doe",
                 "Adventure",
                 "Hardcover",
                 "English",
                 "Adventure Press",
                 "Limited Edition",
                 "Gift Wrap"
            );
            expect(newbook).toEqual(expectedBook);
    });
    it('should throw an error if a required field is missing', () => {

            const newbook2 = new bookBuilder()
            .setBookTitle("The Great Adventure")
            .setAuthor("John Doe")
            ;

            expect(() => newbook2.build()).toThrow('Required field is missing');
           


    })});