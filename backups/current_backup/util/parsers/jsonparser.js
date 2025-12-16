"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readJSON = readJSON;
exports.writeJSON = writeJSON;
const fs_1 = require("fs");
/**
 * Reads a JSON file and parses its content into a JavaScript object.
 * @param filePath Path to the JSON file.
 * @returns Parsed object from the JSON file.
 */
async function readJSON(filePath) {
    try {
        const fileContent = await fs_1.promises.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    }
    catch (error) {
        throw new Error(`Error reading JSON file: ${error}`);
    }
}
/**
 * Stringifies a JavaScript object and writes it to a JSON file.
 * @param filePath Path to the JSON file.
 * @param data Data to be stringified and written.
 */
async function writeJSON(filePath, data) {
    try {
        const jsonContent = JSON.stringify(data, null, 2);
        await fs_1.promises.writeFile(filePath, jsonContent, 'utf-8');
    }
    catch (error) {
        throw new Error(`Error writing JSON file: ${error}`);
    }
}
//# sourceMappingURL=jsonparser.js.map