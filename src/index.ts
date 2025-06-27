import logger from './util/logger';
import { readCSV } from 'util/parser';

logger.info(readCSV('./data'));