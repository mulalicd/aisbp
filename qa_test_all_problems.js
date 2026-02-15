const fs = require('fs');
const path = require('path');
const { generate } = require('./backend/rag/generation');

// Mock colors for output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

function log(msg, color = colors.reset) {
    console.log(`${color}${msg}${colors.reset}`);
}

async function runQA() {
    log('Starting AI Quality Assurance Test - Industrial Platinum Standard...', colors.bold);

    // 1. Load Data
    const dataPath = path.join(__dirname, 'data', 'ustav.json');
    if (!fs.existsSync(dataPath)) {
        log(`Error: ustav.json not found at ${dataPath}`, colors.red);
        return;
    }
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    let totalProblems = 0;
    let passedProblems = 0;
    let details = [];

    // 2. Iterate Problems
    for (const chapter of data.chapters) {
        log(`\nTesting Chapter ${chapter.number}: ${chapter.title}`, colors.yellow);

        for (const problem of chapter.problems) {
            totalProblems++;

            // Construct Context
            const context = {
                chapter: {
                    id: chapter.id,
                    title: chapter.title
                },
                problem: {
                    id: problem.id,
                    title: problem.title,
                    failureModes: problem.failureModes || []
                }
            };

            // Mock Prompt Metadata
            const promptMetadata = {
                id: `${problem.id}_execution`,
                title: "Execution Prompt",
                content: problem.prompts?.[0]?.content || "Mock Content"
            };

            try {
                // Execute Generation
                const result = await generate("Mock Augmented Data", promptMetadata, 'mock', { context });

                // 3. Analyze Quality
                const output = result.output;
                const html = output.html || '';

                // Quality Heuristics
                const hasCharts = html.includes('📊') || html.includes('VisualChart');
                const hasTables = html.includes('<table');
                const hasRoadmap = html.includes('STRATEGIC ROADMAP');
                const hasActionPlan = html.includes('Action Plan');

                // Determine Logic Path (Reverse Engineer from output content)
                let logicTemplate = 'Generic (Fallback)';
                if (html.includes('FREIGHT AUDIT')) logicTemplate = 'Freight (Pre-defined)';
                else if (html.includes('TALENT VELOCITY')) logicTemplate = 'HR (Pre-defined)';
                else if (html.includes('MANUFACTURING THROUGHPUT')) logicTemplate = 'Manufacturing (Pre-defined)';
                else if (html.includes('CONTRACTUAL EXPOSURE')) logicTemplate = 'Legal (Pre-defined)';
                else if (html.includes('CAPITAL INTELLIGENCE') || html.includes('FRAUD DIAGNOSTIC')) logicTemplate = 'Finance (Pre-defined)';
                else if (html.includes('CLINICAL ADHERENCE')) logicTemplate = 'Healthcare (Pre-defined)';
                else if (html.includes('REVENUE VELOCITY')) logicTemplate = 'Sales (Pre-defined)';
                else if (html.includes('PRECISION SITUATIONAL ANALYSIS')) logicTemplate = 'Generic (Premium)';

                // Verification
                const isPlatinum = hasTables && hasCharts && hasRoadmap && hasActionPlan;

                if (isPlatinum) {
                    passedProblems++;
                    log(`  [PASS] ${problem.id}: ${logicTemplate}`, colors.green);
                } else {
                    log(`  [FAIL] ${problem.id}: Missing Platinum Elements`, colors.red);
                    if (!hasCharts) log(`    - Missing Charts`, colors.red);
                    if (!hasTables) log(`    - Missing Tables`, colors.red);
                    if (!hasRoadmap) log(`    - Missing Roadmap`, colors.red);
                }

                details.push({
                    id: problem.id,
                    template: logicTemplate,
                    status: isPlatinum ? 'PASS' : 'FAIL'
                });

            } catch (err) {
                log(`  [ERROR] ${problem.id}: ${err.message}`, colors.red);
            }
        }
    }

    // 4. Summary
    log('\n════════════════════════════════════════════════════', colors.bold);
    log(`QA SUMMARY: ${passedProblems}/${totalProblems} Passed Platinum Standard`, passedProblems === totalProblems ? colors.green : colors.yellow);

    // Check coverage
    const templates = [...new Set(details.map(d => d.template))];
    log(`Templates Active: ${templates.join(', ')}`);
    log('════════════════════════════════════════════════════', colors.bold);
}

runQA();
