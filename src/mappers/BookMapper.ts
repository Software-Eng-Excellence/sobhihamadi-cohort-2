import { Book, IdentifierBook } from "model/book.model";
import { IMapper } from "./IMapper";
import { bookBuilder, IdentifierBookBuilder } from "../model/builders/book.builder";


export class JsonBookMapper implements IMapper<string[], Book> {
    reverseMap(): string[] {
        throw new Error("Method not implemented.");
    }


    map(data: string[]): Book {

        return bookBuilder.newBuilder()
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
export interface IBOOK {
        id:string,
      bookTitle: string,
        author: string,
        genre: string,
        format: string,
        language: string,
        publisher: string,
        specialEdition: string,
        packaging: string,

}
export class PostgreBookMapper implements IMapper<IBOOK, Book>{
    map(data: IBOOK): IdentifierBook {
        return IdentifierBookBuilder.NewBuilder()
        .SetId(data.id)
        .SetBook(
            bookBuilder.newBuilder()
            .setBookTitle(data.bookTitle)
            .setAuthor(data.author)
            .setFormat(data.format)
            .setGenre(data.genre).setLanguage(data.language)
            .setPackaging(data.packaging).setPublisher(data.publisher)
            .setSpecialEdition(data.specialEdition ?? '').build()
        )
        .Build()
        
 
       
      
    }
    reverseMap(data: IdentifierBook): IBOOK {
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

