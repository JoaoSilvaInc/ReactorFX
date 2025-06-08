
import fs from 'fs';

/**
 * Loads a specific property from a JSON file in the project root.
 * @param filePath Absolute path of the JSON file containing the property (e.g., "src/file.json").
 * @param propertyKey Property name expected to be in the JSON file.
 * @returns The parsed object found for the given params.
 * @throws If the file or property is not found.
 */
export function readJsonProp<T = any>(filePath: string, propertyKey: string): T {
    if (!fs.existsSync(filePath)) {
        throw new Error(`[reactorfx] "${filePath}" not found.`);
    }
    const parsedJson = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    if (!(propertyKey in parsedJson)) {
        throw new Error(`[reactorfx] "${propertyKey}" not found in "${filePath}"`);
    }
    return parsedJson[propertyKey];
}

/**
 * Returns the current working directory of the Node.js process.
 *
 * @returns {string} The absolute path of the current working directory.
 */
export function getRootPath(): string {
    let dir = process.cwd();
    return dir;
}

