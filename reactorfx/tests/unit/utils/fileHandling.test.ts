
import fs from 'fs';
import { readJsonProp } from '../../../src/utils/fileHandling';

jest.mock('fs');

describe('getJsonProp', () => {

    const filePath = '/mocked/path/file.json';
    const propertyKey = 'testKey';

    beforeEach(() => {
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        (fs.readFileSync as jest.Mock).mockReturnValue('{"testKey": "testValue"}');
    })

    it('should throw an error if file does not exist', () => {
        (fs.existsSync as jest.Mock).mockReturnValue(false);
        expect(() => readJsonProp(filePath, propertyKey)).toThrow(`[reactorfx] "${filePath}" not found.`);
        expect(fs.existsSync).toHaveBeenCalledWith(filePath);
    });

    it('should returns a property if file exists', () => {
        const result = readJsonProp(filePath, propertyKey);
        expect(result).toEqual('testValue');
        expect(fs.existsSync).toHaveBeenCalledWith(filePath);
        expect(fs.readFileSync).toHaveBeenCalledWith(filePath, 'utf-8');
    });

    it('should throw an error if property does not exist in file', () => {
        expect(() => readJsonProp(filePath, 'nonExistentKey')).toThrow(`[reactorfx] "nonExistentKey" not found in "${filePath}"`);
        expect(fs.existsSync).toHaveBeenCalledWith(filePath);
        expect(fs.readFileSync).toHaveBeenCalledWith(filePath, 'utf-8');
    });
})