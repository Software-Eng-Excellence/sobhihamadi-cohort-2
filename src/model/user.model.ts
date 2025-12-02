import { ID, id } from "repository/IRepository";
import {roles} from "../config/roles"

export type UserID = ID;

export interface IUser {
  id: UserID;
  name: string;
  email: string;
  password: string;
  role:roles

}

export class User implements IUser, id {
  public id: UserID;
  public name: string;
  public email: string;
  public password: string;
  public role:roles

  constructor(data: IUser, role:roles= roles.user) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.role=role
  }

  // this is required by interface `id`
  public getid(): ID {
    return this.id;
  }
}
