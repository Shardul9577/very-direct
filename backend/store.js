const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data', 'content.json');

function readContent() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writeContent(items) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
}

module.exports = { readContent, writeContent };
