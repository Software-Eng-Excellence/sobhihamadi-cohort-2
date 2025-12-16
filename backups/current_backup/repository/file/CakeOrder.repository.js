"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cakeOrderRepository = void 0;
const OrderMapper_1 = require("../../mappers/OrderMapper");
const order_repository_1 = require("./order.repository");
const CakeMapper_1 = require("../../mappers/CakeMapper");
const csvparser_1 = require("../../util/parsers/csvparser");
const repositoryExceptions_1 = require("../../util/exceptions/repositoryExceptions");
class cakeOrderRepository extends order_repository_1.OrderRepository {
    constructor(filepath) {
        super();
        this.filepath = filepath;
        this.mapper = new OrderMapper_1.CSVOrderMapper(new CakeMapper_1.CSVCakeMapper());
    }
    async load() {
        try {
            // read 2d the csv file
            const csv = await (0, csvparser_1.readCSV)(this.filepath);
            //return the list of objects
            return csv.map(this.mapper.map.bind(this.mapper));
        }
        catch {
            throw new repositoryExceptions_1.DbException("Failed to load data from CSV file.");
        }
    }
    async save(orders) {
        try {
            const Header = [
                "Type", "Flavor", "Filling", "Size", "Layers", "FrostingType", "FrostingFlavor", "DecorationType", "DecorationColor",
                "CustomMessage", "Shape", "Allergies", "SpecialIngredients", "PackagingType", "Price", "Quantity"
            ];
            //convert orders to 2d string
            const rawItems = orders.map(this.mapper.reverseMap.bind(this.mapper));
            await (0, csvparser_1.writeCSV)(this.filepath, [Header, ...rawItems]);
        }
        // generate the list of headers
        catch {
            throw new repositoryExceptions_1.DbException("Failed to load data from CSV file.");
        }
    }
}
exports.cakeOrderRepository = cakeOrderRepository;
//# sourceMappingURL=CakeOrder.repository.js.map