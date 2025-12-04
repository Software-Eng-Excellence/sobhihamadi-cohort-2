import {IRepository } from "../repository/IRepository";
import { User, IUser, UserID } from "../model/user.model";
import { NotFoundException } from "../util/exceptions/http/NotFoundException";



export class UserService {


  constructor(  private readonly userRepository: IRepository<User>) {
    
  }


  

  public async create( data: Omit<IUser, "id">): Promise<User> {
    const id: UserID = `user-${Date.now()}`;
    const user = new User({ id, ...data });

    await this.userRepository.create(user);
    return user;
  }

  public async getall(): Promise<User[]> {
    return this.userRepository.getall();
  }

  public async get(id: UserID): Promise<User> {
    return this.userRepository.get(id); 
  }

  public async update(
    id: UserID,
    data:User
  ): Promise<User> {
    const existing = await this.userRepository.get(id);  

    if (data.name !== undefined) existing.name = data.name;
    if (data.email !== undefined) existing.email = data.email;
    if (data.password !== undefined) existing.password = data.password;
    if (data.role !== undefined) existing.role = data.role;

    await this.userRepository.update(existing);
    return existing;
  }

  public async delete(id: UserID): Promise<void> {
    await this.userRepository.get(id); 
    await this.userRepository.delete(id);
  }


    public async validateUserCredentials(email: string, password: string): Promise<User> {
   const user: User= await this.userRepository.getbyemail(email);
   if(!user){
    throw new NotFoundException("Invalid user credentials,user not found");
   }
   if(user.password !== password){
    throw new NotFoundException("Invalid user credentials");
   }
    return user;
  
  }

}
