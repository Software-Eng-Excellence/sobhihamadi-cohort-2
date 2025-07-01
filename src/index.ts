import logger from "./util/logger";
import { readCSV } from './util/parsers/csvparser';
import { readJSON } from './util/parsers/jsonparser';
import { readXML } from './util/parsers/xmlparser';

async function main() {
    // CSV data
    const csvData = await readCSV("../data/cake orders.csv");
    csvData.forEach((row: any) => logger.info(`CSV data: ${row}`)); 

    // JSON data
    const jsonData = await readJSON("./src/data/book orders.json");
    jsonData.forEach((row: object) => logger.info(`JSON data: ${JSON.stringify(row)}`));

    // XML data
    const xmlData = await readXML("./src/data/toy orders.xml");
    const rows = xmlData.data.row;  // assuming rows is always an array
    rows.forEach((row: object) => logger.info(`XML data: ${JSON.stringify(row)}`));
}

main();