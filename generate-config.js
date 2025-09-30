// generate-config.js
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const config = {
  API_KEY: process.env.API_KEY
};

if (!config.API_KEY) {
    console.error('ERROR: API_KEY is not defined in your environment variables or .env file.');
    process.exit(1);
}

const configContent = `window.APP_CONFIG = ${JSON.stringify(config, null, 2)};`;

// We assume the output directory for static files is the root for simplicity,
// as there's no build process creating a 'dist' or 'build' folder.
const outputPath = path.join(__dirname, 'config.js');

fs.writeFileSync(outputPath, configContent);

console.log(`Configuration file created at ${outputPath}`);
