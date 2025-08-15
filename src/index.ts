import { ToyBuilder } from "./model/builders/toy.builder";
import { bookBuilder } from "./model/builders/book.builder";

import { cakebuilder } from "./model/builders/cake.builder";

async function main() {
    //  ToyBuilder 
    const newtoy = new ToyBuilder()
        .setType("Action Figure")
        .setAgeGroup("6-12")
        .setBrand("ToyBrand")
        .setMaterial("Plastic")
        .setBatteryRequired(false)
        .setEducational(true);
    const toy = newtoy.build();


// BookBuilder


    const newbook = new bookBuilder()
        .setBookTitle("The Great Adventure")
        .setAuthor("John Doe")
        .setGenre("Adventure")  
        .setFormat("Hardcover")
        .setLanguage("English")
        .setPublisher("Adventure Press")
        .setSpecialEdition("Limited Edition")
        .setPackaging("Gift Wrap");
    const book = newbook.build();
    console.log("Book created successfully:", book);


// const newCake = new cakebuilder()
//     .settype("Chocolate")
//     .setflavor("Dark Chocolate")
//     .setfilling("Chocolate Ganache")
//     .setsize(10)
//     .setlayers(3)
//     .setfrostingType("Buttercream")
//     .setfrostingFlavor("Vanilla")
//     .setdecorationType("Sprinkles")
//     .setdecorationColor("Rainbow")
//     .setcustomMessage("Happy Birthday!")
//     .setshape("Round")
//     .setallergies("None")
//     .setspecialIngredients("Organic Ingredients")
//     .setpackagingType("Eco-friendly Box");

// const cake = newCake.build();
console.log("Cake created successfully:", toy);};
main();