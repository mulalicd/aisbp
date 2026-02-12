const fs = require('fs');
const path = require('path');

const inputPath = process.argv[2] || path.join(__dirname, '..', '..', 'AI SOLVED BUSINESS PROBLEMS.txt');
const outPath = path.join(__dirname, '..', '..', 'data', 'ustav.json');

function readBook(p) {
  return fs.readFileSync(p, 'utf8');
}

function extractAllProblems(text) {
  // Split by lines for more reliable matching
  const lines = text.split(/\r?\n/);
  const problems = [];
  
  let currentProblem = null;
  let currentSection = null;
  let inPrompt = false;
  let promptContent = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for PROBLEM X.Y header
    const problemMatch = line.match(/^PROBLEM\s+(\d+)\.(\d+)\s*$/);
    if (problemMatch) {
      // Save previous problem if exists
      if (currentProblem) {
        if (currentSection) {
          currentProblem.sections.push(currentSection);
          currentSection = null;
        }
        problems.push(currentProblem);
      }
      
      const chapterNum = parseInt(problemMatch[1], 10);
      const problemNum = parseInt(problemMatch[2], 10);
      currentProblem = {
        chapterNum,
        problemNum,
        id: `${chapterNum}.${problemNum}`,
        sections: [],
        prompts: [],
        raw: []
      };
      continue;
    }
    
    if (!currentProblem) continue;
    
    // Check for SECTION X header
    const sectionMatch = line.match(/^SECTION\s+(\d+)\s*$/);
    if (sectionMatch) {
      // Save previous section
      if (currentSection) {
        currentProblem.sections.push(currentSection);
      }
      currentSection = {
        number: parseInt(sectionMatch[1], 10),
        content: ''
      };
      continue;
    }
    
    // Check for BEGIN PROMPT
    if (line.match(/^<<<\s*BEGIN\s*PROMPT\s*>>>\s*$/)) {
      inPrompt = true;
      promptContent = '';
      continue;
    }
    
    // Check for END PROMPT
    if (line.match(/^<<<\s*END\s*PROMPT\s*>>>\s*$/)) {
      if (inPrompt && promptContent.trim()) {
        currentProblem.prompts.push(promptContent.trim());
      }
      inPrompt = false;
      promptContent = '';
      continue;
    }
    
    // Accumulate section or prompt content
    if (inPrompt) {
      promptContent += line + '\n';
    } else if (currentSection) {
      currentSection.content += line + '\n';
    }
    
    currentProblem.raw.push(line);
  }
  
  // Save final problem and section
  if (currentSection && currentProblem) {
    currentProblem.sections.push(currentSection);
  }
  if (currentProblem) {
    problems.push(currentProblem);
  }
  
  return problems;
}

function buildChapters(problems) {
  const chaptersMap = {};
  
  problems.forEach(p => {
    if (!chaptersMap[p.chapterNum]) {
      chaptersMap[p.chapterNum] = { number: p.chapterNum, problems: [] };
    }
    
    // Clean up section content (trim each line)
    const cleanedSections = p.sections.map(s => ({
      number: s.number,
      content: s.content.trim().split('\n').map(l => l.trim()).filter(l => l).join('\n')
    }));
    
    // Clean up prompts
    const cleanedPrompts = p.prompts.map(p => p.trim().split('\n').map(l => l.trim()).filter(l => l).join('\n'));
    
    chaptersMap[p.chapterNum].problems.push({
      id: p.id,
      title: p.raw.length > 0 ? p.raw[0] : `Problem ${p.id}`,
      sections: cleanedSections,
      prompts: cleanedPrompts
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

  console.log('\n🚀 Parsing (line-by-line state machine)...');
  const out = buildOutput(inputPath, text);

  console.log('\n📊 PARSING STATISTICS:');
  console.log('   Chapters parsed:', out.totalChapters);
  console.log('   Problems parsed:', out.totalProblems);
  
  // Log sample of first problem
  if (out.chapters[0] && out.chapters[0].problems[0]) {
    const p = out.chapters[0].problems[0];
    console.log('\n📄 Sample Problem ' + p.id + ':');
    console.log('   - Sections: ' + p.sections.length);
    console.log('   - Prompts: ' + p.prompts.length);
    if (p.sections.length > 0) {
      console.log('   - Section 1 length: ' + p.sections[0].content.length + ' chars');
    }
  }

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
