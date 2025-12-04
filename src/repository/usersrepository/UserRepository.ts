import { User } from "../../model/user.model";
import { ID, IRepository, Initializable } from "../../repository/IRepository";
import { ConnectionManager } from "../sqlite/ConnectionManager";
import logger from "../../util/logger";
import { DbException, InitializationException } from "../../util/exceptions/repositoryExceptions";
import { NotFoundException } from "../../util/exceptions/http/NotFoundException";
import  sqlite3  from "sqlite3";
import { Database } from "sqlite";

const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user'
  );
`;
const INSERT_SQL = `
  INSERT INTO users (id, name, email, password,role)
  VALUES (?, ?, ?, ?,?);
`;

const SELECT_BY_ID_SQL = `
  SELECT id, name, email, password,role
  FROM users
  WHERE id = ?;
`;

const SELECT_ALL_SQL = `
  SELECT id, name, email, password,role
  FROM users;
`;

const UPDATE_SQL = `
  UPDATE users
  SET name = ?, email = ?, password = ?, role = ?
  WHERE id = ?;
`;

const DELETE_SQL = `
  DELETE FROM users
  WHERE id = ?;
`;

export class UserSqliteRepository implements IRepository<User>, Initializable {
   private db!: Database<sqlite3.Database, sqlite3.Statement>;
  constructor() {
  }

  async init(): Promise<void> {
    try {
      this.db = await ConnectionManager.getConnection();
      await this.db.exec(CREATE_TABLE_SQL);

      logger.info("User table created or already exists.");
    } catch (error: unknown) {
      logger.error("Error initializing User repository: %o", error);
      throw new InitializationException("Failed to initialize user repository");
    }
  }
//we can add a mapper file for user
   mapRowToUser(row: User): User {
    return new User({
      id: row.id,
      name: row.name,
      email: row.email,
      password: row.password,
      role:row.role

    });
  }

  async create(user: User): Promise<ID> {
  
    try {
      this.db = await ConnectionManager.getConnection();
      await this.db.exec("BEGIN TRANSACTION;");

      await this.db.run(INSERT_SQL, [
        user.id,
        user.name,
        user.email,
        user.password,
        user.role,
        
      ]);

      await this.db.exec("COMMIT;");
      return user.getid();

    } catch (error: unknown) {
      if (this.db) await this.db.exec("ROLLBACK;");
      logger.error("Error creating user %s: %o", user.id, error);
      throw new DbException("Failed to create user.");
    }
  }

  async get(id: ID): Promise<User> {
    try {
      const conn = await ConnectionManager.getConnection();
      const row = await conn.get(SELECT_BY_ID_SQL, id);

      if (!row) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      return this.mapRowToUser(row);

    } catch (error: unknown) {
      logger.error("Error getting user %s: %o", id, error);
      if (error instanceof NotFoundException) throw error;
      throw new DbException("Failed to get user.");
    }
  }

  async getall(): Promise<User[]> {
    try {
      const conn = await ConnectionManager.getConnection();
      const rows = await conn.all(SELECT_ALL_SQL);
      return rows.map((r: User) => this.mapRowToUser(r));

    } catch (error: unknown) {
      logger.error("Error getting all users: %o", error);
      throw new DbException("Failed to get all users.");
    }
  }

  async update(user: User): Promise<void> {

    try {
      this.db = await ConnectionManager.getConnection();
      await this.db.exec("BEGIN TRANSACTION;");

      await   this.db .run(UPDATE_SQL, [
        user.name,
        user.email,
        user.password,
        user.role,
        user.id,
      ]);

      await   this.db .exec("COMMIT;");

    } catch (error: unknown) {
      if (  this.db ) await   this.db .exec("ROLLBACK;");
      logger.error("Error updating user %s: %o", user.id, error);
      throw new DbException("Failed to update user.");
    }
  }

  async delete(id: ID): Promise<void> {

    try {
      this.db = await ConnectionManager.getConnection();
      await  this.db.exec("BEGIN TRANSACTION;");

      const result = await  this.db.run(DELETE_SQL, id);

      if (result.changes === 0) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      await  this.db.exec("COMMIT;");

    } catch (error: unknown) {
      if ( this.db) await  this.db.exec("ROLLBACK;");
      logger.error("Error deleting user %s: %o", id, error);
      if (error instanceof NotFoundException) throw error;
      throw new DbException("Failed to delete user.");
    }
  }
  async getbyemail(email: string): Promise<User> {
   if(!this.db){
    throw new DbException("Database not initialized.")

   }
    const SELECT_BY_EMAIL_SQL = `
    SELECT *
    FROM users
    WHERE email = ?;
`;
    return await this.db.get(SELECT_BY_EMAIL_SQL, email).then((row: User) => {
      if (!row) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
      
      return this.mapRowToUser(row);
    });
  }
}
