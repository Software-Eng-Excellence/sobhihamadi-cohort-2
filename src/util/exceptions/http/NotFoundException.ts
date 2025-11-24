import { HTTPException } from "./HttpExceptions";


export class NotFoundException extends HTTPException {
    constructor(message: string='Resource Not Found', details?: Record<string, unknown>) {
        super(404, message, details);
        this.name='Not Found Exception';
    }
}   
        