import  config from '../config';
import winston from 'winston'; 

const {logDir, isDev} = config

const logfileformat = winston.format.combine(
    winston.format.timestamp({format: 'HH:mm:ss'}),
    winston.format.json(),
    winston.format.splat(),
    winston.format.errors({ stack: true }),
);
const consoleformat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
        winston.format.splat(),
    winston.format.simple(),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
        return `[s] [${level}]: ${message} ${stack || ""}` ;
  
    }
    )
);

const logger = winston.createLogger({
    level: 'info',
    transports: [
        
        new winston.transports.File({ filename: 'error.log',dirname: logDir, level: 'error', format: logfileformat }),
        new winston.transports.File({ filename: 'all.log' ,dirname:logDir,format: logfileformat})
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: 'exceptions.log', dirname: logDir})
    ],


});
if (isDev) {
    logger.add(new winston.transports.Console({
        format: consoleformat,
        level: 'debug',
    }))
};
    console.log("Logger initialized")
export default logger;