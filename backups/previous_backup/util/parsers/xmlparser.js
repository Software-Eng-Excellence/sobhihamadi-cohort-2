"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readXML = readXML;
exports.writeXML = writeXML;
const fs_1 = require("fs");
const xml2js_1 = require("xml2js");
/**
 * Reads an XML file and parses its content into a JavaScript object.
 * @param filePath Path to the XML file.
 * @returns Parsed object from the XML file.
 */
async function readXML(filePath) {
    try {
        const fileContent = await fs_1.promises.readFile(filePath, 'utf-8');
        const result = await (0, xml2js_1.parseStringPromise)(fileContent, {
            explicitArray: false,
            mergeAttrs: true,
            explicitRoot: false,
            trim: true
        });
        return result;
    }
    catch (error) {
        throw new Error(`Error reading XML file: ${error}`);
    }
}
/**
 * Converts a JavaScript object to XML and writes it to a file.
 * @param filePath Path to the XML file.
 * @param data Data to be converted and written.
 */
async function writeXML(filePath, data) {
    try {
        const builder = new xml2js_1.Builder({ headless: true, renderOpts: { pretty: true } });
        const xmlContent = builder.buildObject(data);
        await fs_1.promises.writeFile(filePath, xmlContent, 'utf-8');
    }
    catch (error) {
        throw new Error(`Error writing XML file: ${error}`);
    }
}
//# sourceMappingURL=xmlparser.js.map