import logger from "./util/logger";
import { CakeOrderRepository } from "./repository/sqlite/CakeOrder.repository";
import config from "./config";
import { OrderRepository } from "./repository/sqlite/Order.repository";
import { cakebuilder, IdentifierCakeBuilder } from "./model/builders/cake.builder";

import { identifierOrderItemBuilder, OrderBuilder } from "./model/builders/Order.builder";


async function main() {
    const path= config.storagePath.csv.cake;

    const repository= new CakeOrderRepository();
    const data= await repository.get("55");
    logger.info("data from repository: \n %o", data);


}
async function DBSendBox() {
   const dbOrder= new OrderRepository(new CakeOrderRepository());

   await dbOrder.init();


   //create identifier cake
   const cake= cakebuilder.newbuilder()
   .settype("Birthday")
   .setflavor("Chocolate")
    .setfilling("Cream")    
    .setsize(8)
    .setlayers(2)
    .setfrostingType("Buttercream")
    .setfrostingFlavor("Vanilla")
    .setdecorationType("Sprinkles")
    .setdecorationColor("Rainbow")
    .setcustomMessage("Happy Birthday!")
    .setshape("Round")
    .setallergies("Nuts")
    .setspecialIngredients("Gluten-Free Flour")
    .setpackagingType("Box")
   .build();

const IdCake = IdentifierCakeBuilder.newbuilder()
.SetId("cake-" + Math.random().toString(36).substring(2, 15))
.SetCake(cake)
.Build();
   
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

   await dbOrder.create(IdOrder);
   await dbOrder.delete(IdOrder.getid());
   await dbOrder.update(IdOrder);

console.log((await dbOrder.getall()).length);


}
DBSendBox().catch((error)=>{
    logger.error("Error in DB SendBox: " + (error as Error).message);
});
    

