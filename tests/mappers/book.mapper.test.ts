import { Book } from "../../src/model/book.model";
import { JsonBookMapper } from "../../src/mappers/BookMapper";
describe('Book Mapper', () => {
  it('should map CSV row to Book object correctly', () => {
    const mapper = new JsonBookMapper();
    const book = mapper.map(["", "The Great Gatsby", "F. Scott Fitzgerald", "Fiction", "Hardcover", "English", "Scribner", "No", "Standard"]);

    const expectedBook = new Book(
        "The Great Gatsby",
        "F. Scott Fitzgerald",
        "Fiction",
        "Hardcover",
        "English",
        "Scribner",
        "No",
        "Standard"
        );         
    expect(book).toEqual(expectedBook);
    

  }),
    
    it('should throw an error if a required field is missing', () => {
        const mapper2 = new JsonBookMapper();
        expect(() => mapper2.map(["", "The Great Gatsby", "F. Scott Fitzgerald"])).toThrow('Required field is missing');
    })
});