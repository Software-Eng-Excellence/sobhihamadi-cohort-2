import { id } from "repository/IRepository";

export interface IItem {
    getCategory():ItemCategory; 


    
}

export interface identifierItem extends  IItem,id{
       
}

export enum ItemCategory {
Cake='Cake',
Book='Book',
Toy='Toy',


}