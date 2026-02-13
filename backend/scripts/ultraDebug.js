#!/usr/bin/env node

/**
 * ULTRA DEBUG PARSER - Shows EXACTLY what parser finds
 * This will diagnose why content is not being extracted
 */

const fs = require('fs');
const path = require('path');

const bookPath = path.join(__dirname, '../../AI SOLVED BUSINESS PROBLEMS.txt');
const bookText = fs.readFileSync(bookPath, 'utf8');

console.log('🔍 ULTRA DEBUG PARSER\n');
console.log('='.repeat(70));
console.log(`Book Stats:`);
console.log(`  Total chars: ${bookText.length.toLocaleString()}`);
console.log(`  Total lines: ${bookText.split('\n').length.toLocaleString()}`);
console.log('='.repeat(70));

// ============================================================================
// TEST 1: Find PROBLEM 1.1
// ============================================================================

console.log('\n📋 TEST 1: Locating PROBLEM 1.1\n');

const p11Marker = 'PROBLEM 1.1';
const p12Marker = 'PROBLEM 1.2';

const p11Start = bookText.indexOf(p11Marker);
const p12Start = bookText.indexOf(p12Marker);

if (p11Start === -1) {
  console.log('❌ PROBLEM 1.1 NOT FOUND in book!');
  process.exit(1);
}

console.log(`✅ PROBLEM 1.1 found at position ${p11Start.toLocaleString()}`);
console.log(`✅ PROBLEM 1.2 found at position ${p12Start.toLocaleString()}`);

const p11Length = p12Start - p11Start;
console.log(`   Problem 1.1 length: ${p11Length.toLocaleString()} characters\n`);

// Extract Problem 1.1 text
const p11Text = bookText.substring(p11Start, p12Start);

// ============================================================================
// TEST 2: Find all SECTION markers in Problem 1.1
// ============================================================================

console.log('📋 TEST 2: Finding SECTION markers in Problem 1.1\n');

for (let s = 1; s <= 8; s++) {
  const sMarker = `SECTION ${s}`;
  const sPos = p11Text.indexOf(sMarker);
  
  if (sPos !== -1) {
    // Show 200 chars after marker
    const sample = p11Text.substring(sPos, sPos + 200);
    console.log(`✅ ${sMarker} found at offset ${sPos}`);
    console.log(`   Preview: "${sample.substring(0, 100).replace(/\n/g, '↵')}..."\n`);
  } else {
    console.log(`❌ ${sMarker} NOT FOUND\n`);
  }
}

// ============================================================================
// TEST 3: Extract SECTION 1 content manually
// ============================================================================

console.log('📋 TEST 3: Manual SECTION 1 extraction\n');

const s1Marker = 'SECTION 1';
const s2Marker = 'SECTION 2';

const s1Pos = p11Text.indexOf(s1Marker);
const s2Pos = p11Text.indexOf(s2Marker);

if (s1Pos !== -1 && s2Pos !== -1) {
  const s1Text = p11Text.substring(s1Pos, s2Pos);
  
  console.log(`Section 1 markers:`);
  console.log(`  Start position: ${s1Pos}`);
  console.log(`  End position: ${s2Pos}`);
  console.log(`  Length: ${s1Text.length} characters\n`);
  
  // Extract title (first line after SECTION 1)
  const titleEnd = s1Text.indexOf('\n');
  const title = s1Text.substring(s1Marker.length, titleEnd).trim();
  
  console.log(`Section 1 title: "${title}"\n`);
  
  // Extract content (after title)
  const content = s1Text.substring(titleEnd + 1).trim();
  
  console.log(`Section 1 content length: ${content.length} characters`);
  console.log(`Section 1 content preview (first 300 chars):`);
  console.log('-'.repeat(70));
  console.log(content.substring(0, 300));
  console.log('-'.repeat(70));
  console.log('');
  
  if (content.length === 0) {
    console.log('⚠️  WARNING: Section 1 content is EMPTY!\n');
  } else if (content.length < 100) {
    console.log('⚠️  WARNING: Section 1 content is very SHORT!\n');
  } else {
    console.log('✅ Section 1 content looks good\n');
  }
} else {
  console.log('❌ Could not find both SECTION 1 and SECTION 2\n');
}

// ============================================================================
// TEST 4: Find PROMPT markers
// ============================================================================

console.log('📋 TEST 4: Finding PROMPT markers in Problem 1.1\n');

const beginPrompt = '<<< BEGIN PROMPT >>>';
const endPrompt = '<<< END PROMPT >>>';

const beginPos = p11Text.indexOf(beginPrompt);
const endPos = p11Text.indexOf(endPrompt);

console.log(`BEGIN PROMPT: ${beginPos !== -1 ? `Found at ${beginPos}` : 'NOT FOUND'}`);
console.log(`END PROMPT: ${endPos !== -1 ? `Found at ${endPos}` : 'NOT FOUND'}\n`);

if (beginPos !== -1 && endPos !== -1) {
  const promptCode = p11Text.substring(beginPos + beginPrompt.length, endPos).trim();
  console.log(`Prompt code length: ${promptCode.length} characters`);
  console.log(`Prompt code preview (first 200 chars):`);
  console.log('-'.repeat(70));
  console.log(promptCode.substring(0, 200));
  console.log('-'.repeat(70));
  console.log('');
  
  if (promptCode.length === 0) {
    console.log('⚠️  WARNING: Prompt code is EMPTY!\n');
  } else if (promptCode.length < 500) {
    console.log('⚠️  WARNING: Prompt code is very SHORT!\n');
  } else {
    console.log('✅ Prompt code looks good\n');
  }
}

// ============================================================================
// TEST 5: Check for line ending issues
// ============================================================================

console.log('📋 TEST 5: Line ending analysis\n');

const hasWindows = bookText.includes('\r\n');
const hasUnix = bookText.includes('\n') && !bookText.includes('\r\n');
const hasMac = bookText.includes('\r') && !bookText.includes('\r\n');

console.log(`Line ending type:`);
console.log(`  Windows (\\r\\n): ${hasWindows ? 'YES' : 'NO'}`);
console.log(`  Unix (\\n): ${hasUnix ? 'YES' : 'NO'}`);
console.log(`  Mac (\\r): ${hasMac ? 'YES' : 'NO'}\n`);

// ============================================================================
// TEST 6: Character encoding check
// ============================================================================

console.log('📋 TEST 6: Character encoding\n');

// Check first 100 chars for weird characters
const firstChars = bookText.substring(0, 100);
const hasNonAscii = /[^\x00-\x7F]/.test(firstChars);

console.log(`First 100 characters:`);
console.log(firstChars.replace(/\n/g, '↵'));
console.log(`\nContains non-ASCII characters: ${hasNonAscii ? 'YES' : 'NO'}\n`);

// ============================================================================
// TEST 7: Try different marker variations
// ============================================================================

console.log('📋 TEST 7: Testing marker variations\n');

const markerTests = [
  'SECTION 1',
  'Section 1',
  'SECTION  1', // double space
  'SECTION\t1', // tab
  ' SECTION 1', // leading space
  'SECTION 1 ', // trailing space
];

markerTests.forEach(marker => {
  const found = p11Text.includes(marker);
  console.log(`  "${marker.replace(/\t/g, '\\t').replace(/ /g, '·')}": ${found ? '✅ FOUND' : '❌ NOT FOUND'}`);
});

console.log('');

// ============================================================================
// SUMMARY
// ============================================================================

console.log('='.repeat(70));
console.log('🎯 DIAGNOSTIC SUMMARY');
console.log('='.repeat(70));
console.log('');
console.log('Key Findings:');
console.log(`  1. PROBLEM 1.1: ${p11Start !== -1 ? '✅ Found' : '❌ NOT FOUND'}`);
console.log(`  2. SECTION markers: ${s1Pos !== -1 ? '✅ Found' : '❌ NOT FOUND'}`);
console.log(`  3. PROMPT markers: ${beginPos !== -1 ? '✅ Found' : '❌ NOT FOUND'}`);
console.log(`  4. Section content: ${s1Pos !== -1 && s2Pos !== -1 && content.length > 100 ? '✅ Present' : '⚠️  MISSING OR EMPTY'}`);
console.log('');
console.log('Next Steps:');
console.log('  → Send this COMPLETE output to Claude');
console.log('  → Claude will diagnose the exact issue');
console.log('  → Parser will be fixed based on findings');
console.log('');
console.log('='.repeat(70));