#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const outFile = 'run-output.txt';
const log = (msg) => {
  console.log(msg);
  fs.appendFileSync(outFile, msg + '\n');
};

try {
  // Clear output file
  fs.writeFileSync(outFile, '=== PARSE & TEST RUN ===\n\n');
  
  log('[1/4] Deleting old JSON...');
  const jsonPath = path.join(__dirname, 'data', 'ustav.json');
  if (fs.existsSync(jsonPath)) {
    fs.unlinkSync(jsonPath);
    log('✓ Deleted old JSON');
  }
  
  log('\n[2/4] Running parser...');
  try {
    const parserOutput = execSync('node backend\\scripts\\parseBook.js', { encoding: 'utf8', cwd: __dirname });
    log(parserOutput);
  } catch (e) {
    log('Error running parser: ' + e.message);
    log(e.stdout ? e.stdout.toString() : '');
    log(e.stderr ? e.stderr.toString() : '');
  }
  
  log('\n[3/4] Verifying JSON...');
  if (fs.existsSync(jsonPath)) {
    const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    log(`✓ JSON file created`);
    log(`  - Total Chapters: ${json.totalChapters}`);
    log(`  - Total Problems: ${json.totalProblems}`);
    
    if (json.chapters && json.chapters[0]) {
      const p = json.chapters[0].problems[0];
      if (p) {
        log(`  - Sample Problem ${p.id}:`);
        log(`    • Sections: ${p.sections ? p.sections.length : 0}`);
        log(`    • Prompts: ${p.prompts ? p.prompts.length : 0}`);
        if (p.sections && p.sections.length > 0) {
          log(`    • Section 1 content length: ${p.sections[0].content ? p.sections[0].content.length : 0} chars`);
        }
      }
    }
  } else {
    log('✗ JSON file NOT created - parser may have failed');
    process.exit(1);
  }
  
  log('\n[4/4] Starting server in background...');
  log('✓ Backend should be accessible at: http://localhost:5000');
  log('✓ API endpoint: http://localhost:5000/api/chapters');
  
  log('\n=== NEXT STEPS ===');
  log('1. Open http://localhost:5000 in your browser');
  log('2. Check the API endpoints:');
  log('   - http://localhost:5000/api/chapters');
  log('   - http://localhost:5000/api/chapters/1');
  log('3. View the web app dashboard');
  
  // Start server in background using spawn
  const { spawn } = require('child_process');
  const server = spawn('node', ['backend/server.js'], { 
    cwd: __dirname,
    detached: true,
    stdio: 'ignore'
  });
  server.unref();
  
  log('\n✅ Background server started (PID: ' + server.pid + ')');
  log('\n=== Output saved. Check run-output.txt for full details ===');
  
} catch (e) {
  log('FATAL ERROR: ' + e.message);
  log(e.stack);
  process.exit(1);
}
