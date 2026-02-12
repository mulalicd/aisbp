const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../data/ustav.json');
if (!fs.existsSync(filePath)) {
  console.error('File not found:', filePath);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const totalChapters = Array.isArray(data.chapters) ? data.chapters.length : 0;
const totalProblems = data.chapters ? data.chapters.reduce((s, c) => s + (c.problems ? c.problems.length : 0), 0) : 0;
const totalPrompts = data.chapters ? data.chapters.reduce((s, c) => s + (c.problems ? c.problems.reduce((ps, p) => ps + (p.prompts ? p.prompts.length : 0), 0) : 0), 0) : 0;

data.metadata = data.metadata || {};
data.metadata.totalChapters = totalChapters;
data.metadata.totalProblems = totalProblems;
data.metadata.totalPrompts = totalPrompts;

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('Updated metadata:', data.metadata);
console.log('Wrote', filePath);
