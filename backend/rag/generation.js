const conversationManager = require('../services/ConversationManager');

/**
 * FEATURE FLAGS - ACA Implementation Phase 1
 */
const FEATURES = {
  ENABLE_CONVERSATION_HISTORY: true,
  ENABLE_TIER_SYSTEM: false, // Will be enabled in Phase 2
  ENABLE_RATE_LIMITING: false
};

/**
 * RAG Generation System - Output Generation (Mock or LLM)
 * Produces execution results
 */

/**
 * Generate response (mock or LLM-based)
 * @param {string} augmentedPrompt - Prompt ready for execution
 * @param {Object} promptMetadata - Original prompt object
 * @param {string} mode - 'mock' or 'llm'
 * @param {Object} options - Optional configuration
 * @returns {Promise<Object>} - Generated output
 */
async function generate(augmentedPrompt, promptMetadata, mode = 'mock', options = {}) {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║  🤖 GENERATION STARTED                                  ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('[Generation] Mode:', mode);
  console.log('[Generation] Augmented prompt length:', augmentedPrompt ? augmentedPrompt.length : 0);
  console.log('[Generation] Prompt metadata:', promptMetadata ? promptMetadata.id : 'N/A');

  const startTime = Date.now();

  try {
    if (mode === 'mock') {
      return generateMock(promptMetadata, startTime, options);
    } else if (mode === 'llm') {
      return await generateLLM(augmentedPrompt, promptMetadata, startTime, options);
    } else {
      throw new Error(`Invalid generation mode: ${mode}. Use 'mock' or 'llm'.`);
    }
  } catch (error) {
    // Return error response
    return {
      success: false,
      mode,
      timestamp: new Date().toISOString(),
      promptId: promptMetadata.id,
      error: error.message,
      metadata: {
        executionTime: Date.now() - startTime + 'ms',
        status: 'FAILED'
      }
    };
  }
}

/**
 * Generate mock output from prompt metadata
 */
function generateMock(promptMetadata, startTime, options = {}) {
  // Check for follow-up question
  if (options.followUp) {
    const followUpResponse = generateMockFollowUp(options.followUp, promptMetadata, options.context);
    return {
      success: true,
      mode: 'mock',
      timestamp: new Date().toISOString(),
      promptId: promptMetadata.id,
      output: {
        text: followUpResponse,
        html: `<div style="font-family: 'Inter', sans-serif; color: #1f2937; line-height: 1.6;">${followUpResponse}</div>`
      },
      metadata: {
        executionTime: (Date.now() - startTime) + 'ms',
        model: 'Mock Conversational Agent v1.0',
        status: 'SUCCESS'
      }
    };
  }

  // Generate realistic, formatted output based on prompt type and context
  const mockOutput = generateRealisticMockOutput(promptMetadata, options.context);

  return {
    success: true,
    mode: 'mock',
    timestamp: new Date().toISOString(),
    promptId: promptMetadata.id,
    output: mockOutput,
    metadata: {
      executionTime: (Date.now() - startTime) + 'ms',
      model: 'Mock Deterministic Generator v2.1',
      status: 'SUCCESS',
      note: 'This is simulated output. Switch to "Production Mode" for real AI analysis.',
      tokenEstimate: 450 // rough average
    }
  };
}

/**
 * Generate a professional ROI table with calculations
 */
function generateROITable(data, style) {
  const { tableStyle, thStyle, tdStyle } = style;
  return `
    <table style="${tableStyle}">
      <thead>
        <tr>
          <th style="${thStyle}">Economic Lever</th>
          <th style="${thStyle}">Current State</th>
          <th style="${thStyle}">Optimized State</th>
          <th style="${thStyle}">Annual Impact</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(row => `
          <tr>
            <td style="${tdStyle}">${row.lever}</td>
            <td style="${tdStyle}">${row.current}</td>
            <td style="${tdStyle}">${row.optimized}</td>
            <td style="${tdStyle} color: #059669; font-weight: bold;">${row.impact}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

/**
 * Generate a visual CSS-based bar chart for metrics
 */
function generateVisualChart(title, data, style) {
  return `
    <div style="margin: 20px 0; background: #f9fafb; border: 1px solid #e5e7eb; padding: 16px; border-radius: 8px;">
      <h4 style="margin: 0 0 16px 0; font-size: 13px; color: #374151; text-transform: uppercase; letter-spacing: 0.05em;">📊 ${title}</h4>
      <div style="display: grid; gap: 12px;">
        ${data.map(item => `
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px; color: #4b5563;">
              <span>${item.label}</span>
              <span style="font-weight: 700;">${item.value}%</span>
            </div>
            <div style="height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden;">
              <div style="height: 100%; width: ${item.value}%; background: ${item.color || '#3b82f6'}; border-radius: 4px;"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * Generate a phased strategic roadmap
 */
function generateStrategicRoadmap(phases) {
  return `
    <div style="margin: 24px 0; border-left: 2px solid #e5e7eb; padding-left: 20px; margin-left: 10px;">
      <h4 style="margin: 0 0 20px -20px; font-size: 13px; color: #111827; text-transform: uppercase; font-weight: 800;">🗺️ STRATEGIC ROADMAP (PHASED ROLLOUT)</h4>
      ${phases.map((phase, idx) => `
        <div style="position: relative; margin-bottom: 24px;">
          <div style="position: absolute; left: -31px; top: 0; width: 20px; height: 20px; background: #111827; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold;">
            ${idx + 1}
          </div>
          <div style="font-weight: 700; color: #111827; font-size: 14px; margin-bottom: 4px;">${phase.title} <span style="font-weight: 400; color: #6b7280; font-size: 12px;">(${phase.timeline})</span></div>
          <div style="font-size: 13px; color: #4b5563;">${phase.desc}</div>
          <div style="margin-top: 8px; display: flex; gap: 8px; flex-wrap: wrap;">
            ${phase.milestones.map(m => `<span style="background: #f3f4f6; padding: 2px 8px; border-radius: 12px; font-size: 10px; color: #374151; border: 1px solid #e5e7eb;">✓ ${m}</span>`).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Generate an executive "Monday Morning Action Plan"
 */
function generateActionPlan(actions, style) {
  const { highlightBoxStyle } = style;
  return `
    <div style="${highlightBoxStyle} border-left-color: #111827; background: #f3f4f6;">
      <h4 style="margin: 0 0 12px 0; color: #111827; text-transform: uppercase; font-size: 13px; letter-spacing: 0.1em;">📅 Monday Morning Action Plan</h4>
      <div style="display: grid; gap: 12px;">
        ${actions.map((action, idx) => `
          <div style="font-size: 13px;">
            <div style="font-weight: 700; color: #111827; margin-bottom: 2px;">${idx + 1}. ${action.title}</div>
            <div style="color: #4b5563;">${action.desc}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * Generate three guided prompts for the user
 */
function generateGuidedPrompts(prompts) {
  return `
    <div style="margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
      <h4 style="font-size: 13px; color: #6b7280; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px;">Next Strategic Steps</h4>
      <div style="display: grid; gap: 10px;">
        ${prompts.map(p => `
          <button 
            class="guided-prompt-btn" 
            onclick="window.handleGuidedPrompt && window.handleGuidedPrompt('${p.replace(/'/g, "\\'")}')"
            style="display: flex; align-items: center; gap: 12px; width: 100%; text-align: left; padding: 12px 16px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; color: #1e2937; cursor: pointer; transition: all 0.2s; font-family: inherit;"
            onmouseover="this.style.borderColor='#3b82f6'; this.style.backgroundColor='#f8fafc';" 
            onmouseout="this.style.borderColor='#e2e8f0'; this.style.backgroundColor='white';"
          >
            <span style="color: #3b82f6; font-weight: bold;">➔</span>
            <span>Would you like to <strong>${p}</strong>?</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * Generate a generic data table
 */
function generateGenericTable(headers, rows, style) {
  const { tableStyle, thStyle, tdStyle } = style;
  return `
    <div style="overflow-x: auto; margin-bottom: 16px;">
      <table style="${tableStyle}">
        <thead>
          <tr>
            ${headers.map(h => `<th style="${thStyle}">${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.map(row => `
            <tr>
              ${row.map(cell => `<td style="${tdStyle}">${cell}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

/**
 * Generate realistic mock output based on prompt context
 */
function generateRealisticMockOutput(prompt, context = {}) {
  const title = prompt.title || 'Analysis';
  const content = (prompt.content || '') + (prompt.promptCode || '');

  // Get Context (if available) - Improved for Robustness
  const chapterId = context.chapter?.id || '';
  const chapterTitle = context.chapter?.title || context.chapter || '';
  const problemTitle = context.problem?.title || context.problem || '';

  // Style Constants
  const containerStyle = "font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #1f2937; line-height: 1.6; max-width: 100%;";
  const sectionTitleStyle = "font-size: 14px; font-weight: 700; color: #6b7280; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 8px; border-bottom: 2px solid #e5e7eb; padding-bottom: 4px; margin-top: 24px;";
  const highlightBoxStyle = "background: #f9fafb; border-left: 4px solid #3b82f6; padding: 16px; margin: 16px 0; border-radius: 4px;";
  const tableStyle = "width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px;";
  const thStyle = "text-align: left; padding: 8px 12px; background: #f3f4f6; border-bottom: 2px solid #e5e7eb; font-weight: 600; color: #374151;";
  const tdStyle = "padding: 8px 12px; border-bottom: 1px solid #e5e7eb; color: #1f2937;";

  let bodyHtml = '';
  let summaryText = '';
  let type = 'analysis';
  let metrics = {
    latency: '420ms',
    confidence: '100%',
    efficiency: 'Optimal',
    visualMetrics: []
  };

  // --- LOGIC: DOMAIN DETECTION (Strict + Regex Fallback) ---
  const isFreight = chapterId === 'ch1' || /freight|logistics|supply chain|shipping/i.test(chapterTitle) || (/freight/i.test(problemTitle) && !/fraud/i.test(problemTitle));
  const isHR = chapterId === 'ch3' || /talent|hr|recruiting|hiring|people|culture/i.test(chapterTitle) || /talent|hr/i.test(problemTitle);
  const isManufacturing = chapterId === 'ch4' || /manufacturing|production|factory|plant/i.test(chapterTitle);
  const isHealthcare = chapterId === 'ch6' || /health|medical|patient|clinical|adherence/i.test(chapterTitle) || /patient|coach/i.test(problemTitle);
  const isFinance = chapterId === 'ch7' || /finance|banking|fraud|capital|lending|compliance|kyc/i.test(chapterTitle) || /fraud|kyc|variance|credit|onboarding/i.test(problemTitle);
  const isSales = chapterId === 'ch8' || /sales|marketing|revenue|gtm|go-to-market|lead/i.test(chapterTitle) || /sales|marketing|hook|triage/i.test(problemTitle);
  const isLegal = /legal|contract|compliance|regulatory/i.test(chapterTitle) || /contract|policy/i.test(problemTitle);

  // --- FAILURE MODE INTEGRATION (New Context Feature) ---
  const failureModes = context.problem?.failureModes || [];
  let riskMitigationHtml = '';

  if (failureModes.length > 0) {
    riskMitigationHtml = `
      <div style="margin-top: 32px; border-top: 1px dashed #d1d5db; padding-top: 16px;">
        <h4 style="font-size: 13px; color: #ef4444; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; font-weight: 700;">
          ⚠️ Risk Mitigation & Guardrails
        </h4>
        <div style="display: grid; gap: 12px;">
          ${failureModes.slice(0, 2).map(fm => `
            <div style="background: #fff5f5; border: 1px solid #fee2e2; padding: 12px; border-radius: 4px;">
              <div style="font-weight: 600; font-size: 13px; color: #991b1b; margin-bottom: 4px;">Potential Failure Mode: ${fm.title}</div>
              <div style="font-size: 12px; color: #7f1d1d;"><strong>Symptom:</strong> ${fm.symptom || 'N/A'}</div>
              <div style="font-size: 11px; color: #b91c1c; margin-top: 6px; font-style: italic;">Recovery: ${fm.recovery ? fm.recovery.substring(0, 100) + '...' : 'Refer to manual.'}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // --- SCENARIO 1: FREIGHT & LOGISTICS (Precision Standard) ---
  if (isFreight) {
    type = 'audit';
    summaryText = "Executed Freight Audit Simulation. Verified 100% Data Integrity. Identified $246.03 (5.9%) in recoverable leakage.";
    metrics.visualMetrics = [
      { label: 'Data Integrity', value: 100, color: 'emerald' },
      { label: 'Leakage Detected', value: 5.9, color: 'red' },
      { label: 'Auto-Recoverable', value: 92, color: 'blue' }
    ];

    bodyHtml = `
      <div style="background: #1e3a8a; color: white; padding: 24px; border-radius: 8px; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.25em; margin-bottom: 12px; opacity: 0.9; font-weight: 700;">Strategic Assessment Protocol: LOG-V4</div>
        <h1 style="margin: 0; font-size: 24px; font-weight: 800; line-height: 1.2;">🚨 FREIGHT AUDIT & RECOVERY SIMULATION</h1>
        <div style="margin-top: 16px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div style="font-size: 13px;"><strong>Methodology:</strong> 5-Step Audit Loop</div>
          <div style="font-size: 13px;"><strong>Standard:</strong> CSCMP-ASMP-LOG-004</div>
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <p style="font-size: 13px; color: #4b5563;">
          Executing freight audit simulation using standardized mock data (Mid-Market Freight Scenario). 
          Walking through the 5-step methodology to identify margin leakage.
        </p>
      </div>

      <h3 style="${sectionTitleStyle}">SIMULATION DATA GENERATION</h3>
      <p style="font-size: 13px; color: #4b5563; margin-bottom: 12px;"><strong>INPUT 1: Master Contract Rates</strong></p>
      ${generateGenericTable(
      ['Carrier', 'Service', 'Origin', 'Dest', 'Base Rate', 'Wt Break', 'Min Charge'],
      [
        ['ABF Freight', 'Standard LTL', '90210', '10001', '$425.00', '500-1000', '$85.00'],
        ['ABF Freight', 'Standard LTL', '90210', '60601', '$389.00', '500-1000', '$85.00'],
        ['Old Dominion', 'Guaranteed', '90210', '10001', '$575.00', '500-1000', '$95.00'],
        ['Old Dominion', 'Standard LTL', '90210', '30301', '$362.00', '500-1000', '$82.00'],
        ['UPS Freight', 'Standard LTL', '90210', '75201', '$408.00', '500-1000', '$88.00'],
        ['FedEx Freight', 'Priority', '90210', '98101', '$512.00', '500-1000', '$92.00']
      ],
      { tableStyle, thStyle, tdStyle }
    )}

      <p style="font-size: 13px; color: #4b5563; margin-top: 20px; margin-bottom: 12px;"><strong>INPUT 2: Itemized Freight Invoices (Sample)</strong></p>
       ${generateGenericTable(
      ['Invoice ID', 'Tracking', 'Carrier', 'Wt', 'Description', 'Amount', 'Total'],
      [
        ['INV-2024-001', 'ABF987...', 'ABF Freight', '750', 'Base Freight', '$475.00', '$618.13'],
        ['INV-2024-002', 'OD987...', 'Old Dominion', '825', 'Base Freight', '$575.00', '$747.50'],
        ['INV-2024-003', 'UPS456...', 'UPS Freight', '625', 'Base Freight', '$408.00', '$530.40'],
        ['INV-2024-006', 'FX654...', 'FedEx Freight', '875', 'Base Freight', '$550.00', '$770.00']
      ],
      { tableStyle, thStyle, tdStyle }
    )}

      <h3 style="${sectionTitleStyle}">STEP 1: DATA INTEGRITY & BASELINE DIAGNOSTIC</h3>
      ${generateGenericTable(
      ['Invoice ID', 'Line Item Sum', 'Total Charge', 'Variance', 'Status'],
      [
        ['INV-2024-001', '$618.13', '$618.13', '$0.00', '✓ PASS'],
        ['INV-2024-002', '$747.50', '$747.50', '$0.00', '✓ PASS'],
        ['INV-2024-003', '$530.40', '$530.40', '$0.00', '✓ PASS'],
        ['INV-2024-004', '$578.50', '$578.50', '$0.00', '✓ PASS'],
        ['INV-2024-005', '$470.60', '$470.60', '$0.00', '✓ PASS']
      ],
      { tableStyle, thStyle, tdStyle }
    )}
      <div style="font-size: 13px; font-weight: bold; color: #059669; margin-top: 8px;">DIAGNOSTIC: 100% Data Integrity - Proceeding to Step 2</div>

      <h3 style="${sectionTitleStyle}">STEP 2: RATE LOGIC VERIFICATION</h3>
      ${generateGenericTable(
      ['Invoice', 'Carrier', 'Lane', 'Contract Base', 'Invoiced', 'Variance', 'Reasoning'],
      [
        ['INV-001', 'ABF', '90210→10001', '$425.00', '$475.00', '<span style="color:#dc2626">+$50.00</span>', 'Rate creep - 11.8% above contract'],
        ['INV-002', 'ODFL', '90210→10001', '$575.00', '$575.00', '$0.00', 'Matches contract'],
        ['INV-004', 'ABF', '90210→10001', '$425.00', '$445.00', '<span style="color:#dc2626">+$20.00</span>', 'Rate discrepancy'],
        ['INV-006', 'FedEx', '90210→98101', '$512.00', '$550.00', '<span style="color:#dc2626">+$38.00</span>', '7.4% above Priority rate']
      ],
      { tableStyle, thStyle, tdStyle }
    )}

      <h3 style="${sectionTitleStyle}">STEP 3: ACCESSORIAL & "GHOST CHARGE" AUDIT</h3>
       ${generateGenericTable(
      ['Invoice', 'Charge Type', 'Invoiced', 'Contract Rate', 'Variance', 'Confidence'],
      [
        ['INV-001', 'Fuel Surcharge', '$85.50', '$76.50', '<span style="color:#dc2626">+$9.00</span>', '10/10'],
        ['INV-001', 'Residential', '$57.63', '$45.00', '<span style="color:#dc2626">+$12.63</span>', '10/10'],
        ['INV-002', 'Liftgate', '$69.00', '$60.00', '<span style="color:#dc2626">+$9.00</span>', '10/10'],
        ['INV-004', 'Detention', '$225.00', '$75.00', '<span style="color:#d97706">+$150.00</span>', '5/10*'],
        ['INV-006', 'Sat Delivery', '$121.00', '$95.00', '<span style="color:#dc2626">+$26.00</span>', '10/10']
      ],
      { tableStyle, thStyle, tdStyle }
    )}
      <div style="font-size: 11px; color: #d97706; font-style: italic;">*Detention confidence reduced pending dock log verification</div>

      <h3 style="${sectionTitleStyle}">STEP 4: OUTPUT GENERATION & ROI</h3>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div>
          <h4 style="font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 8px;">DELIVERABLE 1: Recovery Summary</h4>
          ${generateGenericTable(
      ['Carrier', 'Audited', 'Errors', 'Recovery'],
      [
        ['ABF Freight', '$1,663', '7', '$195.23'],
        ['Old Dominion', '$1,218', '1', '$9.00'],
        ['FedEx Freight', '$770', '2', '$32.84'],
        ['<strong>TOTAL</strong>', '<strong>$4,181</strong>', '<strong>11</strong>', '<strong>$246.03</strong>']
      ],
      { tableStyle: "width: 100%; border-collapse: collapse; font-size: 11px;", thStyle, tdStyle }
    )}
        </div>
        <div>
           <h4 style="font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 8px;">DELIVERABLE 2: Dispute Log</h4>
           <div style="background: #f8fafc; padding: 12px; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 11px;">
              <div style="margin-bottom: 8px;"><strong>High-Confidence Disputes:</strong> $224.03</div>
              <div style="margin-bottom: 8px;"><strong>Pending Verification:</strong> $150.00</div>
              <div style="color: #059669; font-weight: bold;">Leakage: 5.9% of spend</div>
           </div>
        </div>
      </div>

       <h4 style="font-size: 12px; font-weight: 700; text-transform: uppercase; margin-top: 16px; margin-bottom: 8px;">DELIVERABLE 3: Generated Dispute Emails</h4>
       <div style="background: #f1f5f9; padding: 16px; border-radius: 6px; font-size: 12px; white-space: pre-wrap; font-family: monospace; border: 1px solid #e2e8f0;">
<strong>TO:</strong> ABF Freight Billing Disputes <billing.disputes@abf.com>
<strong>SUBJECT:</strong> Invoice Dispute - Rate & Accessorial Corrections - INV-2024-001

Dear ABF Freight Billing Team,

Per our Master Carrier Agreement (Contract #MC-2024-ABF), we are disputing the following charges:

1. Base Rate (INV-001): Billed $475.00 vs Contract $425.00. Overcharge: $50.00
2. Fuel Surcharge: Incorrectly calculated on inflated base. Overcharge: $9.00
3. Residential: Billed $57.63 vs Contract $45.00. Overcharge: $12.63

Total Credits Requested: <strong>$71.63</strong>

Please issue credit memos immediately.
       </div>

      <h3 style="${sectionTitleStyle}">STEP 5: FINAL RECOMMENDATIONS</h3>
      ${generateActionPlan([
      { title: 'IMMEDIATE ACTION', desc: 'Send all 10 high-confidence disputes totaling $184.03.' },
      { title: 'PENDING REVIEW', desc: 'Request dock receipts for Detention charge of $150.00.' },
      { title: 'PROCESS IMPROVEMENT', desc: 'ABF Freight shows 11.8% rate inflation pattern. Consider automated verification.' }
    ], { highlightBoxStyle })}

      <div style="margin-top: 16px; font-size: 13px; font-weight: 700; color: #1e3a8a;">
        The "Chaos Tax" identified: 5.9% of freight spend (Industry Avg: 6%)
      </div>

      ${generateGuidedPrompts([
      'send these dispute emails to carriers now',
      'generate a dock log request template for detention',
      'simulate a 10% rate reduction negotiation scenario'
    ])}
    `;

  } else if (isHR) {
    type = 'hr_analysis';
    summaryText = "Talent Velocity Analysis Complete. Identified $84k in annual Productivity Drag.";
    metrics.visualMetrics = [
      { label: 'Sourcing Quality', value: 72, color: 'blue' },
      { label: 'Hiring Velocity', value: 84, color: 'emerald' }
    ];
    bodyHtml = `
      <div style="background: #065f46; color: white; padding: 24px; border-radius: 8px; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.25em; margin-bottom: 12px; opacity: 0.9; font-weight: 700;">People & Culture Strategic Protocol: Talent-V12</div>
        <h1 style="margin: 0; font-size: 24px; font-weight: 800; line-height: 1.2;">🚀 TALENT VELOCITY DIAGNOSTIC</h1>
        <div style="margin-top: 16px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div style="font-size: 13px;"><strong>Node:</strong> ${problemTitle}</div>
          <div style="font-size: 13px;"><strong>Model:</strong> V-CORE Talent Metric</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 24px;">
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px; border-radius: 6px;">
          <div style="font-size: 10px; text-transform: uppercase; color: #15803d; font-weight: 700;">Fill Velocity</div>
          <div style="font-size: 18px; font-weight: 800; color: #166534;">Low</div>
        </div>
        <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 12px; border-radius: 6px;">
          <div style="font-size: 10px; text-transform: uppercase; color: #b91c1c; font-weight: 700;">Churn Risk</div>
          <div style="font-size: 18px; font-weight: 800; color: #991b1b;">High</div>
        </div>
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 12px; border-radius: 6px;">
          <div style="font-size: 10px; text-transform: uppercase; color: #1e40af; font-weight: 700;">Productivity Drag</div>
          <div style="font-size: 18px; font-weight: 800; color: #1e3a8a;">$84k/yr</div>
        </div>
      </div>

      <h3 style="${sectionTitleStyle}">1.0 PIPELINE FRICTION ANALYSIS</h3>
      <p style="font-size: 13px; color: #4b5563; margin-bottom: 16px;">
        Analyzing <strong>Workday/Greenhouse</strong> telemetry data. Identified significant 'Review Stagnation' in the Stage 2 technical evaluation loop.
      </p>

      ${generateVisualChart('Recruitment Pipeline Efficiency', [
      { label: 'Sourcing Quality', value: 72, color: '#10b981' },
      { label: 'Interview Consistency', value: 45, color: '#f59e0b' },
      { label: 'Offer Acceptance Rate', value: 88, color: '#3b82f6' },
      { label: 'Time-to-Productivity', value: 34, color: '#ef4444' }
    ])}

      <h3 style="${sectionTitleStyle}">2.0 RECRUITING ROI MODEL</h3>
      ${generateROITable([
      { lever: 'Scheduling Friction', current: '12 Days', optimized: '3 Days', impact: '$14,400' },
      { lever: 'Candidate Drop-off', current: '42.1%', optimized: '12.4%', impact: '$42,000' },
      { lever: 'Interviewer Burnout', current: 'High', optimized: 'Managed', impact: '14% Retention' },
      { lever: 'Agency Fees', current: '$180k/yr', optimized: '$45k/yr', impact: '$135,000' }
    ], { tableStyle, thStyle, tdStyle })}

      <h3 style="${sectionTitleStyle}">3.0 TECHNICAL ROOT CAUSE</h3>
      <div style="${highlightBoxStyle} border-left-color: #059669; background: #f0fdf4;">
        <div style="font-weight: 800; font-size: 14px; color: #065f46; margin-bottom: 8px;">SYSTEMIC DIAGNOSTIC: INTERVIEW ASYMMETRY</div>
        <p style="font-size: 13px; color: #064e3b; margin: 0;">
          Detected a <strong>"Sentiment Gap"</strong> between Hiring Manager feedback and Candidate Experience scores. 
          Candidates are reporting "Technical Disconnects" during the Stage 2 deep-dive.
        </p>
        <ul style="font-size: 12px; margin: 12px 0 0 0; color: #064e3b;">
          <li><strong>Wait Time:</strong> Average 18.4 hours between interview and scoring.</li>
          <li><strong>Bias Marker:</strong> 62% of rejected candidates had 'High-Potential' markers in initial sourcing.</li>
          <li><strong>Cultural Sensitivity:</strong> Lack of SDOH-aware accommodation flags in the interview guide.</li>
        </ul>
      </div>

      <h3 style="${sectionTitleStyle}">4.0 STRATEGIC ROADMAP</h3>
      ${generateStrategicRoadmap([
      {
        title: 'Infrastructure Harmonization',
        timeline: 'Week 1-3',
        desc: 'Deploy the RAG-based interview generator to standardize Stage 2 technical prompts across all departments.',
        milestones: ['Template Sync', 'HM Training', 'Baseline Reset']
      },
      {
        title: 'Autonomous Scheduling',
        timeline: 'Week 4-6',
        desc: 'Activate the AI-scheduling layer to bypass manual calendar slop and reduce Stage-to-Stage latency.',
        milestones: ['Calendar API Sync', 'SLA Policy Def.', 'Live Pilot']
      },
      {
        title: 'Predictive Culture Loop',
        timeline: 'Week 8+',
        desc: 'Integrate real-time sentiment analysis for interview scoring to identify and mitigate subconscious bias.',
        milestones: ['Sentiment Engine', 'Bias Audit V1', 'Full Deployment']
      }
    ])}

      <h3 style="${sectionTitleStyle}">5.0 EXECUTIVE SUMMARY (CHRO)</h3>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 6px; font-size: 13px; color: #334155;">
        <p style="margin: 0 0 12px 0;"><strong>Strategic Verdict:</strong> Your recruitment engine is leaking its best talent at the <strong>Stage 2 "Black Hole"</strong>. The lack of standardized scoring is creating high variance in hire quality and extending the fill-time by 18 days beyond the industry benchmark.</p>
        <p style="margin: 0;"><strong>Immediate Recommendation:</strong> Implement the standardized technical prompt library immediately to stabilize the Stage 2 evaluation process.</p>
      </div>

      ${generateActionPlan([
      { title: 'Standardize Technical Prompts', desc: 'Deploy the RAG-generated library for the next 5 Engineering hires to eliminate Stage 2 scoring variance.' },
      { title: 'SLA Enforcement', desc: 'Notify all Hiring Managers of the new "24-Hour Feedback Rule" to reduce candidate drop-off.' },
      { title: 'Bias Audit Trigger', desc: 'Run the current scorecard data through the AI-auditor to identify specific HM bias patterns.' }
    ], { highlightBoxStyle })}

      ${generateGuidedPrompts([
      'analyze candidate drop-off by specific engineering sub-team',
      'refine the Stage 2 technical evaluation rubric for Senior roles',
      'simulate the cost-to-hire impact of reducing fill-time by 10 days'
    ])}
    `;

    // --- SCENARIO 3: MANUFACTURING (Precision Standard) ---
  } else if (isManufacturing) {
    type = 'manufacturing_opt';
    summaryText = "Production Sequence Optimized. Recovers 14.2% hidden capacity in Shift B.";
    metrics.visualMetrics = [
      { label: 'OEE Optimization', value: 85, color: 'blue' },
      { label: 'Yield Stability', value: 99, color: 'emerald' }
    ];
    bodyHtml = `
      <div style="background: #92400e; color: white; padding: 24px; border-radius: 8px; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.25em; margin-bottom: 12px; opacity: 0.9; font-weight: 700;">Industrial Systems Protocol: MFG-V7</div>
        <h1 style="margin: 0; font-size: 24px; font-weight: 800; line-height: 1.2;">🏭 MANUFACTURING THROUGHPUT AUDIT</h1>
        <div style="margin-top: 16px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div style="font-size: 13px;"><strong>Node:</strong> ${problemTitle}</div>
          <div style="font-size: 13px;"><strong>Standard:</strong> LEAN-SIX-SIGMA-2.1</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 24px;">
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px; border-radius: 6px;">
          <div style="font-size: 10px; text-transform: uppercase; color: #15803d; font-weight: 700;">Target OEE</div>
          <div style="font-size: 18px; font-weight: 800; color: #166534;">85%</div>
        </div>
        <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 12px; border-radius: 6px;">
          <div style="font-size: 10px; text-transform: uppercase; color: #b91c1c; font-weight: 700;">Current OEE</div>
          <div style="font-size: 18px; font-weight: 800; color: #991b1b;">62.4%</div>
        </div>
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 12px; border-radius: 6px;">
          <div style="font-size: 10px; text-transform: uppercase; color: #1e40af; font-weight: 700;">Capacity Gap</div>
          <div style="font-size: 18px; font-weight: 800; color: #1e3a8a;">22.6%</div>
        </div>
      </div>

      <h3 style="${sectionTitleStyle}">1.0 OEE (OVERALL EQUIPMENT EFFECTIVENESS) DIAGNOSTIC</h3>
      <p style="font-size: 13px; color: #4b5563; margin-bottom: 16px;">
        Analyzing <strong>IoT telemetry</strong> from Line 4. Identifying micro-stoppages and setup-time variance across 3 shifts.
      </p>

      ${generateVisualChart('OEE Component Breakdown', [
      { label: 'Availability (Uptime)', value: 74, color: '#10b981' },
      { label: 'Performance (Speed)', value: 62, color: '#f59e0b' },
      { label: 'Quality (Yield)', value: 99, color: '#3b82f6' },
      { label: 'Changeover Efficiency', value: 41, color: '#ef4444' }
    ])}

      <h3 style="${sectionTitleStyle}">2.0 CAPACITY RECOVERY MODEL</h3>
      ${generateROITable([
      { lever: 'Setup Changeover', current: '240m/avg', optimized: '85m/avg', impact: '$84,500' },
      { lever: 'Idle Micro-Stops', current: '14/hr', optimized: '2/hr', impact: '$32,400' },
      { lever: 'Scrap Rate (Material)', current: '4.2%', optimized: '1.1%', impact: '$18,200' },
      { lever: 'Shift Transitional Drag', current: '18m', optimized: '2m', impact: '$12,400' }
    ], { tableStyle, thStyle, tdStyle })}

      <h3 style="${sectionTitleStyle}">3.0 TECHNICAL ROOT CAUSE</h3>
      <div style="${highlightBoxStyle} border-left-color: #d97706; background: #fffbeb;">
        <div style="font-weight: 800; font-size: 14px; color: #92400e; margin-bottom: 8px;">SYSTEMIC DIAGNOSTIC: BATCH-MISMATCH</div>
        <p style="font-size: 13px; color: #78350f; margin: 0;">
          Detected SKU-family mismatch in Line 4 sequencing. Running "High-Vis" color plastics immediately after "Standard" requires full wash-down of the injection manifolds. 
        </p>
        <ul style="font-size: 12px; margin: 12px 0 0 0; color: #78350f;">
          <li><strong>Wait Time:</strong> 155 minutes wasted in mandatory transitional cleaning.</li>
          <li><strong>Energy Slop:</strong> 12% increase in BTU load during high-heat wash cycles.</li>
          <li><strong>Predictive Lag:</strong> Current MES lacks "Transitional Buffer" calculation in the Job queue.</li>
        </ul>
      </div>

      <h3 style="${sectionTitleStyle}">4.0 STRATEGIC ROADMAP</h3>
      ${generateStrategicRoadmap([
      {
        title: 'Sequence Stabilization',
        timeline: 'Week 1-2',
        desc: 'Redirect Job Queue through the RAG-sequencer to re-group Group B (High-Vis) before Group A (Standard).',
        milestones: ['Queue Redirect', 'SKU Mapping', 'Wash-down Audit']
      },
      {
        title: 'Sensor Recalibration',
        timeline: 'Week 3-4',
        desc: 'Execute field-recalibration of IoT pressure sensors on Line 4 to eliminate phantom micro-stops.',
        milestones: ['Sensor Audit', 'Firmware Patch', 'Live Validation']
      },
      {
        title: 'Autonomous Throughput',
        timeline: 'Week 6+',
        desc: 'Deploy the full RAG-MES-Bridge to automate job sequencing based on real-time raw material viscosity.',
        milestones: ['MES Integration', 'Viscosity Triage', 'Full Rollout']
      }
    ])}

      <h3 style="${sectionTitleStyle}">5.0 EXECUTIVE SUMMARY (COO)</h3>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 6px; font-size: 13px; color: #334155;">
        <p style="margin: 0 0 12px 0;"><strong>Strategic Verdict:</strong> Your factory floor is suffering from **"Operational Friction"** caused by sub-optimal sequencing. Line 4 is effectively operating at only 62% of its theoretical capacity due to avoidable cleaning overhead.</p>
        <p style="margin: 0;"><strong>Immediate Recommendation:</strong> Re-sequence the 8-job schedule for Shift B immediately to recover 2.5 hours of hidden capacity.</p>
      </div>

      ${generateActionPlan([
      { title: 'Shift Re-Sequence Trigger', desc: 'Execute the optimized 8-job schedule immediately to recover 2.5 hours of uptime for Line 4.' },
      { title: 'IoT Sensor Reset', desc: 'Recalibrate the pressure transducers on Line 4 to prevent phantom micro-stoppages detected in the telemetry.' },
      { title: 'Wash-down Protocol Audit', desc: 'Verify cleaning chemical concentration to ensure wash-down cycles meet the 85-minute target.' }
    ], { highlightBoxStyle })}

      ${generateGuidedPrompts([
      'optimize the sequence for the upcoming high-viscosity product run',
      'analyze the OEE drift over the last 30 days for Line 4',
      'generate a preventative maintenance schedule based on micro-stop telemetry'
    ])}
    `;

    // --- SCENARIO 4: LEGAL & CONTRACTS (Precision Standard) ---
  } else if (isLegal) {
    type = 'legal_review';
    summaryText = "Contract Risk Scan Complete. Flagged 2 high-exposure liability clauses.";
    metrics.visualMetrics = [
      { label: 'Liability Mitigation', value: 94, color: 'red' },
      { label: 'Regulatory Coverage', value: 82, color: 'blue' }
    ];
    bodyHtml = `
      <div style="background: #450a0a; color: white; padding: 24px; border-radius: 8px; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.25em; margin-bottom: 12px; opacity: 0.9; font-weight: 700;">General Counsel Strategic Protocol: LEG-V9</div>
        <h1 style="margin: 0; font-size: 24px; font-weight: 800; line-height: 1.2;">⚖️ CONTRACTUAL EXPOSURE AUDIT</h1>
        <div style="margin-top: 16px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div style="font-size: 13px;"><strong>Node:</strong> ${problemTitle}</div>
          <div style="font-size: 13px;"><strong>Standard:</strong> SOX-404-LEGAL</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 24px;">
        <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 12px; border-radius: 6px;">
          <div style="font-size: 10px; text-transform: uppercase; color: #991b1b; font-weight: 700;">Liability Cap</div>
          <div style="font-size: 18px; font-weight: 800; color: #b91c1c;">UNCAPPED</div>
        </div>
        <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 12px; border-radius: 6px;">
          <div style="font-size: 10px; text-transform: uppercase; color: #991b1b; font-weight: 700;">Risk Rating</div>
          <div style="font-size: 18px; font-weight: 800; color: #b91c1c;">92/100</div>
        </div>
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 12px; border-radius: 6px;">
          <div style="font-size: 10px; text-transform: uppercase; color: #1e40af; font-weight: 700;">Recovery Pot.</div>
          <div style="font-size: 18px; font-weight: 800; color: #1e3a8a;">$2.4M</div>
        </div>
      </div>

      <h3 style="${sectionTitleStyle}">1.0 CLAUSE RISK TOPOGRAPHY</h3>
      <p style="font-size: 13px; color: #4b5563; margin-bottom: 16px;">
        Analyzing <strong>Master Service Agreement (MSA)</strong> for adversarial phrasing, uncapped liabilities, and "Shadow Indemnity" triggers.
      </p>

      ${generateVisualChart('Contractual Risk Distribution', [
      { label: 'Liability Exposure', value: 94, color: '#ef4444' },
      { label: 'Indemnification Scope', value: 82, color: '#f59e0b' },
      { label: 'Data Sovereignty', value: 65, color: '#3b82f6' },
      { label: 'Force Majeure Breadth', value: 41, color: '#6b7280' }
    ])}

      <h3 style="${sectionTitleStyle}">2.0 RISK MITIGATION ROI</h3>
      ${generateROITable([
      { lever: 'Consequential Damages', current: 'Unlimited', optimized: 'Cap: 1x Fees', impact: '$2.4M (Est)' },
      { lever: 'Early Termination', current: '180 Days', optimized: '30 Days', impact: '$45,000' },
      { lever: 'Intellectual Property', current: 'Perpetual', optimized: 'Limited', impact: 'Asset Shield' },
      { lever: 'Venue Arbitrage', current: 'Adversarial', optimized: 'Neutral', impact: '$12k/filing' }
    ], { tableStyle, thStyle, tdStyle })}

      <h3 style="${sectionTitleStyle}">3.0 TECHNICAL ROOT CAUSE</h3>
      <div style="${highlightBoxStyle} border-left-color: #dc2626; background: #fdf2f2;">
        <div style="font-weight: 800; font-size: 14px; color: #991b1b; margin-bottom: 8px;">SYSTEMIC DIAGNOSTIC: ASSET EXPOSURE</div>
        <p style="font-size: 13px; color: #7f1d1d; margin: 0;">
          Detected adversarial language in Section 14.2 (Intellectual Property). The current draft grants the vendor 'Perpetual Use' of derivative data without anonymization requirements. 
        </p>
        <ul style="font-size: 12px; margin: 12px 0 0 0; color: #7f1d1d;">
          <li><strong>Regulatory Clash:</strong> Section 14.2 violates GDPR/HIPAA "Right to Erasure" (Article 17).</li>
          <li><strong>Liability Trigger:</strong> Uncapped "indirect consequential losses" coverage exposes the entire corporate balance sheet.</li>
          <li><strong>Audit Trail:</strong> Vendor has used this specific wording to claw back IP in 14.2% of past litigation cases.</li>
        </ul>
      </div>

      <h3 style="${sectionTitleStyle}">4.0 STRATEGIC ROADMAP</h3>
      ${generateStrategicRoadmap([
      {
        title: 'Defensive Red-lining',
        timeline: 'Week 1',
        desc: 'Execute the SCIS (Standard Corporate Indemnity Shield) re-draft for Section 12.4 and 14.2.',
        milestones: ['Red-line Draft', 'Risk Mapping', 'Board Approval']
      },
      {
        title: 'Vendor Escalation',
        timeline: 'Week 2',
        desc: 'Trigger the "Material Non-Compliance" flag to the vendor procurement lead to force negotiation.',
        milestones: ['Escalation Trigger', 'Lead Triage', 'Counter-offer']
      },
      {
        title: 'Autonomous Compliance',
        timeline: 'Week 4+',
        desc: 'Deploy the RAG-CLM (Contract Lifecycle Management) bridge to automatically flag Article 17 violations in all future sub-vendor agreements.',
        milestones: ['CLM API Sync', 'Model Tuning', 'Full Rollout']
      }
    ])}

      <h3 style="${sectionTitleStyle}">5.0 EXECUTIVE SUMMARY (GENERAL COUNSEL)</h3>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 6px; font-size: 13px; color: #334155;">
        <p style="margin: 0 0 12px 0;"><strong>Strategic Verdict:</strong> The current MSA is a **"Nuclear Liability"**. Section 12.4 effectively waives your right to cap damages, creating an uninsurable risk profile for the upcoming fiscal quarter.</p>
        <p style="margin: 0;"><strong>Immediate Recommendation:</strong> Strike the "Perpetual" terminology from the IP clause today and cap the liability at 1x annual fees.</p>
      </div>

      ${generateActionPlan([
      { title: 'Clause Re-Draft (IP/Indemnity)', desc: 'Replace Section 12.4 and 14.2 with the SCIS-compliant language immediately.' },
      { title: 'Vendor Push-Back Trigger', desc: 'Escalate the Termination-for-Convenience clause to the Procurement lead for hard negotiation.' },
      { title: 'Regulatory Compliance Audit', desc: 'Verify the data-deletion protocol to ensure alignment with Article 17 requirements.' }
    ], { highlightBoxStyle })}

      ${generateGuidedPrompts([
      'generate a red-lined counter-offer for the Intellectual Property clause',
      'benchmark this risk profile against standard S&P 500 MSAs',
      'analyze the data sovereignty impact of the current vendor cloud setup'
    ])}
    `;

    // --- SCENARIO 5: FINANCE & BANKING (Precision Standard) ---
  } else if (isFinance) {
    const isFraud = /fraud/i.test(problemTitle);
    type = isFraud ? 'fraud_detection' : 'finance_audit';
    summaryText = isFraud
      ? "Linguistic Anomaly Detected. Flagged Account Takeover (ATO) attempt."
      : "Financial Control Audit Complete. Identified $124k in OpEx leakage.";

    metrics.visualMetrics = isFraud ? [
      { label: 'Threat Resiliency', value: 92, color: 'red' },
      { label: 'Anomaly Detection', value: 88, color: 'blue' }
    ] : [
      { label: 'Capital Leakage', value: 85, color: 'emerald' },
      { label: 'Budget Precision', value: 94, color: 'blue' }
    ];

    bodyHtml = `
      <div style="background: ${isFraud ? '#7f1d1d' : '#065f46'}; color: white; padding: 24px; border-radius: 8px; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.25em; margin-bottom: 12px; opacity: 0.9; font-weight: 700;">Capital Intelligence Protocol: FIN-V22</div>
        <h1 style="margin: 0; font-size: 24px; font-weight: 800; line-height: 1.2;">💰 ${isFraud ? 'FORENSIC FRAUD DIAGNOSTIC' : 'CAPITAL INTELLIGENCE AUDIT'}</h1>
        <div style="margin-top: 16px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div style="font-size: 13px;"><strong>Node:</strong> ${problemTitle}</div>
          <div style="font-size: 13px;"><strong>Standard:</strong> ASMP-FIN-001</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 24px;">
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px; border-radius: 6px;">
          <div style="font-size: 10px; text-transform: uppercase; color: #15803d; font-weight: 700;">Data Sync</div>
          <div style="font-size: 18px; font-weight: 800; color: #166534;">100%</div>
        </div>
        <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 12px; border-radius: 6px;">
          <div style="font-size: 10px; text-transform: uppercase; color: #b91c1c; font-weight: 700;">${isFraud ? 'Risk Score' : 'Variance'}</div>
          <div style="font-size: 18px; font-weight: 800; color: #991b1b;">${isFraud ? '88/100' : '+$124k'}</div>
        </div>
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 12px; border-radius: 6px;">
          <div style="font-size: 10px; text-transform: uppercase; color: #1e40af; font-weight: 700;">Stability</div>
          <div style="font-size: 18px; font-weight: 800; color: #1e3a8a;">CRITICAL</div>
        </div>
      </div>

      <h3 style="${sectionTitleStyle}">${isFraud ? '1.0 ANOMALY DETECTION' : '1.0 VARIANCE ANALYSIS'}</h3>
      <p style="font-size: 13px; color: #4b5563; margin-bottom: 16px;">
        ${isFraud ? 'Analyzing interaction metadata for <strong>deceptive linguistic markers</strong>, IP-velocity anomalies, and behavioral fingerprints.' : 'Reconciling GL Line items against Q3 budget allocations. Identifying double-spend and unauthorized accessorials.'}
      </p>

      ${generateVisualChart(isFraud ? 'Risk Vector Analysis' : 'Budget Variance Breakdown', isFraud ? [
      { label: 'Linguistic Deception', value: 92, color: '#ef4444' },
      { label: 'IP Velocity Leakage', value: 78, color: '#f59e0b' },
      { label: 'Behavioral Mismatch', value: 84, color: '#3b82f6' },
      { label: 'Synthetic ID Signal', value: 42, color: '#111827' }
    ] : [
      { label: 'SaaS Over-provisioning', value: 85, color: '#10b981' },
      { label: 'Double-Billing Loop', value: 64, color: '#f59e0b' },
      { label: 'Vendor Surcharges', value: 72, color: '#3b82f6' },
      { label: 'Abandoned Projects', value: 31, color: '#ef4444' }
    ])}

      <h3 style="${sectionTitleStyle}">2.0 RECOVERY & PROTECTION MODEL</h3>
      ${isFraud ? generateROITable([
      { lever: 'ATO Prevention', current: '2.4% Leak', optimized: '<0.1% Leak', impact: '$420,000' },
      { lever: 'False Positives', current: '12% Rate', optimized: '1.2% Rate', impact: '$12,000' },
      { lever: 'Chargebacks', current: '$18k/mo', optimized: '$400/mo', impact: '$211,000/yr' },
      { lever: 'KYC Friction Delay', current: '48 Hours', optimized: '2 Minutes', impact: '$18,400' }
    ], { tableStyle, thStyle, tdStyle }) : generateROITable([
      { lever: 'Double Billing Slop', current: '4.2% Flow', optimized: '0.0% Flow', impact: '$82,000' },
      { lever: 'Unused SaaS Seats', current: '142 units', optimized: '12 units', impact: '$31,400' },
      { lever: 'Vendor Overcharge', current: '$12k/mo', optimized: '$0/mo', impact: '$144,000/yr' },
      { lever: 'CapEx Arbitrage', current: 'Static', optimized: 'Dynamic', impact: '$112,000' }
    ], { tableStyle, thStyle, tdStyle })}

      <h3 style="${sectionTitleStyle}">${isFraud ? '3.0 LINGUISTIC EVIDENCE' : '3.0 STRATEGIC LEVER'}</h3>
      <div style="${highlightBoxStyle} border-left-color: ${isFraud ? '#dc2626' : '#0d9488'}; background: ${isFraud ? '#fff1f2' : '#f0fdfa'};">
        <div style="font-weight: 800; font-size: 14px; color: ${isFraud ? '#991b1b' : '#065f46'}; margin-bottom: 8px;">TECHNICAL FINDING: ${isFraud ? 'DECEPTION SIGNAL' : 'ZOMBIE OPEX'}</div>
        <p style="font-size: 13px; color: ${isFraud ? '#7f1d1d' : '#064e3b'}; margin: 0;">
          ${isFraud ? 'Interaction #7721 shows "Over-justification" and "Identity Distancing" markers. Customer claims to be CEO but provides incorrect ZIP code on 3rd attempt.' : 'Detected $42k in recurring AWS costs from a "Zombie Project" (Project-X-2024) abandoned in Q1. Triggering immediate instance termination protocol.'}
        </p>
        <ul style="font-size: 12px; margin: 12px 0 0 0; color: ${isFraud ? '#7f1d1d' : '#064e3b'};">
          ${isFraud ? `
            <li><strong>Linguistic Mark:</strong> High frequency of "honestly" and "to tell the truth" (Distancing).</li>
            <li><strong>IP Check:</strong> Originating from a high-velocity residential proxy in a Tier-3 risk zone.</li>
            <li><strong>Identity:</strong> 0% overlap with historical behavioral fingerprint.</li>
          ` : `
            <li><strong>Asset Life:</strong> 142 orphaned microservices detected with zero (0) traffic.</li>
            <li><strong>Cost Slop:</strong> $14.2/hour in unallocated compute cycles.</li>
            <li><strong>Ownership:</strong> Project owner (Employee #4492) left the company in February.</li>
          `}
        </ul>
      </div>

      <h3 style="${sectionTitleStyle}">4.0 STRATEGIC ROADMAP</h3>
      ${generateStrategicRoadmap([
      {
        title: 'Infrastructure Triage',
        timeline: 'Week 1',
        desc: isFraud ? 'Lock Account #8821 and initiate Level 2 multi-factor verification.' : 'Execute the "Zombie Kill" protocol for Project-X-2024 and re-allocate budget.',
        milestones: [isFraud ? 'Account Lock' : 'Asset Kill', 'Verification Trigger', 'Stability Audit']
      },
      {
        title: 'Audit Automation',
        timeline: 'Week 2-4',
        desc: isFraud ? 'Update the fraud engine to weight "Linguistic Urgency" markers 4x higher for the 75+ age group.' : 'Deploy the RAG-audit bot to scan GL lines every Sunday night for double-spend.',
        milestones: ['Model Update', 'Policy Tuning', 'Live Pilot']
      },
      {
        title: 'Capital Intelligence',
        timeline: 'Week 8+',
        desc: isFraud ? 'Integrate behavioral biometrics into the primary login loop.' : 'Connect RAG-audit to Procurement API for real-time vendor overcharge rejection.',
        milestones: ['Biometric Sync', 'API Bridge', 'Full Rollout']
      }
    ])}

      <h3 style="${sectionTitleStyle}">5.0 EXECUTIVE SUMMARY (CFO)</h3>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 6px; font-size: 13px; color: #334155;">
        <p style="margin: 0 0 12px 0;"><strong>Strategic Verdict:</strong> ${isFraud ? 'Your digital perimeter is being tested by **"Synthetic Identity"** attacks. The current ruleset is missing the linguistic nuances of account takeover attempts.' : 'Your OpEx is suffering from **"Capital Leakage"**. Unallocated compute and unused SaaS seats are costing the company $31.4k per month in pure waste.'}</p>
        <p style="margin: 0;"><strong>Immediate Recommendation:</strong> ${isFraud ? 'Freeze Account #8821 immediately and re-verify the identity via the Empathy Loop protocol.' : 'Terminate the Project-X internal instances to recover $42k in monthly cloud spend.'}</p>
      </div>

      ${generateActionPlan([
      { title: isFraud ? 'Account Freeze Trigger' : 'Zombie Project Termination', desc: isFraud ? 'Lock Account #8821 and trigger Level 2 ID verification to prevent ATO completion.' : 'Execute the immediate termination of the 142 microservices tied to Project-X.' },
      { title: isFraud ? 'Engine Weight Update' : 'Budget Re-Allocation', desc: isFraud ? 'Increase the weighting of "Behavioral Mismatch" in the real-time scoring engine.' : 'Move recovered $124k leakage into the Q4 R&D innovation fund for high-priority items.' },
      { title: isFraud ? 'Linguistic Training' : 'SaaS Seat Audit', desc: isFraud ? 'Feed the flagged interaction logs into the training set for the next model iteration.' : 'Cancel the 142 unused SaaS licenses identified in the GL reconciliation.' }
    ], { highlightBoxStyle })}

      ${generateGuidedPrompts([
      isFraud ? 'analyze the geographic origin of the social engineering attempt' : 'break down the OpEx leakage by department',
      isFraud ? 'generate a security awareness retraining module for high-risk targets' : 'simulate the ROI of moving to a zero-trust budget model',
      isFraud ? 'trigger a full account-activity audit for the last 48 hours' : 'allocate the recovered funds to the SaaS consolidation project'
    ])}
    `;

    // --- SCENARIO 6: HEALTHCARE & PATIENT ENGAGEMENT (Precision Standard) ---
  } else if (isHealthcare) {
    type = 'healthcare_analysis';
    summaryText = "Clinical Feasibility Audit Complete. Identified 14.2% engagement lift potential.";
    metrics.visualMetrics = [
      { label: 'Adherence Lift', value: 62, color: 'emerald' },
      { label: 'Digital Inclusion', value: 41, color: 'blue' }
    ];
    bodyHtml = `
      <div style="background: #0c4a6e; color: white; padding: 24px; border-radius: 8px; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.25em; margin-bottom: 12px; opacity: 0.9; font-weight: 700;">Clinical Engagement Strategic Protocol: MED-V4</div>
        <h1 style="margin: 0; font-size: 24px; font-weight: 800; line-height: 1.2;">🏥 CLINICAL ADHERENCE DIAGNOSTIC</h1>
        <div style="margin-top: 16px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div style="font-size: 13px;"><strong>Node:</strong> ${problemTitle}</div>
          <div style="font-size: 13px;"><strong>Standard:</strong> HIPAA-AI-SECURE</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 24px;">
        <div style="background: #f0fdfa; border: 1px solid #99f6e4; padding: 12px; border-radius: 6px;">
          <div style="font-size: 10px; text-transform: uppercase; color: #0d9488; font-weight: 700;">Adherence</div>
          <div style="font-size: 18px; font-weight: 800; color: #0f766e;">62.4%</div>
        </div>
        <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 12px; border-radius: 6px;">
          <div style="font-size: 10px; text-transform: uppercase; color: #b91c1c; font-weight: 700;">Risk Score</div>
          <div style="font-size: 18px; font-weight: 800; color: #991b1b;">78/100</div>
        </div>
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 12px; border-radius: 6px;">
          <div style="font-size: 10px; text-transform: uppercase; color: #1e40af; font-weight: 700;">Engagement</div>
          <div style="font-size: 18px; font-weight: 800; color: #1e3a8a;">Low</div>
        </div>
      </div>

      <h3 style="${sectionTitleStyle}">1.0 BEHAVIORAL FRICTION AUDIT</h3>
      <p style="font-size: 13px; color: #4b5563; margin-bottom: 16px;">
        Analyzing <strong>EMR/Pharmacy telemetry</strong>. Reconciling digital literacy gaps against socio-economic barriers (SDOH) for the 65+ age cohort.
      </p>

      ${generateVisualChart('Patient Behavioral Metrics', [
      { label: 'Medication Adherence', value: 62, color: '#10b981' },
      { label: 'Portal Engagement', value: 24, color: '#ef4444' },
      { label: 'Appointment Completion', value: 78, color: '#3b82f6' },
      { label: 'Health Literacy Index', value: 41, color: '#f59e0b' }
    ])}

      <h3 style="${sectionTitleStyle}">2.0 CLINICAL OUTCOME MODEL</h3>
      ${generateROITable([
      { lever: 'Readmission Risk', current: '18.4%', optimized: '12.1%', impact: '$412,000' },
      { lever: 'Nurse Follow-up', current: '30h/wk', optimized: '12h/wk', impact: '$84,000' },
      { lever: 'Patient Retention', current: '62%', optimized: '88%', impact: '$112,000' },
      { lever: 'ER Diversion', current: 'High', optimized: 'Low', impact: '$94,000' }
    ], { tableStyle, thStyle, tdStyle })}

      <h3 style="${sectionTitleStyle}">3.0 TECHNICAL ROOT CAUSE</h3>
      <div style="${highlightBoxStyle} border-left-color: #0284c7; background: #f0f9ff;">
        <div style="font-weight: 800; font-size: 14px; color: #075985; margin-bottom: 8px;">SYSTEMIC DIAGNOSTIC: EMPATHY GAP</div>
        <p style="font-size: 13px; color: #0c4a6e; margin: 0;">
          Detected a <strong>"Technical Literacy Ceiling"</strong> for the primary target demographic. Patients are not "forgetting" their medication; they are struggling to navigate the multi-factor authentication (MFA) required by the patient portal. 
        </p>
        <ul style="font-size: 12px; margin: 12px 0 0 0; color: #0c4a6e;">
          <li><strong>Wait Time:</strong> Average 18 hours latency between prescription fill and pick-up reminder.</li>
          <li><strong>Digital Divide:</strong> 72% of the cohort uses landlines or non-smart feature phones.</li>
          <li><strong>SDOH Marker:</strong> High correlation between pharmacy abandonment and lack of transportation coordination.</li>
        </ul>
      </div>

      <h3 style="${sectionTitleStyle}">4.0 STRATEGIC ROADMAP</h3>
      ${generateStrategicRoadmap([
      {
        title: 'Infrastructure Simplification',
        timeline: 'Week 1-2',
        desc: 'Deploy the RAG-based SMS simplifier to reduce all portal notifications to a 4th-grade reading level with landline compatibility.',
        milestones: ['SMS Triage', 'Reading Level Audit', 'Voice-to-Text Pilot']
      },
      {
        title: 'Pharmacy Loop Closing',
        timeline: 'Week 3-4',
        desc: 'Integrate the Surescripts RTPB API to reduce pharmacy pick-up latency and automate transportation vouchers.',
        milestones: ['API Integration', 'Voucher Automation', 'Latency Audit']
      },
      {
        title: 'Autonomous Clinical Coaching',
        timeline: 'Week 6+',
        desc: 'Activate the full AI Patient-Coach for real-time medication counseling and SDOH-aware obstacle removal.',
        milestones: ['Coach Model Tuning', 'Shadow Mode Test', 'Full Deployment']
      }
    ])}

      <h3 style="${sectionTitleStyle}">5.0 EXECUTIVE SUMMARY (CMO)</h3>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 6px; font-size: 13px; color: #334155;">
        <p style="margin: 0 0 12px 0;"><strong>Strategic Verdict:</strong> Your clinical outcomes are being throttled by **"Digital Friction"**. You are treating a medical adherence issue with technical complexity, which is driving the 24% engagement gap.</p>
        <p style="margin: 0;"><strong>Immediate Recommendation:</strong> Activate the landline-compatible voice-reminder protocol for the high-risk CHF cohort immediately.</p>
      </div>

      ${generateActionPlan([
      { title: 'Landline Voice Pilot Activation', desc: 'Deploy automated voice reminders for Account #9921 for the 200-patient "High-Risk CHF" cohort starting Monday.' },
      { title: 'MFA Simplification', desc: 'Enable one-click SMS verification to bypass the technical ceiling identified in the 65+ demographic.' },
      { title: 'Transportation Voucher Trigger', desc: 'Automate Uber/Lyft health vouchers for any pharmacy pick-up reminder that remains unacknowledged for >4 hours.' }
    ], { highlightBoxStyle })}

      ${generateGuidedPrompts([
      'analyze clinical outcome variance by patient age demographic',
      'refine the conversational tone for the high-friction engagement nudge',
      'simulate the long-term cost savings of the 14.2% engagement lift'
    ])}
    `;

    // --- SCENARIO 7: SALES & MARKETING (Precision Standard) ---
  } else if (isSales) {
    type = 'gtm_optimization';
    summaryText = "Revenue Velocity Audit Complete. Identified $420k in immediate GTM lift.";
    metrics.visualMetrics = [
      { label: 'Funnel Velocity', value: 92, color: 'emerald' },
      { label: 'Lead Resilience', value: 68, color: 'blue' }
    ];
    bodyHtml = `
      <div style="background: #581c87; color: white; padding: 24px; border-radius: 8px; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.25em; margin-bottom: 12px; opacity: 0.9; font-weight: 700;">Revenue Operations Strategic Protocol: GTM-V15</div>
        <h1 style="margin: 0; font-size: 24px; font-weight: 800; line-height: 1.2;">🚀 REVENUE VELOCITY AUDIT</h1>
        <div style="margin-top: 16px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div style="font-size: 13px;"><strong>Node:</strong> ${problemTitle}</div>
          <div style="font-size: 13px;"><strong>Model:</strong> V-CORE GTM Metric</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 24px;">
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px; border-radius: 6px;">
          <div style="font-size: 10px; text-transform: uppercase; color: #15803d; font-weight: 700;">Response Speed</div>
          <div style="font-size: 18px; font-weight: 800; color: #166534;">2.4 Min</div>
        </div>
        <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 12px; border-radius: 6px;">
          <div style="font-size: 10px; text-transform: uppercase; color: #b91c1c; font-weight: 700;">MQL Leakage</div>
          <div style="font-size: 18px; font-weight: 800; color: #991b1b;">32.1%</div>
        </div>
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 12px; border-radius: 6px;">
          <div style="font-size: 10px; text-transform: uppercase; color: #1e40af; font-weight: 700;">Lift Potential</div>
          <div style="font-size: 18px; font-weight: 800; color: #1e3a8a;">$420k</div>
        </div>
      </div>

      <h3 style="${sectionTitleStyle}">1.0 FUNNEL TELEMETRY ANALYSIS</h3>
      <p style="font-size: 13px; color: #4b5563; margin-bottom: 16px;">
        Analyzing <strong>Salesforce/HubSpot</strong> funnel velocity. Reconciling intent signals against SDR response latency and "Static Hook" decay.
      </p>

      ${generateVisualChart('GTM Efficiency Metrics', [
      { label: 'Lead Triage Speed', value: 92, color: '#10b981' },
      { label: 'Hook Personalization', value: 18, color: '#ef4444' },
      { label: 'Enterprise Win Rate', value: 34, color: '#f59e0b' },
      { label: 'Churn Resilience', value: 68, color: '#3b82f6' }
    ])}

      <h3 style="${sectionTitleStyle}">2.0 REVENUE ACCELERATION MODEL</h3>
      ${generateROITable([
      { lever: 'Lead Triage Speed', current: '252m', optimized: '2m', impact: '$211,000' },
      { lever: 'Personalized Hook', current: 'Static', optimized: 'AI-Dynamic', impact: '14% Conv. Lift' },
      { lever: 'SDR Burnout Transfer', current: 'High', optimized: 'Low', impact: '$45,000' },
      { lever: 'Tier-1 Re-engagement', current: '0% Manual', optimized: '84% Auto', impact: '$164,000' }
    ], { tableStyle, thStyle, tdStyle })}

      <h3 style="${sectionTitleStyle}">3.0 TECHNICAL ROOT CAUSE</h3>
      <div style="${highlightBoxStyle} border-left-color: #7c3aed; background: #f5f3ff;">
        <div style="font-weight: 800; font-size: 14px; color: #581c87; margin-bottom: 8px;">SYSTEMIC DIAGNOSTIC: INTENT MISMATCH</div>
        <p style="font-size: 13px; color: #4c1d95; margin: 0;">
          Detected severe **"Intent Decay"** in the Mid-Market segment. 42% of Enterprise leads are viewing "Pricing" 3x or more but receiving a generic "Top Funnel" ebook follow-up. 
        </p>
        <ul style="font-size: 12px; margin: 12px 0 0 0; color: #4c1d95;">
          <li><strong>Signal Leak:</strong> Pricing-page intent is not triggering a high-priority SDR alert.</li>
          <li><strong>Content Slop:</strong> Generic follow-up hooks have a 0.8% click-through rate (CTR).</li>
          <li><strong>Latency Gap:</strong> Account owners take average 4.2 hours to acknowledge high-intent signals.</li>
        </ul>
      </div>

      <h3 style="${sectionTitleStyle}">4.0 STRATEGIC ROADMAP</h3>
      ${generateStrategicRoadmap([
      {
        title: 'Intent Harmonization',
        timeline: 'Week 1-2',
        desc: 'Deploy the RAG-based intent-triage layer to re-route all pricing-page visitors directly to Solution Architects.',
        milestones: ['API Redirect', 'Signal Optimization', 'SA Training']
      },
      {
        title: 'Dynamic Hook Activation',
        timeline: 'Week 3-4',
        desc: 'Automate LinkedIn-informed personalized hooks for the top 50 Enterprise targets.',
        milestones: ['Personalization Audit', 'Hook Rollout', 'CTR Baseline']
      },
      {
        title: 'Predictive Revenue Loop',
        timeline: 'Week 8+',
        desc: 'Activate the real-time revenue velocity monitor to automatically re-allocate marketing spend to high-intent channels.',
        milestones: ['Velocity Monitor', 'Spend Arbitrage', 'Full Deployment']
      }
    ])}

      <h3 style="${sectionTitleStyle}">5.0 EXECUTIVE SUMMARY (CRO)</h3>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 6px; font-size: 13px; color: #334155;">
        <p style="margin: 0 0 12px 0;"><strong>Strategic Verdict:</strong> Your GTM engine is suffering from **"Signal Blindness"**. You are treating Enterprise intent like high-volume MQL noise, which is costing you $420k in immediate win-rate lift.</p>
        <p style="margin: 0;"><strong>Immediate Recommendation:</strong> Execute the "Spear Mode" re-routing protocol for all Tier-1 accounts with >3 pricing views today.</p>
      </div>

      ${generateActionPlan([
      { title: 'Spear Mode Re-routing', desc: 'Notify account owners and Solution Architects of the 12 high-intent leads identified in this audit snippet.' },
      { title: 'Dynamic Hook Rollout', desc: 'Deploy the AI-personalized follow-up sequence for the Mid-Market "Pricing View" cohort.' },
      { title: 'SDR Triage Bypass', desc: 'Deactivate the generic SDR gate for any lead matching the "Enterprise Intent" fingerprint.' }
    ], { highlightBoxStyle })}

      ${generateGuidedPrompts([
      'analyze the conversion lift of the initial 12 "Spear Mode" leads',
      'generate an A/B test plan for the dynamic vs. static hook sequences',
      'simulate the impact on quota attainment if SDR response time hits <5 minutes'
    ])}
    `;

    // --- SCENARIO 8: GENERIC BUSINESS FALLBACK (Precision Standard) ---
  } else {
    type = 'strategic_analysis';
    summaryText = `Precision Analysis complete for ${title}. Identified high-impact optimization levers.`;
    bodyHtml = `
      <div style="background: #111827; color: white; padding: 24px; border-radius: 8px; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.25em; margin-bottom: 12px; opacity: 0.9; font-weight: 700;">Executive Strategic Protocol: EXEC-V1</div>
        <h1 style="margin: 0; font-size: 24px; font-weight: 800; line-height: 1.2;">🔍 PRECISION SITUATIONAL ANALYSIS</h1>
        <div style="margin-top: 16px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div style="font-size: 13px;"><strong>Node:</strong> ${problemTitle}</div>
          <div style="font-size: 13px;"><strong>Domain:</strong> Enterprise Strategy</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 24px;">
        <div style="background: #f9fafb; border: 1px solid #e5e7eb; padding: 12px; border-radius: 6px;">
          <div style="font-size: 10px; text-transform: uppercase; color: #6b7280; font-weight: 700;">Complexity</div>
          <div style="font-size: 18px; font-weight: 800; color: #111827;">High</div>
        </div>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px; border-radius: 6px;">
          <div style="font-size: 10px; text-transform: uppercase; color: #15803d; font-weight: 700;">Confidence</div>
          <div style="font-size: 18px; font-weight: 800; color: #166534;">94%</div>
        </div>
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 12px; border-radius: 6px;">
          <div style="font-size: 10px; text-transform: uppercase; color: #1e40af; font-weight: 700;">Priority</div>
          <div style="font-size: 18px; font-weight: 800; color: #1e3a8a;">Tier-1</div>
        </div>
      </div>

      <h3 style="${sectionTitleStyle}">1.0 DATA TERRAFORMING DIAGNOSTIC</h3>
      <p style="font-size: 13px; color: #4b5563; margin-bottom: 16px;">
        Executing a multi-vector scan of the operational environment. Identifying systemic bottlenecks and "Ghost Levers" for rapid optimization.
      </p>

      ${generateVisualChart('Situational Variance Factors', [
      { label: 'Operational Velocity', value: 82, color: '#10b981' },
      { label: 'Automation Readiness', value: 45, color: '#f59e0b' },
      { label: 'Infrastructure Decay', value: 68, color: '#ef4444' },
      { label: 'Strategic Alignment', value: 92, color: '#3b82f6' }
    ])}

      <h3 style="${sectionTitleStyle}">2.0 STRATEGIC ROI MODEL</h3>
      ${generateROITable([
      { lever: 'Operational Velocity', current: 'Baseline', optimized: '+24%', impact: '$142,000' },
      { lever: 'Automation Yield', current: '12% Coverage', optimized: '78% Coverage', impact: '$84,000' },
      { lever: 'Risk Exposure', current: 'Moderate', optimized: 'Minimized', impact: 'Asset Shield' },
      { lever: 'Resource Density', current: 'High', optimized: 'Optimized', impact: '$62,400' }
    ], { tableStyle, thStyle, tdStyle })}

      <h3 style="${sectionTitleStyle}">3.0 TECHNICAL ROOT CAUSE</h3>
      <div style="${highlightBoxStyle} border-left-color: #111827; background: #f9fafb;">
        <div style="font-weight: 800; font-size: 14px; color: #111827; margin-bottom: 8px;">SYSTEMIC DIAGNOSTIC: INFRASTRUCTURE SLOP</div>
        <p style="font-size: 13px; color: #374151; margin: 0;">
          Detected evidence of **"Strategic Drift"** in the core operational loop. Current processes are optimized for legacy constraints that no longer exist in the data environment.
        </p>
        <ul style="font-size: 12px; margin: 12px 0 0 0; color: #4b5563;">
          <li><strong>Wait Time:</strong> Systemic delays identified in cross-departmental approval cycles.</li>
          <li><strong>Data Slop:</strong> 18% error rate in manual entry points for the primary ERP.</li>
          <li><strong>Risk Marker:</strong> Lack of autonomous guardrails in the decision-making loop.</li>
        </ul>
      </div>

      <h3 style="${sectionTitleStyle}">4.0 STRATEGIC ROADMAP</h3>
      ${generateStrategicRoadmap([
      {
        title: 'Infrastructure Stabilization',
        timeline: 'Week 1-2',
        desc: 'Redirect all high-velocity data points through the RAG-audit layer to stabilize the operational baseline.',
        milestones: ['Baseline Audit', 'Loop Stabilization', 'Security Check']
      },
      {
        title: 'Autonomous Rollout',
        timeline: 'Week 3-4',
        desc: 'Activate the AI-augmented decision support systems to bypass manual bottlenecks.',
        milestones: ['Decision Sync', 'Shadow Testing', 'Live Pilot']
      },
      {
        title: 'Predictive Maturity',
        timeline: 'Week 8+',
        desc: 'Deploy full predictive monitors to handle 100% of exception-based alerting and recovery.',
        milestones: ['Predictive Tuning', 'API Integration', 'Full Scale']
      }
    ])}

      <h3 style="${sectionTitleStyle}">5.0 EXECUTIVE SUMMARY</h3>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 6px; font-size: 13px; color: #334155;">
        <p style="margin: 0 0 12px 0;"><strong>Strategic Verdict:</strong> Your operational environment is being throttled by **"Legacy Friction"**. You are treating modern complexity with static tools, which is creating the current performance gap.</p>
        <p style="margin: 0;"><strong>Immediate Recommendation:</strong> Execute the Infrastructure Stabilization protocol immediately to recover the $142,000 in identified leakage.</p>
      </div>

      ${generateActionPlan([
      { title: 'Baseline Stabilization', desc: 'Secure the data entry points and deploy the RAG-auditor to prevent further leakage.' },
      { title: 'Decision Loop Acceleration', desc: 'Implement the automated approval bypass for Tier-3 operational tasks.' },
      { title: 'Resource Re-allocation', desc: 'Move identified capital slop into the Q4 R&D innovation fund.' }
    ], { highlightBoxStyle })}

      ${generateGuidedPrompts([
      'drill down into the specific operational bottlenecks identified',
      'simulate the long-term ROI of the full autonomous rollout',
      'generate a risk-mitigation checklist for the phased implementation'
    ])}
    `;
  }

  // Final Wrapper
  const finalHtml = `
    <div style="${containerStyle}">
      <style>
         @media print {
            @page {
              margin-top: 20mm;
              margin-bottom: 20mm;
              size: auto;
            }
            body { 
               -webkit-print-color-adjust: exact; 
               print-color-adjust: exact; 
            }
            /* Smart Break Prevention */
            h1, h2, h3, h4, table, tr, div[style*="background"], ul, ol {
               page-break-inside: avoid;
               break-inside: avoid;
            }
            h3, h4 {
               page-break-after: avoid;
               break-after: avoid;
            }
            /* Ensure large blocks don't span pages awkwardly */
            div[style*="border"], div[style*="box-shadow"] {
               page-break-inside: avoid;
            }
         }
      </style>
      ${bodyHtml}
      ${riskMitigationHtml}
    </div>
  `;

  return {
    html: finalHtml,
    summary: summaryText,
    format: 'html',
    type: type,
    metrics: metrics
  };
}

/**
 * Generate using LLM API
 */
async function generateLLM(augmentedPrompt, promptMetadata, startTime, options = {}) {
  let apiProvider = options.provider || process.env.LLM_PROVIDER || 'anthropic';
  let apiKey = options.apiKey || process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;

  // NEW: Gemini Key Pool
  const geminiKeyPool = (process.env.GEMINI_API_KEYS || '').split(',').map(k => k.trim()).filter(k => k.length > 0);

  // Auto-detect provider based on key prefix if injected from UI
  if (options.apiKey) {
    if (options.apiKey.startsWith('sk-ant')) apiProvider = 'anthropic';
    else if (options.apiKey.startsWith('sk-')) apiProvider = 'openai';
    else if (options.apiKey.startsWith('AIza')) apiProvider = 'gemini';
    else if (options.apiKey.startsWith('gsk_')) apiProvider = 'groq';
    else if (options.apiKey.startsWith('pplx-')) apiProvider = 'perplexity';
  }

  if (!apiKey && (apiProvider !== 'gemini' || geminiKeyPool.length === 0)) {
    throw new Error(`No API key provided for ${apiProvider}. Please enter a key in the Workbench or set ${apiProvider.toUpperCase()}_API_KEY environment variable.`);
  }

  let response;
  let model;

  const systemPrompt = `You are the Precision AI Architect. 
Your responses must be exhaustive, technical, and data-rich. 
Use professional structural Markdown (tables, nested lists, headers). 
Every claim must be supported by realistic data, ROI calculations, or industry benchmarks. 
End every response with a "Monday Morning Action Plan" for executive decision-makers. 
Adhere to industrial standards (e.g., ASMP, CSCMP, HIPAA, SOX). 
NEVER provide short or generic answers.
At the end of every response, you MUST provide exactly three guided follow-up prompts for the user in the format: "Would you like to [actionable step]?". Each prompt must be strategic and technical.`;

  try {
    // ============================================================================
    // 🧪 SIMULATION / TEST MODE (Integration Verification)
    // Allows user to verify provider logic without real API usage
    // ============================================================================
    if (apiKey && (apiKey.includes('test-sim') || apiKey.includes('test-key'))) {
      console.log(`[RAG] 🧪 Simulation Mode Triggered for Provider: ${apiProvider}`);

      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network latency

      let simResponse = '';
      let simModel = 'simulation-v1';

      if (apiProvider === 'openai') {
        simResponse = `**[SIMULATION MODE: OpenAI Connected]**\n\n### Executive Summary\nAnalysis confirmed. The OpenAI GPT-4o pipeline is fully operational.\n\n**Data Processed:**\n- Protocol: JSON/REST\n- Encryption: TLS 1.3\n- Latency: 42ms\n\nNo issues detected in the integration layer.`;
        simModel = 'gpt-4o-sim';
      } else if (apiProvider === 'anthropic') {
        simResponse = `**[SIMULATION MODE: Claude Connected]**\n\n### Strategic Overview\nThe Anthropic integration is functioning correctly. Claude 3.5 Sonnet context window is active.\n\nEverything looks good on the backend logic.`;
        simModel = 'claude-3-5-sonnet-sim';
      } else if (apiProvider === 'gemini') {
        simResponse = `**[SIMULATION MODE: Gemini Connected]**\n\n**System Status:** ONLINE\n**Provider:** Google Vertex/AI Studio\n**Throughput:** Optimal\n\nThe Gemini PRO adapter is successfully handling requests.`;
        simModel = 'gemini-1.5-pro-sim';
      } else if (apiProvider === 'groq') {
        simResponse = `**[SIMULATION MODE: Groq Connected]**\n\n**Velocity:** HYPER-SPEED\n**LPU Status:** Active\n\nGroq Llama 3 integration is verified and ready for high-velocity inference.`;
        simModel = 'llama3-70b-sim';
      } else if (apiProvider === 'perplexity') {
        simResponse = `**[SIMULATION MODE: Perplexity Connected]**\n\n**Search Depth:** Deep\n**Citations:** Enabled (Simulated)\n\nPerplexity Sonar pipeline is correctly configured.`;
        simModel = 'sonar-large-sim';
      }

      // Add to conversation history to persist the "chat"
      if (FEATURES.ENABLE_CONVERSATION_HISTORY && options.sessionId) {
        conversationManager.addMessage(options.sessionId, 'assistant', simResponse);
      }

      return {
        success: true,
        mode: 'llm',
        timestamp: new Date().toISOString(),
        promptId: promptMetadata.id,
        output: { rawText: simResponse },
        metadata: {
          executionTime: '420ms',
          model: simModel,
          provider: apiProvider,
          status: 'SIMULATED',
          tokenEstimate: 120
        }
      };
    }
    // ============================================================================

    // NOVI KOD - Pripremi messages sa historijom
    let messages = [];

    // Feature Flag check for history
    if (FEATURES.ENABLE_CONVERSATION_HISTORY && options.sessionId) {
      const tierLimits = options.tier?.limits || { conversationHistory: true };
      messages = conversationManager.getMessagesForAI(options.sessionId, false, tierLimits);
    }

    // Dodaj trenutni prompt
    messages.push({ role: 'user', content: augmentedPrompt });

    // Spremi user poruku u conversation (ako history uključen)
    if (FEATURES.ENABLE_CONVERSATION_HISTORY && options.sessionId) {
      if (!conversationManager.hasConversation(options.sessionId)) {
        conversationManager.createConversation(options.sessionId, {
          promptId: promptMetadata.id
        });
      }
      conversationManager.addMessage(options.sessionId, 'user', augmentedPrompt);
    }

    if (apiProvider === 'anthropic') {
      const Anthropic = require('@anthropic-ai/sdk');
      const anthropic = new Anthropic({ apiKey });

      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        system: systemPrompt,
        messages: messages // Šalje kompletnu historiju
      });

      response = message.content[0].type === 'text' ? message.content[0].text : '';

      // Spremi AI odgovor u conversation
      if (FEATURES.ENABLE_CONVERSATION_HISTORY && options.sessionId) {
        conversationManager.addMessage(options.sessionId, 'assistant', response);
      }

      model = 'claude-3-5-sonnet';

    } else if (apiProvider === 'openai' || apiProvider === 'groq' || apiProvider === 'perplexity') {
      const OpenAI = require('openai');

      let baseURL = undefined;
      let modelName = 'gpt-4o'; // Default for OpenAI (Updated to GPT-4 Omni for better compatibility)

      if (apiProvider === 'groq') {
        baseURL = 'https://api.groq.com/openai/v1';
        modelName = 'llama3-70b-8192';
      } else if (apiProvider === 'perplexity') {
        baseURL = 'https://api.perplexity.ai';
        modelName = 'llama-3-sonar-large-32k-online';
      }

      const openai = new OpenAI({
        apiKey,
        baseURL
      });

      // Add system prompt to messages
      const openAiMessages = [
        { role: 'system', content: systemPrompt },
        ...messages
      ];

      const completion = await openai.chat.completions.create({
        model: modelName,
        messages: openAiMessages,
        max_tokens: 4096,
        temperature: 0.7
      });

      response = completion.choices[0].message.content;

      // Save AI response
      if (FEATURES.ENABLE_CONVERSATION_HISTORY && options.sessionId) {
        conversationManager.addMessage(options.sessionId, 'assistant', response);
      }

      model = modelName;

    } else if (apiProvider === 'gemini') {
      // Gemini Direct JSON API with Key Rotation
      const fetch = require('node-fetch');

      // Determine keys to use
      let keysToTry = options.apiKey ? [options.apiKey] : geminiKeyPool;
      if (!options.apiKey && keysToTry.length > 1) {
        keysToTry = keysToTry.sort(() => Math.random() - 0.5); // Shuffle
      }
      if (keysToTry.length === 0 && apiKey) keysToTry = [apiKey]; // Fallback to single key if pool empty

      let lastError = null;
      let success = false;

      for (const currentKey of keysToTry) {
        try {
          console.log(`[Gemini] Attempting generation with key ending in ...${currentKey.slice(-4)}`);
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${currentKey}`;

          const geminiContent = messages.map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
          }));

          const payload = {
            contents: geminiContent,
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: { maxOutputTokens: 8192, temperature: 0.7 }
          };

          const res = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          const data = await res.json();

          if (data.error) {
            if (data.error.code === 429 || data.error.message.includes('quota') || data.error.message.includes('exhausted')) {
              console.warn(`[Gemini] Quota exhausted for key ...${currentKey.slice(-4)}. Rotating...`);
              lastError = new Error(`Quota Exceeded: ${data.error.message}`);
              continue;
            }
            throw new Error(`Gemini API Error: ${data.error.message}`);
          }

          if (!data.candidates || !data.candidates[0].content) {
            if (data.candidates && data.candidates[0].finishReason === 'MAX_TOKENS') {
              console.warn('[Gemini] Response truncated (MAX_TOKENS).');
            } else {
              throw new Error('Gemini returned empty response');
            }
          }

          response = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
          if (!response && data.candidates?.[0]?.finishReason === 'MAX_TOKENS') {
            response = "[Response truncated due to token limit]";
          }

          model = 'gemini-1.5-pro';
          success = true;
          break;

        } catch (err) {
          console.warn(`[Gemini] Key failed: ${err.message}`);
          lastError = err;
        }
      }

      if (!success) throw lastError || new Error("All Gemini keys failed.");

      if (FEATURES.ENABLE_CONVERSATION_HISTORY && options.sessionId) {
        conversationManager.addMessage(options.sessionId, 'assistant', response);
      }

    } else if (apiProvider === 'ollama') {
      // Local Ollama for development/testing
      const fetch = require('node-fetch');

      const res = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: options.model || 'neural-chat',
          prompt: augmentedPrompt,
          stream: false
        })
      });

      const data = await res.json();
      response = data.response;
      model = options.model || 'neural-chat';

    } else {
      throw new Error(`Unsupported LLM provider: ${apiProvider}`);
    }

    // Parse structured output if possible
    let parsedOutput;
    try {
      // Look for JSON blocks
      const jsonMatch = response.match(/```json\n([\s\S]+?)\n```/);
      if (jsonMatch) {
        parsedOutput = JSON.parse(jsonMatch[1]);
      } else {
        parsedOutput = { rawText: response };
      }
    } catch (e) {
      parsedOutput = { rawText: response };
    }

    return {
      success: true,
      mode: 'llm',
      timestamp: new Date().toISOString(),
      promptId: promptMetadata.id,
      output: parsedOutput,
      metadata: {
        executionTime: (Date.now() - startTime) + 'ms',
        model,
        provider: apiProvider,
        status: 'SUCCESS',
        tokenEstimate: Math.ceil(response.split(/\s+/).length / 0.75) // Rough estimation
      }
    };

  } catch (error) {
    let finalMessage = error.message;

    // Enrich specific error types
    if (error.message.includes('Connection error')) {
      finalMessage = `Cloud Connection Error: The engine could not reach the ${apiProvider} API. This usually indicates a network restriction, proxy issue, or a temporary outage at the provider.`;
    } else if (error.status === 401) {
      finalMessage = `Authentication Failed: The provided ${apiProvider} API key is invalid or has expired.`;
    } else if (error.status === 429) {
      finalMessage = `Rate Limit Bound: Your ${apiProvider} account has reached its usage limit.`;
    }

    console.error('[RAG] LLM generation failed:', finalMessage);

    // Fallback to mock for demo purposes
    if (options.fallbackToMock) {
      console.log('[RAG] Falling back to mock mode');
      return generateMock(promptMetadata, startTime);
    }

    throw new Error(finalMessage);
  }
}

/**
 * Validate LLM response structure
 */
function validateResponse(response) {
  const issues = [];

  if (!response.output) {
    issues.push('Response missing output field');
  }

  if (!response.timestamp) {
    issues.push('Response missing timestamp');
  }

  if (!response.metadata) {
    issues.push('Response missing metadata');
  } else {
    if (!response.metadata.executionTime) {
      issues.push('Metadata missing executionTime');
    }
    if (!response.metadata.model) {
      issues.push('Metadata missing model information');
    }
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Compare mock vs LLM output structure
 */
function compareOutputFormats(mockOutput, llmOutput) {
  const comparison = {
    mockKeys: Object.keys(mockOutput),
    llmKeys: Object.keys(llmOutput),
    matching: [],
    missingInLLM: [],
    extraInLLM: []
  };

  // Check for matching keys
  comparison.mockKeys.forEach(key => {
    if (comparison.llmKeys.includes(key)) {
      comparison.matching.push(key);
    } else {
      comparison.missingInLLM.push(key);
    }
  });

  // Check for extra keys
  comparison.llmKeys.forEach(key => {
    if (!comparison.mockKeys.includes(key)) {
      comparison.extraInLLM.push(key);
    }
  });

  return comparison;
}

/**
 * Generate execution summary for UI display
 */
function generateExecutionSummary(response) {
  return {
    status: response.success ? 'SUCCESS' : 'FAILED',
    mode: response.mode,
    promptId: response.promptId,
    executedAt: response.timestamp,
    executionTime: response.metadata?.executionTime || 'Unknown',
    model: response.metadata?.model || 'Unknown',
    errorMessage: response.error || null,
    outputPreview: truncateOutput(response.output, 200)
  };
}

/**
 * Truncate output for preview
 */
function truncateOutput(output, maxLength = 200) {
  if (!output) return '(No output)';

  let text;
  if (typeof output === 'string') {
    text = output;
  } else if (typeof output === 'object') {
    text = JSON.stringify(output, null, 2);
  } else {
    text = String(output);
  }

  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '... (truncated)';
  }

  return text;
}

/**
 * Generate mock conversational response for follow-up questions
 */
function generateMockFollowUp(question, prompt, context) {
  const q = String(question).toLowerCase().trim();

  // 1. GREETINGS
  if (q === 'hello' || q === 'hi' || q === 'hey' || q.includes('greeting')) {
    return `<div style="padding: 1rem; background: #f8fafc; border-left: 4px solid #64748b; border-radius: 4px;">
      <strong style="color: #334155;">Executive Assistant:</strong><br><br>
        Greetings. I am ready to drill down into the EXEC-V1 diagnostic data. You can ask about:
        <ul style="margin-top: 0.5rem; margin-left: 1.5rem; list-style-type: square; color: #475569;">
          <li><strong>ROI & Financial Impact</strong></li>
          <li><strong>Automation Yield Targets</strong></li>
          <li><strong>Risk Factors & Infrastructure Decay</strong></li>
          <li><strong>Implementation Roadmap</strong></li>
        </ul>
      </div>`;
  }

  // 2. SPECIFIC TOPICS (Existing Logic)
  if (q.includes('automation yield') || q.includes('yield') || q.includes('coverage') || q.includes('84') || q.includes('12%')) {
    return `<div style="padding: 1rem; background: #f0f9ff; border-left: 4px solid #0ea5e9; border-radius: 4px;">
      <strong style="color: #0369a1;">Automation Yield Analysis:</strong><br><br>
        The current Automation Yield is operating at <strong>12% Coverage</strong>, which represents a significant opportunity gap identified in the <em>EXEC-V1</em> diagnostic.<br><br>
        By implementing the strategic protocol, we project this can trigger a rapid escalation to <strong>78% Coverage</strong> within 90 days. 
        This optimization typically drives an annual impact of <span style="color: #059669; font-weight: bold;">$84,000</span> through reduced manual processing overhead and error elimination.
      </div>`;
  }

  if (q.includes('roi') || q.includes('impact') || q.includes('return') || q.includes('value') || q.includes('money')) {
    return `<div style="padding: 1rem; background: #f0fdf4; border-left: 4px solid #22c55e; border-radius: 4px;">
      <strong style="color: #14532d;">ROI Projection:</strong><br><br>
        The strategic roadmap offers a blended annual impact of approximately <strong>$288,400</strong> across all levers.<br><br> 
        The primary driver is <strong>Operational Velocity ($142k)</strong>, followed by Automation Yield ($84k) and Resource Density ($62.4k).
      </div>`;
  }

  if (q.includes('risk') || q.includes('drift') || q.includes('infrastructure') || q.includes('decay')) {
    return `<div style="padding: 1rem; background: #fef2f2; border-left: 4px solid #ef4444; border-radius: 4px;">
      <strong style="color: #7f1d1d;">Risk Assessment:</strong><br><br>
        Current risk exposure is rated as <strong>Moderate</strong> given the 68% Infrastructure Decay observed in the <span style="font-family: monospace; background: #eee; padding: 2px 4px; border-radius: 3px;">SYSTEMIC DIAGNOSTIC</span>.<br><br> 
        Implementing the automated safeguards will transition this to a 'Minimized' state (Asset Shield protocol), 
        effectively eliminating 'Ghost Levers' that currently leak value.
      </div>`;
  }

  // 3. AFFIRMATIVE / NEXT STEPS (Responding to "Would you like to analyze...?")
  if (q === 'yes' || q.includes('sure') || q.includes('step') || q.includes('implementation') || q.includes('analyze') || q.includes('proceed')) {
    return `<div style="padding: 1rem; background: #eff6ff; border-left: 4px solid #2563eb; border-radius: 4px;">
      <strong style="color: #1e40af;">Phase 1: Data Terraforming & Implementation Steps</strong><br><br>
      To recapture the identified <strong>$142,000 leakage</strong>, the system recommends the following immediate actions:<br><br>
      <ol style="margin-left: 1.5rem; list-style-type: decimal; color: #1e3a8a;">
        <li style="margin-bottom: 0.5rem;"><strong>Stabilize Entry Points (Week 1):</strong> Deploy RAG-auditors on all manual data entry interfaces to arrest immediate error propagation (currently 18%).</li>
        <li style="margin-bottom: 0.5rem;"><strong>Bypass Legacy Approval Loops (Week 2):</strong> Auto-approve all Tier-3 decisions (<$5k value) to restore Operational Velocity.</li>
        <li><strong>Resource Re-indexing (Week 3):</strong> Shift liberated human capital to the Q4 Innovation Fund.</li>
      </ol>
      <br>
      <em>Status: Awaiting authorization. Shall we proceed with the resource allocation model?</em>
    </div>`;
  }

  // 4. RESOURCE ALLOCATION (Logical follow-up to Step 3)
  if (q.includes('resource') || q.includes('allocation') || q.includes('model')) {
    return `<div style="padding: 1rem; background: #fffbeb; border-left: 4px solid #d97706; border-radius: 4px;">
      <strong style="color: #92400e;">Resource Allocation Model (Optimized):</strong><br><br>
      Current analysis suggests shifting <strong>40% of manual load</strong> to the automated Asset Shield.<br><br>
      <strong>Proposed Distribution:</strong>
      <ul style="margin-left: 1.5rem; list-style-type: disc; color: #78350f; margin-top: 0.5rem;">
        <li><strong>Strategic Planning:</strong> <span style="color: #16a34a;">+15% Headcount</span> (Promoted from Operations)</li>
        <li><strong>Manual Auditing:</strong> <span style="color: #dc2626;">-60% Headcount</span> (Re-skilled / Re-assigned)</li>
        <li><strong>Innovation/R&D:</strong> <span style="color: #16a34a;">+45% Budget Allocation</span> (From recovered leakage)</li>
      </ul>
      <br>
      <em>This model optimizes for long-term scalability rather than short-term headcount reduction.</em>
    </div>`;
  }

  // 5. CATCH-ALL / UNKNOWN INPUT
  return `<div style="padding: 1rem; background: #f3f4f6; border-left: 4px solid #9ca3af; border-radius: 4px;">
    <strong>System Update:</strong><br><br>
    I processed your input: <em>"${question}"</em>.<br><br>
    I can provide deep-dive analysis on the following key vectors identified in the report:
    <ul style="margin-left: 1.5rem; list-style-type: square; margin-top: 0.5rem; color: #4b5563;">
      <li><strong>Economic Impact</strong> (ROI & Yield Calculations)</li>
      <li><strong>Risk Analysis</strong> (Infrastructure Decay & Drift)</li>
      <li><strong>Action Plan</strong> (Implementation Roadmap)</li>
    </ul>
    <br>Please select a vector to proceed or ask a specific question about the diagnostic data.
    </div>`;
}

module.exports = {
  generate,
  generateMock,
  generateLLM,
  validateResponse,
  compareOutputFormats,
  generateExecutionSummary,
  generateMockFollowUp
};
