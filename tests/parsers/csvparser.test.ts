import { readCSV, writeCSV } from '../../src/util/parsers/csvparser';
import * as fs from 'fs';
import * as path from 'path';

describe('CSV Parser ', () => {
  const mockDir = path.join(__dirname, 'mock');
  const csvFile = path.join(mockDir, 'products.csv');
  const emptyFile = path.join(mockDir, 'empty.csv');
  const invalidFilePath = path.join(mockDir, 'non-existent', 'invalid.csv');

  const testData: string[][] = [
    ['ID', 'Name', 'Category', 'Price'],
    ['1', 'Mouse', 'Electronics', '25'],
    ['2', 'Desk', 'Furniture', '150'],
    ['3', 'Pen', 'Stationery', '3']
  ];

  beforeAll(() => {
    
     if (!fs.existsSync(mockDir)) {
        fs.mkdirSync(mockDir);
      }
    
  });

  beforeEach(() => {
    fs.writeFileSync(csvFile, testData.map(row => row.join(',')).join('\n'), 'utf-8');
    fs.writeFileSync(emptyFile, '', 'utf-8');
  });

  afterEach(() => {
    try { fs.unlinkSync(csvFile); }
     catch {
        //ignore error
    }
    try { fs.unlinkSync(emptyFile); } 
    catch {
        //ignore error
    }
  });

  afterAll(() => {
    try { fs.rmdirSync(mockDir); } catch {}
  });

  it('reads data from CSV correctly (default settings)', async () => {
    const result = await readCSV(csvFile);
    expect(result).toEqual(testData);
  });

  it('includes header when specified in readCSV()', async () => {
    const result = await readCSV(csvFile, true);
    expect(result).toEqual(testData);
  });

  it('returns an empty array ', async () => {
    const result = await readCSV(emptyFile);
    expect(result).toEqual([]);
  });

  it('write CSV data and read it ', async () => {
    const newEntries = [
      ['ID', 'Item', 'Price'],
      ['101', 'Laptop', '1200'],
      ['102', 'Chair', '95']
    ];
    await writeCSV(csvFile, newEntries);
    const result = await readCSV(csvFile);
    expect(result).toEqual(newEntries);
  });

  it('throws an error if the file path for reading is invalid', async () => {
    await expect(readCSV(invalidFilePath)).rejects.toThrow('Error reading CSV file');
  });

  it('throws an error if trying to write to an invalid path', async () => {
    const dummyData = [['user', 'Score'], ['sdww', '12']];
    await expect(writeCSV(invalidFilePath, dummyData)).rejects.toThrow('Error writing CSV file');
  });
});
