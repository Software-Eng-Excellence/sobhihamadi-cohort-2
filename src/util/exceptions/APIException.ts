

export class APIException extends Error {
   public statusCode: number;
    constructor(message: string, statusCode: number,error: Error) {
        super(message);
        this.name = 'APIException';
        this.stack = error.stack;
        this.message=`${message}: ${error.message}`;
        this.statusCode = statusCode;
    }

        
    }