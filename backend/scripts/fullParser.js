const fs = require('fs');
const path = require('path');

/**
 * PRODUCTION-GRADE MD PARSER
 * Specifically for book_parsed.md
 */

const inputPath = path.join(__dirname, '..', '..', 'book_parsed.md');
const outPath = path.join(__dirname, '..', '..', 'data', 'ustav.json');

function parseBook() {
    console.log('--- Starting Markdown Parser (Surgical Precision) ---');
    console.log(`Source: ${inputPath}`);

    if (!fs.existsSync(inputPath)) {
        console.error(`Input file not found: ${inputPath}`);
        process.exit(1);
    }

    const text = fs.readFileSync(inputPath, 'utf8');
    const lines = text.split(/\r?\n/);

    const result = {
        metadata: {
            title: "AI SOLVED BUSINESS PROBLEMS",
            subtitle: "50 Real-World Challenges from 10 Industries",
            author: "Davor Mulalić",
            date: "January 2026",
            location: "Sarajevo",
            version: "6.0.0 (Clean MD)",
            totalChapters: 0,
            totalProblems: 0,
            parseDate: new Date().toISOString()
        },
        chapters: []
    };

    let currentChapter = null;
    let currentProblem = null;
    let currentSectionIdx = 0;
    let sectionContent = [];

    // For Failure Modes parsing
    let currentFailureMode = null;

    const sectionMap = {
        1: 'operationalReality',
        2: 'whyTraditionalFails',
        3: 'managerDecisionPoint',
        4: 'aiWorkflow',
        5: 'executionPrompt',
        6: 'businessCase',
        7: 'industryContext',
        8: 'failureModes'
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // 1. Detect Chapter Start (# Chapter X: ...)
        const chapterMatch = trimmed.match(/^#\s+Chapter\s+(\d+):\s+(.+)$/i);
        if (chapterMatch) {
            saveCurrentState();

            const num = parseInt(chapterMatch[1]);
            const title = chapterMatch[2].trim();

            currentChapter = {
                number: num,
                id: `ch${num}`,
                title: title,
                intro: "",
                problems: []
            };
            result.chapters.push(currentChapter);
            continue;
        }

        // 2. Detect Problem Start (## Problem X.Y: ...)
        const problemMatch = trimmed.match(/^##\s+Problem\s+(\d+)\.(\d+):\s+(.+)$/i);
        if (problemMatch) {
            saveCurrentState();

            const chNum = parseInt(problemMatch[1]);
            const pNum = parseInt(problemMatch[2]);
            const title = problemMatch[3].trim();

            currentProblem = {
                id: `ch${chNum}_p${pNum}`,
                number: `${chNum}.${pNum}`,
                title: title,
                sections: {},
                prompts: [],
                failureModes: [],
                businessCase: {} // Helper for structured metrics
            };

            if (currentChapter && currentChapter.number === chNum) {
                currentChapter.problems.push(currentProblem);
            } else {
                // If chapter missing, create it
                let ch = result.chapters.find(c => c.number === chNum);
                if (!ch) {
                    ch = { number: chNum, id: `ch${chNum}`, title: `Chapter ${chNum}`, intro: "", problems: [] };
                    result.chapters.push(ch);
                    currentChapter = ch;
                }
                ch.problems.push(currentProblem);
            }
            continue;
        }

        // 3. Detect Section Start (### Section Z: ...)
        const sectionMatch = trimmed.match(/^###\s+Section\s+(\d+):\s*(.*)$/i);
        if (sectionMatch && currentProblem) {
            saveCurrentState();
            currentSectionIdx = parseInt(sectionMatch[1]);
            sectionContent = [];

            // If there's extra text in the header, add it to content
            if (sectionMatch[2]) {
                sectionContent.push(sectionMatch[2]);
            }
            continue;
        }

        // 4. Chapter Summary / End of Chapter detection
        if (trimmed.startsWith('## Chapter Summary')) {
            saveCurrentState();
            currentProblem = null;
            continue;
        }

        // 5. Accumulate content
        if (currentProblem && currentSectionIdx > 0) {
            sectionContent.push(line);
        } else if (currentProblem) {
            // Text between Problem header and first Section
            if (trimmed && !trimmed.startsWith('#')) {
                if (!currentProblem.intro) currentProblem.intro = "";
                currentProblem.intro += line + "\n";
            }
        } else if (currentChapter) {
            // Chapter intro
            if (trimmed && !trimmed.startsWith('#')) {
                currentChapter.intro += line + "\n";
            }
        }
    }

    // Final save
    saveCurrentState();

    // POST-PROCESSING for each problem
    result.chapters.forEach(ch => {
        ch.intro = ch.intro.trim();
        ch.problems.forEach(p => {
            if (p.intro) p.intro = p.intro.trim();

            // Extract Prompts from Section 5
            if (p.sections.executionPrompt) {
                extractPrompts(p);
            }

            // Extract Metrics from Section 6
            if (p.sections.businessCase) {
                extractBusinessMetrics(p);
            }

            // Extract Failure Modes from Section 8
            if (p.sections.failureModes) {
                extractFailureModesFromSection(p);
            }
        });
    });

    function saveCurrentState() {
        if (currentProblem && currentSectionIdx > 0) {
            const key = sectionMap[currentSectionIdx];
            if (key) {
                // Strip the section title from the beginning if it was pushed there
                let lines = [...sectionContent];
                if (lines.length > 0) {
                    const firstLine = lines[0].trim();
                    const sectionTitleMatch = firstLine.match(/^(Section\s+\d+:|Operational Reality|Why Traditional|Manager's Decision|AI-Augmented Workflow|Execution Prompt|Business Case|Industry Context|Failure Modes)/i);
                    if (sectionTitleMatch) {
                        lines.shift();
                    }
                }

                p_text = lines.join('\n').trim();
                currentProblem.sections[key] = p_text;
            }
            currentSectionIdx = 0;
            sectionContent = [];
        }
    }

    function extractPrompts(p) {
        // Look for PROMPT X.Y blocks or markdown code blocks
        // In the new file, they seem to be between ```markdown and ```
        const text = p.sections.executionPrompt;
        if (!text) return;

        const promptRegex = /```markdown([\s\S]+?)```/g;
        let match;
        let promptIndex = 1;
        while ((match = promptRegex.exec(text)) !== null) {
            const content = match[1].trim();

            // Generate composite ID: ch1_p1_pr1
            const id = `${p.id}_pr${promptIndex}`;

            // Simple metadata extraction
            let severity = "LOW";
            const sevMatch = content.match(/\*\*Severity:\*\* ([\w\s\/()]+)/i);
            if (sevMatch) severity = sevMatch[1].trim();

            let version = "1.0";
            const verMatch = content.match(/\*\*Version:\*\* ([\d.]+)/i);
            if (verMatch) version = verMatch[1].trim();

            let title = "Execution Prompt";
            const titleMatch = content.match(/^# PROMPT ([\d.]+): (.*)/im);
            if (titleMatch) title = titleMatch[2].trim();

            p.prompts.push({
                id,
                title,
                content: content,      // For UI display
                promptCode: content,   // For RAG system
                severity,
                version
            });

            promptIndex++;
        }
    }

    function extractBusinessMetrics(p) {
        const text = p.sections.businessCase;
        const bc = p.businessCase || {};

        // Match: Annual Freight Spend: $12,000,000
        const spendMatch = text.match(/Annual[^:]*Spend[^:]*:\s*\$([\d,]+)/i);
        if (spendMatch) {
            if (!bc.currentState) bc.currentState = {};
            bc.currentState.annualFreightSpend = parseInt(spendMatch[1].replace(/,/g, ''));
        }

        // Match: Annual Loss: $648,000
        const lossMatch = text.match(/Annual[^:]*Loss[^:]*:\s*\$([\d,]+)/i);
        if (lossMatch) {
            if (!bc.currentState) bc.currentState = {};
            bc.currentState.currentAnnualLoss = parseInt(lossMatch[1].replace(/,/g, ''));
        }

        // Match: Error Rate: 6%
        const errorMatch = text.match(/Error Rate[^:]*:\s*(\d+(?:\.\d+)?%?)/i);
        if (errorMatch) {
            if (!bc.currentState) bc.currentState = {};
            let rate = parseFloat(errorMatch[1].replace('%', ''));
            bc.currentState.estimatedErrorRate = rate / 100;
        }

        // Payback: 1.8 Months
        const pbMatch = text.match(/Payback[^:]*:\s*([\d\.]+) (Months|Days)/i);
        if (pbMatch) {
            bc.payback = { value: parseFloat(pbMatch[1]), unit: pbMatch[2] };
        }

        p.businessCase = bc;
    }

    function extractFailureModesFromSection(p) {
        const text = p.sections.failureModes;
        // Failure modes in MD look like #### Failure Mode #N: ...
        const fmRegex = /#### Failure Mode #(\d+):\s*(.+)\n([\s\S]+?)(?=#### Failure Mode|$)/gi;
        let match;
        while ((match = fmRegex.exec(text)) !== null) {
            const num = parseInt(match[1]);
            const title = match[2].trim();
            const body = match[3].trim();

            const symptomMatch = body.match(/\*\*Symptom:\*\*\n?([\s\S]+?)(?=\*\*Root Cause|$)/i);
            const rootMatch = body.match(/\*\*Root Cause:\*\*\n?([\s\S]+?)(?=\*\*Recovery|$|How to Confirm)/i);
            const recoveryMatch = body.match(/\*\*Recovery:\*\*\n?([\s\S]+?)(?=\*\*Email Template|$|Email to Your CEO)/i);

            p.failureModes.push({
                id: `fm_${p.failureModes.length + 1}`,
                number: num,
                title: title,
                symptom: symptomMatch ? symptomMatch[1].trim() : "",
                rootCause: rootMatch ? rootMatch[1].trim() : "",
                recovery: recoveryMatch ? recoveryMatch[1].trim() : ""
            });
        }
    }

    // Wrap-up
    result.metadata.totalChapters = result.chapters.length;
    result.metadata.totalProblems = result.chapters.reduce((sum, ch) => sum + ch.problems.length, 0);

    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8');

    console.log(`--- Parsing Complete ---`);
    console.log(`Chapters: ${result.metadata.totalChapters}`);
    console.log(`Problems: ${result.metadata.totalProblems}`);
    console.log(`Output: ${outPath}`);

    // Quick validation check
    if (result.metadata.totalProblems !== 50) {
        console.warn(`Warning: Expected 50 problems, but found ${result.metadata.totalProblems}. Check MD headers.`);
    }
}

parseBook();
