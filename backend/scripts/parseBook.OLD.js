const fs = require('fs');
const path = require('path');

/**
 * AISBS Book Parser
 * Parsira AI SOLVED BUSINESS PROBLEMS.txt u strukturiran ustav.json
 */

// Load book content
const bookPath = path.join(__dirname, '../../AI SOLVED BUSINESS PROBLEMS.txt');
const bookText = fs.readFileSync(bookPath, 'utf8');

console.log('📖 Loading book...');
console.log(`   Total lines: ${bookText.split('\n').length}`);
console.log(`   Total characters: ${bookText.length}`);

// Parse preface
function parsePreface(text) {
  const prefaceStart = text.indexOf('PREFACE');
  const prefaceEnd = text.indexOf("WHAT'S ACTUALLY HAPPENING");
  
  if (prefaceStart === -1 || prefaceEnd === -1) {
    console.warn('⚠️  Preface not found');
    return '';
  }
  
  return text.substring(prefaceStart, prefaceEnd).trim();
}

// Parse chapter intro
function parseChapterIntro(chapterText) {
  const lines = chapterText.split('\n');
  const firstProblemIndex = chapterText.indexOf('PROBLEM ');
  
  if (firstProblemIndex === -1) {
    return chapterText.substring(0, 500); // First 500 chars as intro
  }
  
  return chapterText.substring(0, firstProblemIndex).trim();
}

// Parse chapter
function parseChapter(text, chapterNum) {
  console.log(`\n📑 Parsing Chapter ${chapterNum}...`);
  
  // Find chapter boundaries
  const chapterRegex = new RegExp(
    `CHAPTER ${chapterNum}\\n([\\s\\S]+?)(?=CHAPTER ${chapterNum + 1}|AFTERWORD|$)`,
    'm'
  );
  
  const match = text.match(chapterRegex);
  
  if (!match) {
    console.error(`❌ Chapter ${chapterNum} not found`);
    return null;
  }
  
  const chapterText = match[1];
  
  // Extract title (first line after CHAPTER N)
  const titleMatch = chapterText.match(/^(.+?)\n/);
  const fullTitle = titleMatch ? titleMatch[1].trim() : `Chapter ${chapterNum}`;
  
  // Split title and subtitle if " - " exists
  const [title, subtitle] = fullTitle.includes(' - ') 
    ? fullTitle.split(' - ').map(s => s.trim())
    : [fullTitle, ''];
  
  // Extract intro (text before first PROBLEM)
  const intro = parseChapterIntro(chapterText);
  
  // Parse all 5 problems for this chapter
  const problems = [];
  for (let pNum = 1; pNum <= 5; pNum++) {
    const problem = parseProblem(chapterText, chapterNum, pNum);
    if (problem) {
      problems.push(problem);
      console.log(`   ✅ Problem ${pNum}: ${problem.title}`);
    }
  }
  
  return {
    id: `ch${chapterNum}`,
    number: chapterNum,
    title: title,
    subtitle: subtitle,
    intro: intro,
    problems: problems
  };
}

// Parse problem
function parseProblem(chapterText, chapterNum, problemNum) {
  const problemId = `${chapterNum}.${problemNum}`;
  
  // Find problem boundaries
  const problemRegex = new RegExp(
    `PROBLEM ${problemId}\\n([\\s\\S]+?)(?=PROBLEM ${chapterNum}\\.${problemNum + 1}|CHAPTER|Chapter Summary|$)`,
    'm'
  );
  
  const match = chapterText.match(problemRegex);
  
  if (!match) {
    console.warn(`   ⚠️  Problem ${problemId} not found`);
    return null;
  }
  
  const problemText = match[1];
  
  // Extract title (first line after PROBLEM marker)
  const titleMatch = problemText.match(/^(.+?)\n/);
  const title = titleMatch ? titleMatch[1].trim() : `Problem ${problemId}`;
  
  // Parse sections
  const sections = {};
  for (let sectionNum = 1; sectionNum <= 8; sectionNum++) {
    const section = parseSection(problemText, sectionNum);
    const sectionNames = [
      '',
      'operationalReality',
      'whyTraditionalFails', 
      'managerDecisionPoint',
      'aiWorkflow',
      'executionPrompt',
      'businessCase',
      'industryContext',
      'failureModes'
    ];
    
    if (section && sectionNames[sectionNum]) {
      sections[sectionNames[sectionNum]] = section;
    }
  }
  
  // Extract prompts
  const prompts = extractPrompts(problemText, chapterNum, problemNum);
  
  // Parse business case
  const businessCase = parseBusinessCase(sections.businessCase);
  
  // Parse failure modes
  const failureModes = parseFailureModes(sections.failureModes);
  
  return {
    id: `ch${chapterNum}_p${problemNum}`,
    number: problemNum,
    title: title,
    sections: sections,
    prompts: prompts,
    businessCase: businessCase,
    failureModes: failureModes
  };
}

// Parse section
function parseSection(problemText, sectionNum) {
  const sectionRegex = new RegExp(
    `SECTION ${sectionNum}\\n([^\\n]+)\\n([\\s\\S]+?)(?=SECTION ${sectionNum + 1}|PROBLEM \\d+\\.\\d+|$)`,
    'm'
  );
  
  const match = problemText.match(sectionRegex);
  
  if (!match) {
    return null;
  }
  
  return {
    title: match[1].trim(),
    content: match[2].trim()
  };
}

// Extract prompts
function extractPrompts(problemText, chapterNum, problemNum) {
  const prompts = [];
  
  // Find all prompt blocks
  const promptBlockRegex = /# PROMPT (\\d+\\.\\d+):[^\\n]+\\n([\\s\\S]+?)<<< BEGIN PROMPT >>>\\n([\\s\\S]+?)<<< END PROMPT >>>/gm;
  
  let match;
  let promptIndex = 1;
  
  while ((match = promptBlockRegex.exec(problemText)) !== null) {
    const promptMeta = match[2];
    const promptCode = match[3];
    
    // Extract metadata
    const versionMatch = promptMeta.match(/\*\*Version:\*\* (.+)/);
    const roleMatch = promptMeta.match(/\*\*Role:\*\* (.+)/);
    const severityMatch = promptMeta.match(/\*\*Severity:\*\* (.+)/);
    
    prompts.push({
      id: `ch${chapterNum}_p${problemNum}_pr${promptIndex}`,
      version: versionMatch ? versionMatch[1].trim() : '',
      title: `Prompt ${promptIndex}`,
      role: roleMatch ? roleMatch[1].trim() : '',
      severity: severityMatch ? severityMatch[1].trim() : '',
      promptCode: promptCode.trim()
    });
    
    promptIndex++;
  }
  
  return prompts;
}

// Parse business case
function parseBusinessCase(section) {
  if (!section || !section.content) return null;
  
  // Extract ROI numbers (simplified - you can enhance this)
  const content = section.content;
  
  return {
    currentState: {
      description: content.substring(0, 300)
    },
    withAI: {
      description: content.substring(300, 600)
    }
  };
}

// Parse failure modes
function parseFailureModes(section) {
  if (!section || !section.content) return [];
  
  const failureModes = [];
  const content = section.content;
  
  // Find all FAILURE MODE markers
  const fmRegex = /FAILURE MODE #(\\d+)\\n(.+?)\\n/g;
  
  let match;
  while ((match = fmRegex.exec(content)) !== null) {
    const fmNum = match[1];
    const fmName = match[2];
    
    failureModes.push({
      id: `fm_${fmNum}`,
      number: parseInt(fmNum),
      name: fmName.trim(),
      symptom: 'See book for details',
      rootCause: 'See book for details',
      recovery: {
        immediate: { action: 'See book for details' },
        shortTerm: { action: 'See book for details' }
      }
    });
  }
  
  return failureModes;
}

// Main execution
function main() {
  console.log('\n🚀 AISBS Book Parser Starting...\n');
  
  const preface = parsePreface(bookText);
  console.log(`✅ Preface extracted (${preface.length} chars)`);
  
  const chapters = [];
  
  // Parse all 10 chapters
  for (let chNum = 1; chNum <= 10; chNum++) {
    const chapter = parseChapter(bookText, chNum);
    if (chapter) {
      chapters.push(chapter);
    }
  }
  
  // Assemble final USTAV
  const ustav = {
    metadata: {
      version: '1.0.0',
      parsedDate: new Date().toISOString(),
      totalChapters: chapters.length,
      totalProblems: chapters.reduce((sum, ch) => sum + ch.problems.length, 0),
      totalPrompts: chapters.reduce((sum, ch) => 
        sum + ch.problems.reduce((pSum, p) => pSum + p.prompts.length, 0), 0
      ),
      source: 'AI SOLVED BUSINESS PROBLEMS by Davor Mulalić'
    },
    preface: preface,
    chapters: chapters
  };
  
  // Save to file
  const outputPath = path.join(__dirname, '../../data/ustav.json');
  fs.writeFileSync(outputPath, JSON.stringify(ustav, null, 2), 'utf8');
  
  console.log('\n📊 PARSING STATISTICS:');
  console.log(`   Chapters parsed: ${ustav.metadata.totalChapters}`);
  console.log(`   Problems parsed: ${ustav.metadata.totalProblems}`);
  console.log(`   Prompts extracted: ${ustav.metadata.totalPrompts}`);
  console.log(`\n💾 Saved to: ${outputPath}`);
  console.log(`   File size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);
  
  console.log('\n✅ PARSING COMPLETE!');
}

// Run parser
main();
