import logger from "./util/logger";
import { CakeOrderRepository } from "./repository/sqlite/CakeOrder.repository";
import config from "./config";
import { OrderRepository } from "./repository/sqlite/Order.repository";
import { cakebuilder, IdentifierCakeBuilder } from "./model/builders/cake.builder";

import { identifierOrderItemBuilder, OrderBuilder } from "./model/builders/Order.builder";
import { CakeRepositoryPostgre } from "./repository/PostgreSQL/CakeRepositoryP";
import { BookRepositoryPostgre } from "./repository/PostgreSQL/BookRepositoryP";
import { bookBuilder, IdentifierBookBuilder } from "./model/builders/book.builder";
import { ToyPostgreRepository } from "./repository/PostgreSQL/ToyRepositoryP";
import { IdentifierToyBuilder, ToyBuilder } from "./model/builders/toy.builder";
import { ConnectionManager } from "./repository/PostgreSQL/PostgreConnection";



async function main() {
//     const path= config.storagePath.csv.cake;

//     const repository= new CakeOrderRepository();
//     const data= await repository.get("55");
//     logger.info("data from repository: \n %o", data);


// }
// async function DBSendBox() {
//    const dbOrder= new OrderRepository(new CakeOrderRepository());
//    const CakePgRepo= new CakeRepositoryPostgre();
//     await CakePgRepo.init();
   
//    const BookPgOrder= new BookRepositoryPostgre();
//     await BookPgOrder.init();
//     const toyPgOrder= new ToyPostgreRepository();
//     await toyPgOrder.init();

   

// //    await dbOrder.init();


//    //create identifier cake
//    const cake= cakebuilder.newbuilder()
//    .settype("Birthday")
//    .setflavor("Chocolate")
//     .setfilling("Cream")    
//     .setsize(8)
//     .setlayers(2)
//     .setfrostingType("Buttercream")
//     .setfrostingFlavor("Vanilla")
//     .setdecorationType("Sprinkles")
//     .setdecorationColor("Rainbow")
//     .setcustomMessage("Happy Birthday!")
//     .setshape("Round")
//     .setallergies("Nuts")
//     .setspecialIngredients("Gluten-Free Flour")
//     .setpackagingType("Box")
//    .build();
//    const IdCake = IdentifierCakeBuilder.newbuilder()
// .SetId("cake-" + Math.random().toString(36).substring(2, 15))
// .SetCake(cake)
// .Build();



//     //create identifier book

//    const book= bookBuilder.newBuilder()
//     .setBookTitle("The Great Gatsby")
//     .setAuthor("F. Scott Fitzgerald")
//     .setGenre("Fiction")
//     .setFormat("Hardcover")
//     .setLanguage("English")
//     .setPublisher("Scribner")
//     .setSpecialEdition("Anniversary Edition")
//     .setPackaging("Gift Wrap")
//     .build();



// const IdBook = IdentifierBookBuilder.NewBuilder()
//     .SetId("book-" + Math.random().toString(36).substring(2, 15))   
//     .SetBook(book)
//     .Build();

   
//    //create identifier order
//    const order= OrderBuilder.NewBuilder()
//    .setId("cake-" + Math.random().toString(36).substring(2, 15))
//    .setItem(cake)
//    .setQuantity(2)
//    .setPrice(49.99)
//    .build();
//     const IdOrder= identifierOrderItemBuilder.NewBuilder()
//     .setItem(IdCake)
//     .setOrder(order)
//     .build();

//     //create toy identifier
//     const toy= ToyBuilder.newBuilder()
//     .setType("Action Figure")
//     .setAgeGroup("8+")
//     .setBrand("FunToys")
//     .setMaterial("Plastic")
//     .setBatteryRequired(false)
//     .setEducational(true)
//     .build();
//     const idToy= IdentifierToyBuilder.newBuilder()
//     .setToy(toy)
//     .setid("toy-" + Math.random().toString(36).substring(2, 15))
//     .build();

// // //    await dbOrder.create(IdOrder);
// // //    await dbOrder.delete(IdOrder.getid());
// // //    await dbOrder.update(IdOrder);

// // console.log((await dbOrder.getall()).length);
    
   
// await toyPgOrder.create(idToy);
// await toyPgOrder.get(idToy.getid());
// await toyPgOrder.getall();
// await toyPgOrder.delete(idToy.getid());
// await toyPgOrder.update(idToy);

   
    
  
 

      

}
// DBSendBox().catch((error)=>{
//     logger.error("Error in DB SendBox: " + (error as Error).message);
// });
    

