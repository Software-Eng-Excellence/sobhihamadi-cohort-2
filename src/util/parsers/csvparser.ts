import { promises as fs } from 'fs';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

export async function readCSV(filePath: string,includeHeader: Boolean=false): Promise<string[][]> {
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return parse(fileContent, {
            skip_empty_lines: true
        });
    } catch (error) {
        throw new Error(`Error reading CSV file: ${error}`);
    }
}

export async function writeCSV(filePath: string, data: string[][]): Promise<void> {
    try {
        const csvContent = stringify(data);
        await fs.writeFile(filePath, csvContent);
    } catch (error) {
        throw new Error(`Error writing CSV file: ${error}`);
    }
}