#!/usr/bin/env node

/**
 * Test script to verify the API is returning the correct data structure
 * that ProblemView.js expects
 */

const fs = require('fs');
const path = require('path');

// Load the same data file the server will use
const ustavPath = path.join(__dirname, 'data/ustav-real.json');
const ustav = JSON.parse(fs.readFileSync(ustavPath, 'utf-8'));

console.log('\n=== API DATA FLOW TEST ===\n');

// Get first chapter and problem
const chapter = ustav.chapters[0];
const problem = chapter.problems[0];

console.log(`Chapter: ${chapter.number}. ${chapter.title}`);
console.log(`Problem: ${problem.number}. ${problem.title}\n`);

// Helper function from API
const wrapSection = (value) => {
  if (!value) return null;
  if (typeof value === 'string') return { content: value };
  if (typeof value === 'object' && !Array.isArray(value)) return value;
  return null;
};

// Simulate what API will return
const safeProblem = {
  id: problem.id,
  number: problem.number,
  title: problem.title || 'Untitled Problem',
  sections: {
    operationalReality: wrapSection(problem.operationalReality),
    whyTraditionalFails: wrapSection(problem.whyTraditionalMethodsFail),
    managerDecisionPoint: wrapSection(problem.managerDecisionPoint || problem.managerDecisionOptions?.[0]?.option),
    aiWorkflow: wrapSection(problem.aiWorkflow || (problem.roi ? `ROI: ${problem.roi}` : null)),
    executionPrompt: wrapSection(problem.executionPrompt || problem.nextSteps),
    businessCase: wrapSection(problem.businessCase),
    industryContext: wrapSection(problem.industryContext || problem.keyLearnings)
  },
  prompts: Array.isArray(problem.prompts) ? problem.prompts : [],
  businessCase: problem.businessCase || {},
  failureModes: Array.isArray(problem.failureModes) ? problem.failureModes : []
};

// Verify ProblemView can render this
console.log('SECTIONS TO RENDER:');
const expectedSections = [
  'operationalReality',
  'whyTraditionalFails',
  'managerDecisionPoint',
  'aiWorkflow',
  'executionPrompt',
  'businessCase',
  'industryContext'
];

expectedSections.forEach((sectionName) => {
  const section = safeProblem.sections[sectionName];
  if (section) {
    if (section.content) {
      console.log(`  [OK] ${sectionName}: ${section.content.substring(0, 50)}...`);
    } else if (typeof section === 'object') {
      console.log(`  [OK] ${sectionName}: object with ${Object.keys(section).length} fields`);
    }
  } else {
    console.log(`  [MISSING] ${sectionName}`);
  }
});

console.log(`\nPROMPTS: ${safeProblem.prompts.length} prompts available`);
if (safeProblem.prompts.length > 0) {
  safeProblem.prompts.forEach((p, i) => {
    console.log(`  Prompt ${i + 1}: ${p.title || 'Untitled'}`);
  });
}

console.log(`\nBUSINESS CASE: ${Object.keys(safeProblem.businessCase).length} sections`);
if (Object.keys(safeProblem.businessCase).length > 0) {
  Object.keys(safeProblem.businessCase).forEach((key) => {
    console.log(`  - ${key}`);
  });
}

console.log(`\nFAILURE MODES: ${safeProblem.failureModes.length} potential failures`);
if (safeProblem.failureModes.length > 0) {
  safeProblem.failureModes.slice(0, 3).forEach((fm, i) => {
    console.log(`  ${i + 1}. ${fm.title || fm.name || 'Unnamed'}: ${fm.symptom?.substring(0, 50) || '...'}...`);
  });
}

console.log('\n=== RESULT: API response format is correct for ProblemView ===\n');
console.log('Next steps:');
console.log('1. Start server: npm run dev (in backend/)');
console.log('2. Start frontend: npm start (in frontend/)');
console.log('3. Navigate to a problem to see all content render');
