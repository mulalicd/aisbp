const fs = require('fs');
const path = require('path');

const inputPath = process.argv[2] || path.join(__dirname, '..', '..', 'AI SOLVED BUSINESS PROBLEMS.txt');
const outPath = path.join(__dirname, '..', '..', 'data', 'ustav.json');

function readBook(p) {
  return fs.readFileSync(p, 'utf8');
}

function extractAllProblems(text) {
  // Extract all PROBLEM X.Y blocks globally
  const problems = [];
  const problemRegex = /^PROBLEM\s+(\d+)\.(\d+)\s*\n([\s\S]*?)(?=^PROBLEM\s+\d+\.\d+|^CHAPTER\s+\d+(?!\.\d)|$)/gim;
  let m;
  while ((m = problemRegex.exec(text)) !== null) {
    const chapterNum = parseInt(m[1], 10);
    const problemNum = parseInt(m[2], 10);
    const id = `${chapterNum}.${problemNum}`;
    const content = m[3].trim();
    
    // Extract sections
    const sections = [];
    const sectionRegex = /^SECTION\s+(\d+)\s*\n([\s\S]*?)(?=^SECTION\s+\d+|^PROBLEM\s+\d+\.\d+|$)/gim;
    let sm;
    while ((sm = sectionRegex.exec(content)) !== null) {
      sections.push({ number: parseInt(sm[1], 10), content: sm[2].trim() });
    }
    
    // Extract prompts (enclosed in <<< BEGIN PROMPT >>> ... <<< END PROMPT >>>)
    const prompts = [];
    const promptRegex = /<<<\s*BEGIN\s*PROMPT\s*>>>([\s\S]*?)<<<\s*END\s*PROMPT\s*>>>/gim;
    let pm;
    while ((pm = promptRegex.exec(content)) !== null) {
      prompts.push(pm[1].trim());
    }
    
    problems.push({ chapterNum, problemNum, id, sections, prompts, raw: content });
  }
  return problems;
}

function buildChapters(problems) {
  const chaptersMap = {};
  
  problems.forEach(p => {
    if (!chaptersMap[p.chapterNum]) {
      chaptersMap[p.chapterNum] = { number: p.chapterNum, problems: [] };
    }
    chaptersMap[p.chapterNum].problems.push({
      id: p.id,
      sections: p.sections,
      prompts: p.prompts
    });
  });
  
  const chapters = Object.keys(chaptersMap)
    .map(k => parseInt(k, 10))
    .sort((a, b) => a - b)
    .map(num => {
      const ch = chaptersMap[num];
      return {
        number: num,
        title: `Chapter ${num}`,
        problems: ch.problems
      };
    });
  
  return chapters;
}

function buildOutput(inputPath, text) {
  const allProblems = extractAllProblems(text);
  const chapters = buildChapters(allProblems);
  const totalProblems = allProblems.length;
  
  return {
    source: inputPath,
    generatedAt: new Date().toISOString(),
    totalChapters: chapters.length,
    totalProblems,
    chapters
  };
}

function saveOutput(obj, p) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(obj, null, 2), 'utf8');
}

function main() {
  console.log('📖 Loaded book:', inputPath);
  const text = readBook(inputPath);
  console.log('   Lines:', text.split(/\r?\n/).length, ' Chars:', text.length);

  console.log('\n🚀 Parsing (extracting all PROBLEM blocks globally)...');
  const out = buildOutput(inputPath, text);

  console.log('\n📊 PARSING STATISTICS:');
  console.log('   Chapters parsed:', out.totalChapters);
  console.log('   Problems parsed:', out.totalProblems);

  saveOutput(out, outPath);
  const stats = fs.statSync(outPath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  const lines = fs.readFileSync(outPath, 'utf8').split(/\r?\n/).length;
  console.log('\n💾 Saved to:', outPath);
  console.log('   File size:', sizeMB, 'MB');
  console.log('   Lines:', lines);
  console.log('\n✅ Parsing complete');
}

main();


function saveOutput(obj, p) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(obj, null, 2), 'utf8');
}

function main() {
  console.log('📖 Loaded book:', inputPath);
  const text = readBook(inputPath);
  console.log('   Lines:', text.split(/\r?\n/).length, ' Chars:', text.length);

  console.log('\n🚀 Parsing (TOC-stripping + chapter/problem extraction)...');
  const out = buildOutput(inputPath, text);

  console.log('\n📊 PARSING STATISTICS:');
  console.log('   Chapters parsed:', out.totalChapters);
  console.log('   Problems parsed:', out.totalProblems);

  saveOutput(out, outPath);
  const stats = fs.statSync(outPath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  const lines = fs.readFileSync(outPath, 'utf8').split(/\r?\n/).length;
  console.log('\n💾 Saved to:', outPath);
  console.log('   File size:', sizeMB, 'MB');
  console.log('   Lines:', lines);
  console.log('\n✅ Parsing complete');
}

main();
