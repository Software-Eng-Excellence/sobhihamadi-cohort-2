import { promises as fs } from 'fs';

/**
 * Reads a JSON file and parses its content into a JavaScript object.
 * @param filePath Path to the JSON file.
 * @returns Parsed object from the JSON file.
 */
export async function readJSON<T = any>(filePath: string): Promise<T> {
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent) as T;
    } catch (error) {
        throw new Error(`Error reading JSON file: ${error}`);
    }
}

/**
 * Stringifies a JavaScript object and writes it to a JSON file.
 * @param filePath Path to the JSON file.
 * @param data Data to be stringified and written.
 */
export async function writeJSON(filePath: string, data: any): Promise<void> {
    try {
        const jsonContent = JSON.stringify(data, null, 2);
        await fs.writeFile(filePath, jsonContent, 'utf-8');
    } catch (error) {
        throw new Error(`Error writing JSON file: ${error}`);
    }
}