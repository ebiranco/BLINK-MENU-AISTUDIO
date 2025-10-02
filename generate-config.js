// generate-config.js
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file in the root
dotenv.config({ path: path.resolve(__dirname, '.env') });

const config = {
  API_KEY: process.env.API_KEY || null,
};

if (!config.API_KEY) {
    console.warn('\x1b[33m%s\x1b[0m', 'WARNING: API_KEY is not defined in your .env file.');
    console.warn('The application will not be able to connect to the AI services.');
    console.warn('Please create a .env file in the project root and add your API_KEY.');
    config.API_KEY = 'YOUR_API_KEY_IS_MISSING'; // Add a non-functional placeholder
}

const configContent = `window.APP_CONFIG = ${JSON.stringify(config, null, 2)};`;

// Output the config.js file to the public directory so Vite can include it.
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)){
    fs.mkdirSync(publicDir);
}
const outputPath = path.join(publicDir, 'config.js');

fs.writeFileSync(outputPath, configContent);

console.log(`\x1b[32m%s\x1b[0m`, `Configuration file created at ${outputPath}`);
