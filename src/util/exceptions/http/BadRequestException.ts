import { HTTPException } from "./HttpExceptions";



export class BadRequestException extends HTTPException {

    constructor(
        message: string='Bad Request',
        details?: Record<string, unknown>
    ) {
        super(400,message,details);
        this.name='Bad Request Exception';
    }
}