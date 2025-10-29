import logger from "./util/logger";
import { CakeOrderRepository } from "./repository/sqlite/CakeOrder.repository";
import config from "./config";
import { OrderRepository } from "./repository/sqlite/Order.repository";
import { cakebuilder, IdentifierCakeBuilder } from "./model/builders/cake.builder";

import { identifierOrderItemBuilder, OrderBuilder } from "./model/builders/Order.builder";


import { DBMode, RepositoryFactory } from "./repository/Repository.factory";
import { cakeOrderRepository } from "./repository/file/CakeOrder.repository";
import { ItemCategory } from "./model/IItem";




async function main() {
     const path= config.storagePath.csv.cake;

     const repository= new cakeOrderRepository(path);
     const data= await repository.get("55");
     logger.info("data from repository: \n %o", data);

}
 
 async function DBSendBox() {
 const dbOrder=await RepositoryFactory.create(DBMode.POSTGRES,ItemCategory.Cake);
 


   //create identifier cake
    const cake= cakebuilder.newbuilder()
   .settype("Birthday")
   .setflavor("Chocolate")
    .setfilling("Cream")    
    .setsize(8)    .setlayers(2)
     .setfrostingType("Buttercream")
    .setfrostingFlavor("Vanilla")
    .setdecorationType("Sprinkles")
     .setdecorationColor("Rainbow")     .setcustomMessage("Happy Birthday!")
    .setshape("Round")
.setallergies("Nuts")
     .setspecialIngredients("Gluten-Free Flour")
     .setpackagingType("Box")
    .build();
    const IdCake = IdentifierCakeBuilder.newbuilder()
 .SetId("cake-" + Math.random().toString(36).substring(2, 15))
 .SetCake(cake)
 .Build();






//     //create identifier book

//    const book= bookBuilder.newBuilder()
//     .setBookTitle("The Great Gatsby")
//     .setAuthor("F. Scott Fitzgerald")
//    .setGenre("Fiction")
//      .setFormat("Hardcover")
//     .setLanguage("English")
//      .setPublisher("Scribner")
//     .setSpecialEdition("Anniversary Edition")
//     .setPackaging("Gift Wrap")
//     .build();



//  const IdBook = IdentifierBookBuilder.NewBuilder()
//     .SetId("book-" + Math.random().toString(36).substring(2, 15))   
//     .SetBook(book)
//   .Build();

   
   //create identifier order
   const order= OrderBuilder.NewBuilder()
   .setId("cake-" + Math.random().toString(36).substring(2, 15))
   .setItem(cake)
   .setQuantity(2)
   .setPrice(49.99)
   .build();
     const IdOrder= identifierOrderItemBuilder.NewBuilder()
    .setItem(IdCake)
     .setOrder(order)
     .build();

//     //create toy identifier
//     const toy= ToyBuilder.newBuilder()
//      .setType("Action Figure")
//     .setAgeGroup("8+")
//     .setBrand("FunToys")
//     .setMaterial("Plastic")
//     .setBatteryRequired(false)
//     .setEducational(true)
//     .build();
//     const idToy= IdentifierToyBuilder.newBuilder()
//     .setToy(toy)
//      .setid("toy-" + Math.random().toString(36).substring(2, 15))
//    .build();

 
  await dbOrder.delete(IdOrder.getid());
 console.log("Orders: ",(await dbOrder.getall()).length);

  

}
 DBSendBox().catch((error)=>{
     logger.error("Error in DB SendBox: " + (error as Error).message);
 });
    

