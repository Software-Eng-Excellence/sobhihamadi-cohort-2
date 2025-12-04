import { promises as fs } from 'fs';
import { parseStringPromise, Builder } from 'xml2js';

/**
 * Reads an XML file and parses its content into a JavaScript object.
 * @param filePath Path to the XML file.
 * @returns Parsed object from the XML file.
 */
export async function readXML<T = string>(filePath: string): Promise<T> {
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const result = await parseStringPromise(fileContent, {
            explicitArray: false,
            mergeAttrs: true,
            explicitRoot: false,
            trim: true
        });
        return result as T;
    } catch (error) {
        throw new Error(`Error reading XML file: ${error}`);
    }
}

/**
 * Converts a JavaScript object to XML and writes it to a file.
 * @param filePath Path to the XML file.
 * @param data Data to be converted and written.
 */
export async function writeXML(filePath: string, data: string): Promise<void> {
    try {
        const builder = new Builder({ headless: true, renderOpts: { pretty: true } });
        const xmlContent = builder.buildObject(data);
        await fs.writeFile(filePath, xmlContent, 'utf-8');
    } catch (error) {
        throw new Error(`Error writing XML file: ${error}`);
    }
}