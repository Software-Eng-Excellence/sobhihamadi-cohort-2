import { IdentifierBook } from "../../model/book.model";
import { ID, Initializable, IRepository } from "../../repository/IRepository";
import { ConnectionManager } from "./ConnectionManager";
import logger from "../../util/logger";
import { DbException, InitializationException, ItemNotFoundException } from "../../util/exceptions/repositoryExceptions";
import { IBOOK, PostgreBookMapper } from "../../mappers/BookMapper";
import { User } from "model/user.model";

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
);`
const INSERT_BOOK=`INSERT INTO book (id, bookTitle, author, genre, format,
 language, publisher, specialEdition, packaging)
 VALUES (?,?,?,?,?,?,?, ?,?);`
 const SELECT_BOOK_BY_ID=`SELECT * FROM book WHERE id=?;`
 const GET_ALL=`SELECT * FROM book;`
 const DELETE_BOOK_BY_ID=`DELETE FROM book WHERE id=?;`
 const UPDATE_BOOK=`UPDATE book SET bookTitle=?, author=?,
  genre=?, format=?, language=?, publisher=?, specialEdition=?, packaging=? WHERE id=?;`
export class BookOrderRepository implements IRepository<IdentifierBook>, Initializable{
    getbyemail(email: string): Promise<User> {
        throw new Error("Method not implemented.");
    }
    mapRowToUser(row: any): User {
        throw new Error("Method not implemented.");
    }
    async create(item: IdentifierBook): Promise<ID> {
        try {
            const conn= await ConnectionManager.getConnection();
            const result= await conn.run(
                INSERT_BOOK,[   
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
            logger.info("Creating book, id=%s params=%o", item.getid());
            return item.getid();
        } catch (error: unknown) {
            // Log full error (sqlite message + stack) before rethrowing
            logger.error("Failed to create book order (raw): %o", error);
            throw new DbException("Failed to create book order", error as Error);
        }
        
    }
   async get(id: ID): Promise<IdentifierBook> {
        try {
        const conn = await ConnectionManager.getConnection();
        const result = await conn.get<IBOOK>(SELECT_BOOK_BY_ID, id);
      if (!result) {
        throw new ItemNotFoundException(`Book with id ${id} not found`);
        }
      return new PostgreBookMapper().map(result); 
    } catch (error: unknown) {
        logger.error("failed to get book of id %s %o ", id,(error as Error).message);
        throw new DbException("Failed to get book order", error as Error);
    }
    }
   async getall(): Promise<IdentifierBook[]> {
      try {
            const conn= await ConnectionManager.getConnection();
            const results= await conn.all<IBOOK[]>(GET_ALL);
            const books= new PostgreBookMapper();
            return results.map((book)=> books.map(book));

        } catch (error) {
            logger.error("failed to get all books ");
        throw new DbException("Failed to get all books ", error as Error);
            
        }
    }
   async update(item: IdentifierBook): Promise<void> {
       try
        {
            const conn= await ConnectionManager.getConnection();
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
        } catch (error: unknown) {
            // Log full error (sqlite message + stack) before rethrowing
            logger.error("Failed to update book order (raw): %o", error);
            throw new DbException("Failed to update book order", error as Error);
        }
    }
   async delete(id: ID): Promise<void> {
        try {
            const conn= await ConnectionManager.getConnection();
            await conn.run(DELETE_BOOK_BY_ID, id);
        } catch (error: unknown) {
            // Log full error (sqlite message + stack) before rethrowing
            logger.error("Failed to delete book order (raw): %o", error);
            throw new DbException("Failed to delete book order", error as Error);
           }
    }
    async init(): Promise<void> {
          try {
           const conn=await ConnectionManager.getConnection();
            await conn.exec(CREATE_TABLE);
        logger.info("book table created or already exists.");
        }
       

         catch (error: unknown) {
            logger.error("Error during book table initialization " + error as unknown as Error);
            throw new InitializationException("Failed to initialize the database(book).", error as Error );
            
        }
       
    

    }
    
}