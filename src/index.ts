import config from './config';
import express, { NextFunction, Request, request, Response, response } from 'express';
import logger from './util/logger';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cors from 'cors';
import requestLogger from './middleware/requestLogger';
import routes from './routes';
import { APIException } from './util/exceptions/APIException';


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

//config routes
app.use('/', routes);

//config 404 handler
app.use((req, res)=>{
    res.status(404).json({error:'Not Found'});
});

app.use('/', routes);
app.use((err:Error, req:Request, res:Response, next:NextFunction)=>{
     if(err instanceof APIException){
          const APIException=err as APIException;
          logger.error(`APIException: with status %d %s`, APIException.statusCode, err.message);
          res.status(APIException.statusCode).json({error:err.message});
     }
     else{
          logger.error(`Unhandled Exception: %s`, err.message);
          res.status(500).json({error:'Internal Server Error'});
     }
});


app.listen(config.port, config.host,()=>{
    logger.info('Server is running on http:// %s:%d',config.host,config.port);
});