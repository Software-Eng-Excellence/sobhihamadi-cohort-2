import logger from "./util/logger";
import { CSVCakeMapper } from "../src/mappers/CakeMapper";
import { readCSV } from "./util/parser";
import { CSVOrderMapper } from "./mappers/OrderMapper";

async function main() {
    const data= await readCSV('src/data/data/cake orders.csv');
    const cakeMapper = new CSVCakeMapper();
    const orderMapper = new CSVOrderMapper(cakeMapper);
    const orders= data.map(orderMapper.map.bind(orderMapper));


    
    logger.info("list of orders: \n %o", orders);

}
    
main();
