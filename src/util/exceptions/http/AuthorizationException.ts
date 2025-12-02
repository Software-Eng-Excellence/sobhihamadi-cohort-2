import { HTTPException } from "./HttpExceptions";

export class AuthorizationException extends HTTPException {
    constructor(message: string) {
        super(403,message);
        this.name = "AuthenticationException";
    }

}

export class invalidRoleException extends AuthorizationException {
    constructor(role: string) {
        super("invalid role"+role);
        this.name = "AuthenticationException";
    }

}



export class insufficientPermissionException extends AuthorizationException{
    constructor() {
        super("invalid role");
        this.name = "AuthenticationException";
    }   
}