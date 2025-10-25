import { IdentifierBook } from "model/book.model";
import { ID, Initializable, IRepository } from "repository/IRepository";
import { ConnectionManager } from "./PostgreConnection";

import logger from "../../util/logger";
import { InitializationException } from "../../util/exceptions/repositoryExceptions";
import { IBOOK, PostgreBookMapper } from "../../mappers/BookMapper";

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

const UPDATE_BOOK=`UPDATE BOOK SET 
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

 const DELETE_BOOK_BY_ID=`DELETE FROM book WHERE id=$1;`;
 const GET_ALL=`SELECT * FROM book;`;
 const SELECT_BY_ID=`SELECT * FROM book WHERE id=$1;`

export class BookRepositoryPostgre implements IRepository<IdentifierBook>, Initializable{
  
    async init(): Promise<void> {
        try {
        const conn=await ConnectionManager.getPostgreConnection();
        await conn.query(CREATE_TABLE_BOOKS_QUERY);
        logger.info("PostgreSQL book table created or already exists.");

        }
catch (error: unknown) {
    logger.error("Error during PostgreSQL book table initialization " + error as unknown as Error);
    throw new InitializationException("Failed to initialize the PostgreSQL book database.", error as Error );
        
       
    }
}
    async create(item: IdentifierBook): Promise<ID> {
        const conn=await ConnectionManager.getPostgreConnection();
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
        logger.info(`Book with ID ${item.getid()} inserted into PostgreSQL database.`);
        return item.getid();
       
    }
  async  get(id: ID): Promise<IdentifierBook> {
    const conn=await ConnectionManager.getPostgreConnection();
    const result= await conn.query<IBOOK>(SELECT_BY_ID,[id]);
        if (result.rows.length === 0) {
            throw new Error(`Book with ID ${id} not found.`);
        }
        logger.info("Book retrieved from PostgreSQL database with ID: %s", id);
        return new PostgreBookMapper().map(result.rows[0]);
        
    }
    async getall(): Promise<IdentifierBook[]> {
        try {
            const conn = await ConnectionManager.getPostgreConnection();
            const result= await conn.query<IBOOK>(GET_ALL);
            const books= new PostgreBookMapper();

            logger.info("get ALL books from PostgreSQL database ");
            return result.rows.map((book)=> books.map(book));
            
        }
         catch (error) {
            logger.error("Error during getting all books from PostgreSQL " + error as unknown as Error);
            throw new Error("Failed to get all books from PostgreSQL database.");
            
        }}
         async update(item: IdentifierBook): Promise<void> {
            try {
                
            
            const conn=await ConnectionManager.getPostgreConnection();
            await conn.query(UPDATE_BOOK,[
                item.getAuthor(),
                item.getBookTitle(),
          
                item.getFormat(),
                item.getGenre(),
                item.getLanguage(),
                item.getPackaging(),
                item.getPublisher(),
                item.getSpecialEdition(),
                item.getid()

            ]

            );
               logger.info("Book updated in PostgreSQL database with ID: %s", item.getid());
        }
            catch (error) {
                 logger.error("Error during updating book in PostgreSQL " + error as unknown as Error);
            throw new Error("Failed to update book in PostgreSQL database.");
                
            }

     
     }
    async delete(id: ID): Promise<void> {
        try {
             const conn=await ConnectionManager.getPostgreConnection();
      await conn.query(DELETE_BOOK_BY_ID,[id]);
      logger.info("book deleted from PostgreSQL database with ID:%s",id);
            
        } catch (error) {
             logger.error("Error during deleting book from PostgreSQL " + error as unknown as Error);
            throw new Error("Failed to delete book from PostgreSQL database.");


            
        }
     
    }


       
    }
    





    
