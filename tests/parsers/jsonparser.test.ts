import { readJSON, writeJSON } from '../../src/util/parsers/jsonparser';
import * as fs from 'fs';
import * as path from 'path';

describe('JSON Parser ', () => {
  const mockDir = path.join(__dirname, 'mock');
  const jsonFile = path.join(mockDir, 'data.json');
  const emptyFile = path.join(mockDir, 'empty.json');
  const invalidFilePath = path.join(mockDir, 'non-existent', 'invalid.json');

  const testData = {
    id: 1,
    title: 'Laptop',
    inStock: true,
    specs: { cpu: 'i7', ram: '16GB' }
  };

 beforeAll(() => {
  if (!fs.existsSync(mockDir)) {
    fs.mkdirSync(mockDir);
  }
});

  beforeEach(() => {
    fs.writeFileSync(jsonFile, JSON.stringify(testData, null, 2), 'utf-8');
    fs.writeFileSync(emptyFile, '{}', 'utf-8');
  });

  afterEach(() => {
    try { fs.unlinkSync(jsonFile); }
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

  it('reads data from JSON correctly', async () => {
    const result = await readJSON(jsonFile);
    expect(result).toEqual(testData);
  });

  it('writes JSON data and reads it back', async () => {
    const newData = {
      id: 2,
      title: 'Monitor',
      inStock: false
    };
    await writeJSON(jsonFile, newData);
    const result = await readJSON(jsonFile);
    expect(result).toEqual(newData);
  });

  it('returns an empty object if JSON is empty', async () => {
    const result = await readJSON(emptyFile);
    expect(result).toEqual({});
  });

  it('throws an error if the file path for reading is invalid', async () => {
    await expect(readJSON(invalidFilePath)).rejects.toThrow('Error reading JSON file');
  });

  it('throws an error if trying to write to an invalid path', async () => {
    const dummyData = { name: 'Test', score: 100 };
    await expect(writeJSON(invalidFilePath, dummyData)).rejects.toThrow('Error writing JSON file');
  });
});
