import config from './config';
import express, {  Request, Response } from 'express';
import logger from './util/logger';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cors from 'cors';
import requestLogger from './middleware/requestLogger';
import routes from './routes';
import cookieParser from 'cookie-parser'
import { HTTPException } from './util/exceptions/http/HttpExceptions';
const app=express();

//config helmet
app.use(helmet());

//config body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//config cors
app.use(cors())

//config middleware
app.use(requestLogger);

//cookie parser
app.use(cookieParser())

//config routes
app.use('/', routes);

//config 404 handler
app.use((req, res)=>{
    res.status(404).json({error:'Not Found'});
});

app.use('/', routes);
app.use((err:Error, req:Request, res:Response)=>{
     if(err instanceof HTTPException){
          const HttpExceptions=err as HTTPException;
          logger.error("%s %d %s %o", HttpExceptions.name, HttpExceptions.status
               , HttpExceptions.message, HttpExceptions.details);
          res.status(HttpExceptions.status).json({
               message:HttpExceptions.message,
               details:HttpExceptions.details || undefined
          });
     }
     else{
          logger.error(`Unhandled Exception: %s`, err.message);
          res.status(500).json({
               message:'Internal Server Error'
          });
     }
});

app.listen(config.port, config.host,()=>{
 console.log('Server is running on http:// %s:%d',config.host,config.port);
    logger.info('Server is running on http:// %s:%d',config.host,config.port);

});