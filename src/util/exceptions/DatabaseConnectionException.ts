export class DatabaseConnectionException extends Error {
    constructor(message: string,error: Error) {
        super(message);
        this.name = "DatabaseConnectionException";
    }
}