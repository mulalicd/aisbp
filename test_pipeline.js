#!/usr/bin/env node
/**
 * Test pipeline: Parse book, verify JSON, start server, test API endpoints
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

// Step 1: Re-parse the book
console.log('📖 Step 1: Re-parsing the book...\n');
const { execSync } = require('child_process');
const parserPath = path.join(__dirname, 'backend', 'scripts', 'parseBook.js');
try {
  execSync(`node "${parserPath}"`, { stdio: 'inherit' });
} catch (e) {
  console.error('❌ Parsing failed:', e.message);
  process.exit(1);
}

// Step 2: Verify JSON was created
console.log('\n📊 Step 2: Verifying parsed JSON...\n');
const jsonPath = path.join(__dirname, 'data', 'ustav.json');
if (!fs.existsSync(jsonPath)) {
  console.error('❌ JSON file not found!');
  process.exit(1);
}

const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`✅ JSON loaded`);
console.log(`   Total Chapters: ${json.totalChapters}`);
console.log(`   Total Problems: ${json.totalProblems}`);
console.log(`   Sample Problem 1.1:`);
if (json.chapters[0] && json.chapters[0].problems[0]) {
  const p = json.chapters[0].problems[0];
  console.log(`     ID: ${p.id}`);
  console.log(`     Sections extracted: ${p.sections.length}`);
  console.log(`     Prompts extracted: ${p.prompts.length}`);
}

// Step 3: Start server
console.log('\n🚀 Step 3: Starting backend server...\n');
const serverPath = path.join(__dirname, 'backend', 'server.js');
const serverModule = require(serverPath);

// Wait for server to start, then test endpoints
setTimeout(() => {
  console.log('\n🧪 Step 4: Testing API endpoints...\n');

  const testEndpoints = [
    '/api/chapters',
    '/api/chapters/1',
    '/api/chapters/1/problems/1.1'
  ];

  let completed = 0;

  testEndpoints.forEach((endpoint) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: endpoint,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          console.log(`✅ ${endpoint}`);
          console.log(`   Status: ${res.statusCode}`);
          console.log(`   Response keys: ${Object.keys(parsed).join(', ')}`);
        } catch (e) {
          console.log(`⚠️ ${endpoint}`);
          console.log(`   Status: ${res.statusCode}`);
          console.log(`   Response (first 100 chars): ${data.slice(0, 100)}`);
        }
        completed++;
        if (completed === testEndpoints.length) {
          console.log('\n✅ All tests completed!\n');
          process.exit(0);
        }
      });
    });

    req.on('error', (err) => {
      console.error(`❌ ${endpoint} - Error: ${err.message}`);
      completed++;
      if (completed === testEndpoints.length) {
        console.log('\n❌ Some tests failed. Backend may not be running.\n');
        process.exit(1);
      }
    });

    req.end();
  });
}, 2000);
