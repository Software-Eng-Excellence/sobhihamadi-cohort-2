import { NextFunction, Request, Response } from "express";
import logger from "../util/logger";


const requestLogger = (req:Request, res:Response, next:NextFunction) => {
    const starttime=Date.now();
    res.on('finish', () => {
    
    const ResponseTime=Date.now()-starttime;
          const satus=res.statusCode;
    const { method, originalUrl } = req;
    
    const level=satus>=500?'error':satus>=400?'warn':'info';
    logger.log({level,message:`${method} ${satus} ${originalUrl} ${ResponseTime}ms`});
});


  
    next();
};

export default requestLogger;