#!/usr/bin/env node

/**
 * Complete Book Parser
 * Extracts all 10 chapters with all 50 problems and their full content from the TXT file
 * Outputs to data/ustav.json in the format expected by ProblemView.js
 */

const fs = require('fs');
const path = require('path');

// Read source file
const txtFile = path.join(__dirname, '../../AI SOLVED BUSINESS PROBLEMS.txt');
const content = fs.readFileSync(txtFile, 'utf-8');
const lines = content.split('\n');

console.log('Parsing AI SOLVED BUSINESS PROBLEMS.txt...');
console.log(`Total lines: ${lines.length}`);

// Data structure
const chapters = {};
let currentChapter = null;
let currentProblem = null;
let currentSection = null;
let inPromptBlock = false;
let promptBuffer = null;

// Pattern matchers
const chapterPattern = /^CHAPTER\s+(\d+)/;
const problemPattern = /^PROBLEM\s+(\d+\.\d+)/;
const sectionPattern = /^SECTION\s+(\d+)/;
const promptBeginPattern = /<<<\s*BEGIN\s+PROMPT\s*>>>/i;
const promptEndPattern = /<<<\s*END\s+PROMPT\s*>>>/i;

// Section names in order
const sectionNames = [
  'operationalReality',
  'whyTraditionalMethodsFail', // Note: using data field names
  'managerDecisionOptions',    // Will be mapped to managerDecisionPoint if it's just a string
  'aiWorkflow',
  'executionPrompt',           // Execution Prompt is section 5
  'businessCase',              // Business case might be embedded
  'industryContext',
  'failureModes'
];

function addSectionContent(content) {
  if (!currentProblem) return;
  
  const trimmed = content.trim();
  if (!trimmed) return;

  if (!currentProblem.sectionsArray) {
    currentProblem.sectionsArray = [];
  }

  // Parse section heading if it exists in content
  if (currentProblem.sectionsArray.length === 0 && trimmed !== '') {
    // First section content - try to extract heading
    const lines = trimmed.split('\n');
    let heading = '';
    let body = trimmed;
    
    if (lines.length > 0) {
      const firstLine = lines[0];
      // Check if first few lines look like a heading
      if (firstLine.length < 100 && !firstLine.includes('your') && !firstLine.includes('You ')) {
        heading = firstLine;
        body = lines.slice(1).join('\n').trim();
      }
    }

    currentProblem.sectionsArray.push({
      number: currentProblem.sectionsArray.length + 1,
      heading: heading,
      content: body || trimmed
    });
  } else {
    currentProblem.sectionsArray.push({
      number: currentProblem.sectionsArray.length + 1,
      heading: '',
      content: trimmed
    });
  }
}

function startNewProblem(problemNumber, title) {
  // Save previous problem
  if (currentProblem && currentChapter) {
    if (!chapters[currentChapter.number]) {
      chapters[currentChapter.number] = currentChapter;
    }
    if (!chapters[currentChapter.number].problems) {
      chapters[currentChapter.number].problems = [];
    }
    // Convert sections array to object with named keys
    if (currentProblem.sectionsArray && currentProblem.sectionsArray.length > 0) {
      const sectionsObj = {};
      currentProblem.sectionsArray.forEach((section, index) => {
        const sectionName = sectionNames[index] || `section${index + 1}`;
        sectionsObj[sectionName] = section.content;
      });
      currentProblem.sections = sectionsObj;
    }
    delete currentProblem.sectionsArray;
    chapters[currentChapter.number].problems.push(currentProblem);
  }

  // Create new problem
  currentProblem = {
    id: currentChapter ? `ch${currentChapter.number}_p${problemNumber.split('.')[1]}` : `p${problemNumber}`,
    number: problemNumber,
    title: title.trim(),
    prompts: [],
    failureModes: []
  };
  currentSection = null;
}

function startNewChapter(chapterNumber, title) {
  // Save previous chapter's last problem
  if (currentProblem && currentChapter) {
    if (!chapters[currentChapter.number]) {
      chapters[currentChapter.number] = currentChapter;
    }
    if (!chapters[currentChapter.number].problems) {
      chapters[currentChapter.number].problems = [];
    }
    // Convert sections array to object
    if (currentProblem.sectionsArray) {
      const sectionsObj = {};
      currentProblem.sectionsArray.forEach((section, index) => {
        const sectionName = sectionNames[index] || `section${index + 1}`;
        sectionsObj[sectionName] = section.content;
      });
      currentProblem.sections = sectionsObj;
    }
    delete currentProblem.sectionsArray;
    chapters[currentChapter.number].problems.push(currentProblem);
  }

  currentChapter = {
    number: chapterNumber,
    id: `ch${chapterNumber}`,
    title: title.trim(),
    intro: `Chapter ${chapterNumber}: ${title.trim()}`,
    problems: []
  };
  currentProblem = null;
}

// Parse line by line
let sectionContentBuffer = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const chapterMatch = line.match(chapterPattern);
  const problemMatch = line.match(problemPattern);
  const sectionMatch = line.match(sectionPattern);
  const promptBegin = line.match(promptBeginPattern);
  const promptEnd = line.match(promptEndPattern);

  // Handle prompt blocks
  if (promptBegin) {
    inPromptBlock = true;
    promptBuffer = [];
    continue;
  }
  if (promptEnd) {
    inPromptBlock = false;
    if (promptBuffer && currentProblem && promptBuffer.length > 0) {
      const promptText = promptBuffer.join('\n').trim();
      if (promptText && !promptText.startsWith('<<<')) {
        // Try to extract title from first lines
        const promptLines = promptText.split('\n');
        let title = 'Executive Prompt';
        let content = promptText;
        
        // Look for a title-like line
        for (let j = 0; j < Math.min(5, promptLines.length); j++) {
          const line = promptLines[j].trim();
          if (line && line.length < 100 && line.length > 10 && !line.includes(':')) {
            title = line;
            content = promptLines.slice(j + 1).join('\n').trim();
            break;
          }
        }
        
        currentProblem.prompts.push({
          id: `prompt_${currentProblem.prompts.length + 1}`,
          title: title,
          content: content,
          severity: 'LOW',
          version: '1.0'
        });
      }
    }
    promptBuffer = null;
    continue;
  }

  if (inPromptBlock) {
    if (promptBuffer !== null) {
      promptBuffer.push(line);
    }
    continue;
  }

  // Chapter header
  if (chapterMatch) {
    const chapterNum = parseInt(chapterMatch[1]);
    const rest = line.substring(chapterMatch[0].length).trim();
    startNewChapter(chapterNum, rest);
    continue;
  }

  // Problem header
  if (problemMatch && currentChapter) {
    const problemNum = problemMatch[1];
    const rest = line.substring(problemMatch[0].length).trim();
    startNewProblem(problemNum, rest);
    sectionContentBuffer = '';
    currentSection = null;
    continue;
  }

  // Section header
  if (sectionMatch && currentProblem) {
    // Save previous section content
    const sectionNum = parseInt(sectionMatch[1]);
    if (sectionContentBuffer.trim()) {
      addSectionContent(sectionContentBuffer);
    }
    // Start new section
    currentSection = sectionNum;
    sectionContentBuffer = '';
    continue;
  }

  // Accumulate section content
  if (currentProblem && currentSection) {
    sectionContentBuffer += (sectionContentBuffer ? '\n' : '') + line;
  }
}

// Save last problem
if (currentProblem && currentChapter) {
  if (sectionContentBuffer.trim()) {
    addSectionContent(sectionContentBuffer);
  }
  if (!chapters[currentChapter.number]) {
    chapters[currentChapter.number] = currentChapter;
  }
  if (!chapters[currentChapter.number].problems) {
    chapters[currentChapter.number].problems = [];
  }
  // Convert sections array to object
  if (currentProblem.sectionsArray) {
    const sectionsObj = {};
    currentProblem.sectionsArray.forEach((section, index) => {
      const sectionName = sectionNames[index] || `section${index + 1}`;
      sectionsObj[sectionName] = section.content;
    });
    currentProblem.sections = sectionsObj;
  }
  delete currentProblem.sectionsArray;
  chapters[currentChapter.number].problems.push(currentProblem);
}

// Build output structure
const chaptersArray = [];
for (let i = 1; i <= 10; i++) {
  if (chapters[i]) {
    chaptersArray.push(chapters[i]);
  }
}

const output = {
  metadata: {
    title: 'AI SOLVED BUSINESS PROBLEMS',
    subtitle: '50 Real-World Challenges from 10 Industries: A Manager\'s Workbook',
    edition: 'February 2026',
    location: 'Sarajevo',
    totalProblems: 50,
    totalChapters: 10,
    targetAudience: 'Chief Supply Chain Officers, VPs Operations, CFOs, CIOs | Mid-market ($50M-$500M revenue)',
    published: '2026-02-01',
    parseDate: new Date().toISOString()
  },
  chapters: chaptersArray
};

// Statistics
let totalProblems = 0;
let totalWithSections = 0;
let totalWithPrompts = 0;

chaptersArray.forEach(ch => {
  if (ch.problems) {
    ch.problems.forEach(p => {
      totalProblems++;
      if (p.sections && Object.keys(p.sections).length > 0) {
        totalWithSections++;
      }
      if (p.prompts && p.prompts.length > 0) {
        totalWithPrompts++;
      }
    });
  }
});

// Write output
const outputPath = path.join(__dirname, '../../data/ustav.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');

console.log('\n=== PARSE COMPLETE ===');
console.log(`Output: ${outputPath}`);
console.log(`Chapters: ${output.chapters.length}`);
console.log(`Total Problems: ${totalProblems}`);
console.log(`Problems with content: ${totalWithSections}`);
console.log(`Problems with prompts: ${totalWithPrompts}`);
console.log(`File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
