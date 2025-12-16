"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readCSV = readCSV;
exports.writeCSV = writeCSV;
const fs_1 = require("fs");
const sync_1 = require("csv-parse/sync");
const sync_2 = require("csv-stringify/sync");
async function readCSV(filePath) {
    try {
        const fileContent = await fs_1.promises.readFile(filePath, 'utf-8');
        return (0, sync_1.parse)(fileContent, {
            skip_empty_lines: true
        });
    }
    catch (error) {
        throw new Error(`Error reading CSV file:alal ${error}`);
    }
}
async function writeCSV(filePath, data) {
    try {
        const csvContent = (0, sync_2.stringify)(data);
        await fs_1.promises.writeFile(filePath, csvContent);
    }
    catch (error) {
        throw new Error(`Error writing CSV file: ${error}`);
    }
}
//# sourceMappingURL=parser.js.map