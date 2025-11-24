

export class APIException extends Error {
   public statusCode: number;
    constructor(message: string, statusCode: number,) {
        super(message);
        this.name = 'APIException';
      
        this.message=message;
        this.statusCode = statusCode;
    }

        
    }