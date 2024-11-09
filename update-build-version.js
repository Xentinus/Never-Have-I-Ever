const fs = require('fs');
const path = require('path');

const date = new Date();
const year = date.getFullYear().toString().slice(-2);
const month = String(date.getMonth() + 1).padStart(2, '0');
const day = String(date.getDate()).padStart(2, '0');
const version = `${year}.${month}${day}`;

const filePath = path.join(__dirname, 'src', 'constants', 'build.js');
const content = `// This file is auto-generated during build
export const BUILD_VERSION = '${version}' // Format: YY.MMDD
`;

fs.writeFileSync(filePath, content);
console.log(`Updated build version to ${version}`);