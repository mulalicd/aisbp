#!/usr/bin/env node

/**
 * AISBS - FINAL PERFECT PARSER v5.0
 * Based on actual book format analysis
 * Author: Claude (BOS) - February 2026
 */

const fs = require('fs');
const path = require('path');

const bookPath = path.join(__dirname, '../../AI SOLVED BUSINESS PROBLEMS.txt');
const outputPath = path.join(__dirname, '../../data/ustav.json');

console.log('🚀 AISBS FINAL Parser v5.0 - Based on Real Format');
console.log('📖 Loading book...\n');

const bookText = fs.readFileSync(bookPath, 'utf8');

console.log(`✅ Loaded: ${bookText.length.toLocaleString()} chars, ${bookText.split('\n').length.toLocaleString()} lines\n`);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function extractBetween(text, start, end, fromPos = 0) {
  const startPos = text.indexOf(start, fromPos);
  if (startPos === -1) return null;
  
  const endPos = end ? text.indexOf(end, startPos + start.length) : text.length;
  const actualEnd = endPos === -1 ? text.length : endPos;
  
  return {
    content: text.substring(startPos + start.length, actualEnd).trim(),
    startPos: startPos,
    endPos: actualEnd
  };
}

// ============================================================================
// EXTRACT PROMPTS
// ============================================================================

function extractPrompts(problemText, chNum, pNum) {
  const prompts = [];
  let searchPos = 0;
  let promptNum = 1;
  
  while (true) {
    const beginMarker = '<<< BEGIN PROMPT >>>';
    const endMarker = '<<< END PROMPT >>>';
    
    const beginPos = problemText.indexOf(beginMarker, searchPos);
    if (beginPos === -1) break;
    
    const endPos = problemText.indexOf(endMarker, beginPos);
    if (endPos === -1) break;
    
    const promptCode = problemText.substring(
      beginPos + beginMarker.length,
      endPos
    ).trim();
    
    // Look for metadata BEFORE the prompt
    const metaStart = problemText.lastIndexOf('# PROMPT', beginPos);
    const metaEnd = beginPos;
    
    let version = '1.0';
    let role = 'AI Assistant';
    let severity = 'MEDIUM';
    
    if (metaStart !== -1 && metaStart > searchPos) {
      const metadata = problemText.substring(metaStart, metaEnd);
      
      const vMatch = metadata.match(/\*\*Version:\*\*\s*(.+)/);
      const rMatch = metadata.match(/\*\*Role:\*\*\s*(.+)/);
      const sMatch = metadata.match(/\*\*Severity:\*\*\s*(.+)/);
      
      if (vMatch) version = vMatch[1].trim();
      if (rMatch) role = rMatch[1].trim();
      if (sMatch) severity = sMatch[1].trim();
    }
    
    prompts.push({
      id: `ch${chNum}_p${pNum}_pr${promptNum}`,
      version: version,
      title: `Prompt ${chNum}.${pNum}.${promptNum}`,
      role: role,
      severity: severity,
      promptCode: promptCode
    });
    
    searchPos = endPos + endMarker.length;
    promptNum++;
  }
  
  return prompts;
}

// ============================================================================
// EXTRACT FAILURE MODES
// ============================================================================

function extractFailureModes(problemText) {
  const failureModes = [];
  const fmRegex = /FAILURE MODE #(\d+)\n(.+?)\n\n(.+?)(?=\nFAILURE MODE #|\n\nPROBLEM |\n\nCHAPTER |$)/gs;
  
  let match;
  while ((match = fmRegex.exec(problemText)) !== null) {
    const fmNum = match[1];
    const fmName = match[2].trim();
    const fmContent = match[3].trim();
    
    // Extract sections from content
    const symptomMatch = fmContent.match(/What You See[^\n]*\n(.+?)(?=Why It Happens|How to Confirm|$)/s);
    const causeMatch = fmContent.match(/Why It Happens[^\n]*\n(.+?)(?=How to Confirm|How to Recover|$)/s);
    const recoveryMatch = fmContent.match(/How to Recover\n(.+?)(?=Email to Your CEO|FAILURE MODE|$)/s);
    
    failureModes.push({
      id: `fm_${fmNum}`,
      number: parseInt(fmNum),
      name: fmName,
      symptom: symptomMatch ? symptomMatch[1].trim().substring(0, 500) : '',
      rootCause: causeMatch ? causeMatch[1].trim().substring(0, 500) : '',
      recovery: {
        immediate: {
          action: recoveryMatch ? recoveryMatch[1].trim().substring(0, 500) : ''
        }
      }
    });
  }
  
  return failureModes;
}

// ============================================================================
// PARSE PROBLEM
// ============================================================================

function parseProblem(chapterText, chNum, pNum) {
  console.log(`  📄 Problem ${chNum}.${pNum}...`);
  
  // Find problem boundaries
  const problemMarker = `PROBLEM ${chNum}.${pNum}`;
  const nextProblemMarker = `PROBLEM ${chNum}.${pNum + 1}`;
  
  const problemStart = chapterText.indexOf(problemMarker);
  if (problemStart === -1) {
    console.log(`    ⚠️  Not found`);
    return null;
  }
  
  // Find end (next problem, next chapter, or Chapter Summary)
  let problemEnd = chapterText.indexOf(nextProblemMarker, problemStart);
  if (problemEnd === -1) {
    problemEnd = chapterText.indexOf('Chapter Summary', problemStart);
  }
  if (problemEnd === -1) {
    problemEnd = chapterText.indexOf(`CHAPTER ${chNum + 1}`, problemStart);
  }
  if (problemEnd === -1) {
    problemEnd = chapterText.length;
  }
  
  const problemText = chapterText.substring(problemStart, problemEnd);
  
  // Extract title (line after PROBLEM marker)
  const titleEnd = problemText.indexOf('\n');
  const title = problemText.substring(problemMarker.length, titleEnd).trim();
  
  // Extract all 8 sections
  const sections = {};
  
  for (let sNum = 1; sNum <= 8; sNum++) {
    const sectionMarker = `SECTION ${sNum}`;
    const nextSectionMarker = `SECTION ${sNum + 1}`;
    
    const sectionStart = problemText.indexOf(sectionMarker);
    
    if (sectionStart !== -1) {
      // Find section end
      let sectionEnd = problemText.indexOf(nextSectionMarker, sectionStart);
      
      // If no next section, look for other markers
      if (sectionEnd === -1) {
        // Try to find "PROBLEM", "Chapter Summary", or end
        const possibleEnds = [
          problemText.indexOf(`PROBLEM ${chNum}.${pNum + 1}`, sectionStart),
          problemText.indexOf('Chapter Summary', sectionStart),
          problemText.length
        ].filter(pos => pos !== -1);
        
        sectionEnd = Math.min(...possibleEnds);
      }
      
      const sectionText = problemText.substring(sectionStart, sectionEnd);
      
      // Extract section title (line after SECTION N)
      const sectionTitleEnd = sectionText.indexOf('\n');
      const sectionTitle = sectionText.substring(sectionMarker.length, sectionTitleEnd).trim();
      
      // Extract content (everything after title)
      const sectionContent = sectionText.substring(sectionTitleEnd + 1).trim();
      
      // Map section number to key name
      const sectionKeys = [
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
      
      const sectionKey = sectionKeys[sNum];
      
      if (sectionKey) {
        sections[sectionKey] = {
          title: sectionTitle,
          content: sectionContent
        };
      }
    }
  }
  
  // Extract prompts
  const prompts = extractPrompts(problemText, chNum, pNum);
  
  // Extract failure modes (usually in Section 8)
  const failureModes = extractFailureModes(problemText);
  
  // Parse business case (if Section 6 exists)
  let businessCase = null;
  if (sections.businessCase) {
    businessCase = {
      description: sections.businessCase.content.substring(0, 1500),
      fullText: sections.businessCase.content
    };
  }
  
  const sectionsCount = Object.keys(sections).length;
  const promptsCount = prompts.length;
  const fmCount = failureModes.length;
  
  console.log(`    ✅ "${title}"`);
  console.log(`       Sections: ${sectionsCount}, Prompts: ${promptsCount}, Failure Modes: ${fmCount}`);
  
  return {
    id: `ch${chNum}_p${pNum}`,
    number: pNum,
    title: title,
    sections: sections,
    prompts: prompts,
    businessCase: businessCase,
    failureModes: failureModes
  };
}

// ============================================================================
// PARSE CHAPTER
// ============================================================================

function parseChapter(bookText, chNum) {
  console.log(`\n📚 Chapter ${chNum}:`);
  
  const chapterMarker = `CHAPTER ${chNum}`;
  const nextChapterMarker = `CHAPTER ${chNum + 1}`;
  
  const chapterStart = bookText.indexOf(chapterMarker);
  if (chapterStart === -1) {
    console.log(`  ❌ Not found`);
    return null;
  }
  
  // Find chapter end
  let chapterEnd = bookText.indexOf(nextChapterMarker, chapterStart);
  if (chapterEnd === -1) {
    chapterEnd = bookText.indexOf('AFTERWORD', chapterStart);
  }
  if (chapterEnd === -1) {
    chapterEnd = bookText.length;
  }
  
  const chapterText = bookText.substring(chapterStart, chapterEnd);
  
  // Extract title (line after CHAPTER N)
  const titleEnd = chapterText.indexOf('\n');
  const fullTitle = chapterText.substring(chapterMarker.length, titleEnd).trim();
  
  // Split title/subtitle
  let title, subtitle;
  if (fullTitle.includes(' - ')) {
    [title, subtitle] = fullTitle.split(' - ').map(s => s.trim());
  } else {
    title = fullTitle;
    subtitle = '';
  }
  
  // Extract intro (text before first PROBLEM)
  const firstProblemPos = chapterText.indexOf('PROBLEM ');
  const intro = firstProblemPos !== -1
    ? chapterText.substring(0, firstProblemPos).trim()
    : chapterText.substring(0, 2000).trim();
  
  // Parse all 5 problems
  const problems = [];
  for (let pNum = 1; pNum <= 5; pNum++) {
    const problem = parseProblem(chapterText, chNum, pNum);
    if (problem) {
      problems.push(problem);
    }
  }
  
  console.log(`  ✅ "${title}" - ${problems.length}/5 problems`);
  
  return {
    id: `ch${chNum}`,
    number: chNum,
    title: title,
    subtitle: subtitle,
    intro: intro,
    problems: problems
  };
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

console.log('🔍 Parsing all chapters...\n');

const chapters = [];
let totalProblems = 0;
let totalPrompts = 0;
let totalFailureModes = 0;

for (let chNum = 1; chNum <= 10; chNum++) {
  const chapter = parseChapter(bookText, chNum);
  if (chapter) {
    chapters.push(chapter);
    totalProblems += chapter.problems.length;
    chapter.problems.forEach(p => {
      totalPrompts += p.prompts.length;
      totalFailureModes += p.failureModes.length;
    });
  }
}

// Build output
const ustav = {
  metadata: {
    version: '5.0.0',
    title: 'AI SOLVED BUSINESS PROBLEMS',
    subtitle: '50 Real-World Challenges from 10 Industries',
    author: 'Davor Mulalić',
    parsedDate: new Date().toISOString(),
    totalChapters: chapters.length,
    totalProblems: totalProblems,
    totalPrompts: totalPrompts,
    totalFailureModes: totalFailureModes,
    source: 'AI SOLVED BUSINESS PROBLEMS.txt'
  },
  chapters: chapters
};

// Save
fs.writeFileSync(outputPath, JSON.stringify(ustav, null, 2), 'utf8');

const fileSize = fs.statSync(outputPath).size;
const fileSizeMB = (fileSize / 1024 / 1024).toFixed(2);

// Summary
console.log('\n' + '='.repeat(70));
console.log('✅ PARSING COMPLETE');
console.log('='.repeat(70));
console.log('');
console.log('📊 Final Statistics:');
console.log(`   Chapters:        ${chapters.length}/10`);
console.log(`   Problems:        ${totalProblems}/50`);
console.log(`   Prompts:         ${totalPrompts}`);
console.log(`   Failure Modes:   ${totalFailureModes}`);
console.log('');
console.log('💾 Output:');
console.log(`   File:            ${outputPath}`);
console.log(`   Size:            ${fileSizeMB} MB`);
console.log('');

// Quality checks
if (chapters.length === 10) {
  console.log('✅ All chapters parsed successfully');
} else {
  console.log(`⚠️  Only ${chapters.length}/10 chapters parsed`);
}

if (totalProblems === 50) {
  console.log('✅ All problems parsed successfully');
} else {
  console.log(`⚠️  Only ${totalProblems}/50 problems parsed`);
}

if (totalPrompts >= 50) {
  console.log('✅ Prompts extracted successfully');
} else {
  console.log(`⚠️  Only ${totalPrompts} prompts found (expected 50+)`);
}

if (parseFloat(fileSizeMB) >= 1.0) {
  console.log('✅ File size indicates good content extraction');
} else {
  console.log(`⚠️  File size is ${fileSizeMB} MB - may be missing content`);
}

console.log('');
console.log('🎯 Next Steps:');
console.log('   1. cd backend && npm run dev');
console.log('   2. cd frontend && npm start');
console.log('   3. Open http://localhost:3000');
console.log('');
console.log('='.repeat(70));