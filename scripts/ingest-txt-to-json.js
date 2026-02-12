const fs = require('fs');
const path = require('path');

// Path to the source TXT file (user-provided book)
const srcPath = path.join(__dirname, '..', 'AI SOLVED BUSINESS PROBLEMS.txt');
const outDir = path.join(__dirname, '..', 'data');
const outPath = path.join(outDir, 'ustav-from-txt.json');

function safeId(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0,40);
}

if (!fs.existsSync(srcPath)) {
  console.error('Source TXT not found at', srcPath);
  process.exit(2);
}

const raw = fs.readFileSync(srcPath, 'utf8');

// Build a simple JSON structure embedding the entire book text.
const metadata = {
  title: 'AI SOLVED BUSINESS PROBLEMS',
  sourceFile: path.basename(srcPath),
  importedAt: new Date().toISOString(),
  note: 'Full raw text imported as a single problem. Use this file as authoritative source until a finer parser is applied.'
};

const chapter = {
  id: 'full_book',
  number: 1,
  title: metadata.title,
  intro: raw.substring(0, 800),
  problems: [
    {
      id: 'full_text',
      number: 1,
      title: 'Full Book Text',
      severity: 'INFO',
      narrative: raw,
      sections: {
        fullText: raw
      }
    }
  ]
};

const out = {
  metadata,
  chapters: [chapter]
};

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
console.log('Wrote', outPath);
