import { Book } from "model/book.model";
import { IMapper } from "./IMapper";
import { bookBuilder } from "../model/builders/book.builder";


export class JsonBookMapper implements IMapper<string[], Book> {
    [x: string]: any;  

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

