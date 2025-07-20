
const fs = require('fs').promises; 
const path = require('path');

/**
 * Reads data from a JSON file. If the file doesn't exist, returns an empty array.
 * @param {string} filename 
 * @returns {Promise<Array<Object>>}
 */
async function readJsonFile(filename) {
    const filePath = path.join(__dirname, '..', 'data', filename); 
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT' || error instanceof SyntaxError) {
            console.log(`File ${filename} not found or empty/corrupt. Initializing with empty array.`);
            return [];
        }
        throw error; 
    }
}

/**
 * Writes data to a JSON file.
 * @param {string} filename - The name of the file to write (e.g., 'users.json').
 * @param {Array<Object>} data - The data array to write.
 * @returns {Promise<void>} A promise that resolves when the write operation is complete.
 */
async function writeJsonFile(filename, data) {
    const dataDir = path.join(__dirname, '..', 'data');
    const filePath = path.join(dataDir, filename);

    await fs.mkdir(dataDir, { recursive: true });

    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Data written to ${filename}`);
}

module.exports = {
    readJsonFile,
    writeJsonFile
};
