import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { BadRequestException } from "../util/exceptions/http/BadRequestException";
import { roles, toRoles } from "../config/roles";


export class UserController {
  constructor(private readonly userService: UserService) {}

 


  

  public async createUser(req: Request, res: Response) {
    this.validateCreateBody(req.body);

    const { name, email, password } = req.body;
    const user = await this.userService.create({ name, email, password,role:toRoles('user')});
    const createuser=await this.userService.get(user.id);
    res.status(201).json({
      id: createuser.id,
      name: createuser.name,
      email: createuser.email,
      role:createuser.role
    });
  }

  public async getAllUsers(_req: Request, res: Response) {
    const users = await this.userService.getall();

    res.status(200).json(
      users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        password:u.password,
        role:u.role
      }))
    );
  }

  public async getUserById(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      throw new BadRequestException("User id is required", {
        UserIdMissing: true,
      });
    }

    const user = await this.userService.get(id);

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role:user.role
      
    });
  }

  public async updateUser(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      throw new BadRequestException("User id is required", {
        UserIdMissing: true,
      });
    }

    this.validateUpdateBody(req.body);

    const updated = await this.userService.update(id, req.body);

    res.status(200).json({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role:updated.role
    });
  }

  public async deleteUser(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      throw new BadRequestException("User id is required", {
        UserIdMissing: true,
      });
    }

    await this.userService.delete(id);
    res.status(204).send();
  }



   private validateEmail(email: unknown) {
    if (email === undefined || email === null || typeof email !== "string") {
      throw new BadRequestException(
        "Email is required and must be a string",
        {
          EmailMissing: email === undefined || email === null,
          EmailTypeInvalid: typeof email !== "string",
        }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException("Email is not valid", {
        InvalidEmail: true,
      });
    }
  }

  private validateCreateBody(body: any) {
    const { name, email, password } = body ?? {};

    if (!name || typeof name !== "string") {
      throw new BadRequestException(
        "Name is required and must be a string",
        {
          NameMissing: !name,
          NameTypeInvalid: typeof name !== "string",
        }
        
      );
    }

    this.validateEmail(email);

    if (!password || typeof password !== "string") {
      throw new BadRequestException(
        "Password is required and must be a string",
        {
          PasswordMissing: !password,
          PasswordTypeInvalid: typeof password !== "string",
        }
      );
    }
  }

  private validateUpdateBody(body: any) {
    const { name, email, password,role } = body ?? {};

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length === 0) {
        throw new BadRequestException("Name must be a non-empty string", {
          InvalidName: true,
        });
      }
    }

    if (email !== undefined) {
      this.validateEmail(email);
    }

    if (password !== undefined && typeof password !== "string") {
      throw new BadRequestException("Password must be a string", {
        PasswordTypeInvalid: true,
      });
    }
        if (role !== undefined && !Object.values(roles).includes(role)) {
    throw new BadRequestException("Invalid role value", {
      InvalidRole: true,
    });
    }
  }


  
}
