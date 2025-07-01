import { readXML, writeXML } from '../../src/util/parsers/xmlparser';
import * as fs from 'fs';
import * as path from 'path';

describe('XML Parser ', () => {
  const mockDir = path.join(__dirname, 'mock');
  const xmlFile = path.join(mockDir, 'data.xml');
  const emptyFile = path.join(mockDir, 'empty.xml');
  const invalidFilePath = path.join(mockDir, 'non-existent', 'invalid.xml');

const testData = {
  product: [
    { id: "1", name: 'Laptop', price: "1200" },
    { id: "2", name: 'Chair', price: "150" }
  ]
};

  const xmlContent = `
    <store>
      <product>
        <id>1</id>
        <name>Laptop</name>
        <price>1200</price>
      </product>
      <product>
        <id>2</id>
        <name>Chair</name>
        <price>150</price>
      </product>
</store>
  `.trim();

 beforeAll(() => {
  if (!fs.existsSync(mockDir)) {
    fs.mkdirSync(mockDir);
  }
});

  beforeEach(() => {
    fs.writeFileSync(xmlFile, xmlContent, 'utf-8');
    fs.writeFileSync(emptyFile, '', 'utf-8');
  });

  afterEach(() => {
    try { fs.unlinkSync(xmlFile); }
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

  it('reads data from XML correctly', async () => {
    const result = await readXML(xmlFile);
    expect(result).toEqual(testData);
  });

 it('writes XML data and reads it back', async () => {
  const newData = {
    id: ["101", "102"],
    name: ["Notebook", "Pen"],
    price: ["5", "1"]
  };
  await writeXML(xmlFile, newData);
  const result = await readXML(xmlFile);
  expect(result).toEqual(newData);
});

  it('returns an empty object for empty XML file', async () => {
    const result = await readXML(emptyFile);
    expect(result).toBeNull();
  });

  it('throws an error if the file path for reading is invalid', async () => {
    await expect(readXML(invalidFilePath)).rejects.toThrow('Error reading XML file');
  });

  it('throws an error if trying to write to an invalid path', async () => {
    const dummyData = { error: 'No path' };
    await expect(writeXML(invalidFilePath, dummyData)).rejects.toThrow('Error writing XML file');
  });
});
