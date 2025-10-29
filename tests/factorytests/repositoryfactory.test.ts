//for test repositoryfactory i want:
//
//// tests/repositoryfactory.test.ts
import { RepositoryFactory, DBMode } from "../../src/repository/Repository.factory";
import { ItemCategory } from "../../src/model/IItem";


const init = jest.fn();

jest.mock("../../src/repository/PostgreSQL/CakeRepositoryP", () => ({
  CakeRepositoryPostgre: jest.fn(),
}));

jest.mock("../../src/repository/sqlite/Order.repository", () => ({
  OrderRepository: jest.fn().mockImplementation(() => ({ init })),
}));

jest.mock("../../src/repository/PostgreSQL/BookRepositoryP", () => ({
  BookRepositoryPostgre: jest.fn(),
}));
jest.mock("../../src/repository/PostgreSQL/ToyRepositoryP", () => ({
  ToyPostgreRepository: jest.fn(),
}));
jest.mock("../../src/repository/sqlite/CakeOrder.repository", () => ({
  CakeOrderRepository: jest.fn(),
}));
jest.mock("../../src/repository/sqlite/BookOrder.repository", () => ({
  BookOrderRepository: jest.fn(),
}));
jest.mock("../../src/repository/sqlite/ToyOrder.repository", () => ({
  ToyOrderRepository: jest.fn(),
}));

import { CakeRepositoryPostgre } from "../../src/repository/PostgreSQL/CakeRepositoryP";
import { OrderRepository } from "../../src/repository/sqlite/Order.repository";
import { BookRepositoryPostgre } from "../../src/repository/PostgreSQL/BookRepositoryP";

import { ToyPostgreRepository } from "../../src/repository/PostgreSQL/ToyRepositoryP";
import { CakeOrderRepository } from "../../src/repository/sqlite/CakeOrder.repository";
import { BookOrderRepository } from "../../src/repository/sqlite/BookOrder.repository";
import { ToyOrderRepository } from "../../src/repository/sqlite/ToyOrder.repository";




beforeEach(() => jest.clearAllMocks());

describe("create repository factory ",  () => {

  it("it should create a cake(postgres)   and order repo and call init", async () => {

    

  await RepositoryFactory.create(DBMode.POSTGRES, ItemCategory.Cake);


  expect(CakeRepositoryPostgre).toHaveBeenCalledTimes(1);

  expect(OrderRepository).toHaveBeenCalledTimes(1);

  expect(init).toHaveBeenCalledTimes(1);
});

it("should create a book(postgres) and order repo and call init", async () => {
  await RepositoryFactory.create(DBMode.POSTGRES,ItemCategory.Book);
  expect(BookRepositoryPostgre).toHaveBeenCalledTimes(1);
  expect(OrderRepository).toHaveBeenCalledTimes(1);
  expect(init).toHaveBeenCalledTimes(1);



});
it("should create a toy(postgres) repo ", async () => {
  
  await RepositoryFactory.create(DBMode.POSTGRES,ItemCategory.Toy);
  expect(ToyPostgreRepository ).toHaveBeenCalledTimes(1);
  expect(OrderRepository).toHaveBeenCalledTimes(1);
  expect(init).toHaveBeenCalledTimes(1);

});
it("should create a cake(sqlite) repo ", async () => {
  await RepositoryFactory.create(DBMode.SQLITE,ItemCategory.Cake);
  expect(OrderRepository).toHaveBeenCalledTimes(1);
  expect(CakeOrderRepository).toHaveBeenCalledTimes(1);
expect(init).toHaveBeenCalledTimes(1);


});
it("should create a book(sqlite) repo ", async () => {
  await RepositoryFactory.create(DBMode.SQLITE,ItemCategory.Book);
  expect(OrderRepository).toHaveBeenCalledTimes(1);
  expect(BookOrderRepository).toHaveBeenCalledTimes(1);
  expect(init).toHaveBeenCalledTimes(1);

});
it("should create a toy(sqlite) repo ", async () => {
  await RepositoryFactory.create(DBMode.SQLITE,ItemCategory.Toy);
  expect(OrderRepository).toHaveBeenCalledTimes(1);
  expect(ToyOrderRepository).toHaveBeenCalledTimes(1);
  expect(init).toHaveBeenCalledTimes(1);



});
it ("should create a cake(csv) repo", async () => {
  const repo= await RepositoryFactory.create (DBMode.CSV,ItemCategory.Cake);
  expect(repo).toBeDefined();
  
});
it("invalid category throws", async () => {
  await expect(RepositoryFactory.create(DBMode.POSTGRES,"InvalidCategory" as ItemCategory))
    .rejects.toThrow(/Invalid category/);
});
});

