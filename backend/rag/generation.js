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
  const startTime = Date.now();

  try {
    if (mode === 'mock') {
      return generateMock(promptMetadata, startTime);
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
function generateMock(promptMetadata, startTime) {
  // Generate realistic, formatted output based on prompt type
  const mockOutput = generateRealisticMockOutput(promptMetadata);

  return {
    success: true,
    mode: 'mock',
    timestamp: new Date().toISOString(),
    promptId: promptMetadata.id,
    output: mockOutput,
    metadata: {
      executionTime: (Date.now() - startTime) + 'ms',
      model: 'Mock Deterministic Generator v2.0',
      status: 'SUCCESS',
      note: 'This is simulated output. Switch to "Production Mode" for real AI analysis.'
    }
  };
}

/**
 * Generate realistic mock output based on prompt context
 */
function generateRealisticMockOutput(prompt) {
  const title = prompt.title || 'Analysis';
  const content = (prompt.content || '') + (prompt.promptCode || ''); // Check full content for context
  const severity = prompt.severity || 'HIGH';

  // Advanced Context Detection
  const isFreightAudit = /freight|invoice|audit|carrier|logistics|shipping/i.test(content);
  const isContractReview = /clause|agreement|liability|indemnification|legal/i.test(content);
  const isMarketResearch = /market|competitor|trend|cagr|forecast/i.test(content);
  const isCodeReview = /code|function|bug|complexity|refactor/i.test(content);

  // Common Style for all reports
  const containerStyle = "font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #1f2937; line-height: 1.6;";
  const headerStyle = "background: linear-gradient(to right, #2563eb, #1e40af); color: white; padding: 24px; border-radius: 8px 8px 0 0; margin-bottom: 24px;";
  const cardStyle = "background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);";
  const tableStyle = "width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;";
  const thStyle = "text-align: left; padding: 12px; background: #f9fafb; border-bottom: 2px solid #e5e7eb; color: #4b5563; font-weight: 600;";
  const tdStyle = "padding: 12px; border-bottom: 1px solid #e5e7eb; color: #374151;";

  let bodyHtml = '';
  let summaryText = '';

  // --- SCENARIO 1: FREIGHT AUDIT & RECOVERY (Chapter 1) ---
  if (isFreightAudit) {
    summaryText = "Audit Complete: Identified $14,280 in recoverable overcharges across 3 carriers.";

    bodyHtml = `
      <div style="${cardStyle}">
        <h2 style="color: #dc2626; margin-top: 0; display: flex; align-items: center; gap: 8px;">
          <span>🚨</span> Executive Recovery Summary
        </h2>
        <p style="font-size: 16px; margin-bottom: 16px;">
          <strong>Audit Scope:</strong> 1,240 Invoice Line Items | <strong>Period:</strong> Q4 2025<br>
          <strong>Status:</strong> <span style="color: #dc2626; font-weight: bold;">CRITICAL ANOMALIES DETECTED</span>
        </p>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; background: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626;">
          <div>
            <div style="font-size: 12px; color: #991b1b; text-transform: uppercase; font-weight: 600;">Total Audited</div>
            <div style="font-size: 24px; font-weight: 700; color: #7f1d1d;">$342,850</div>
          </div>
          <div>
            <div style="font-size: 12px; color: #991b1b; text-transform: uppercase; font-weight: 600;">Recoverable</div>
            <div style="font-size: 24px; font-weight: 700; color: #dc2626;">$14,280</div>
          </div>
          <div>
            <div style="font-size: 12px; color: #991b1b; text-transform: uppercase; font-weight: 600;">Error Rate</div>
            <div style="font-size: 24px; font-weight: 700; color: #7f1d1d;">4.16%</div>
          </div>
          <div>
            <div style="font-size: 12px; color: #991b1b; text-transform: uppercase; font-weight: 600;">ROI</div>
            <div style="font-size: 24px; font-weight: 700; color: #059669;">12.5x</div>
          </div>
        </div>
      </div>

      <div style="${cardStyle}">
        <h3 style="margin-top: 0; color: #111827;">📊 Detailed Dispute Log (High Priority)</h3>
        <p style="font-size: 14px; color: #6b7280; margin-bottom: 12px;">Top 5 detected variances requiring immediate action:</p>
        <div style="overflow-x: auto;">
          <table style="${tableStyle}">
            <thead>
              <tr>
                <th style="${thStyle}">Invoice ID</th>
                <th style="${thStyle}">Carrier</th>
                <th style="${thStyle}">Issue Type</th>
                <th style="${thStyle}">Contract Rate</th>
                <th style="${thStyle}">Billed</th>
                <th style="${thStyle}">Variance</th>
                <th style="${thStyle}">Confidence</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="${tdStyle} font-family: monospace;">INV-99283</td>
                <td style="${tdStyle} font-weight: 600;">FedEx Freight</td>
                <td style="${tdStyle}"><span style="background: #fee2e2; color: #991b1b; padding: 2px 8px; border-radius: 12px; font-size: 12px;">Reclass (50->70)</span></td>
                <td style="${tdStyle}">$450.00</td>
                <td style="${tdStyle}">$820.50</td>
                <td style="${tdStyle} color: #dc2626; font-weight: 700;">+$370.50</td>
                <td style="${tdStyle}">98%</td>
              </tr>
              <tr>
                <td style="${tdStyle} font-family: monospace;">ODFL-2210</td>
                <td style="${tdStyle} font-weight: 600;">Old Dominion</td>
                <td style="${tdStyle}"><span style="background: #ffedd5; color: #9a3412; padding: 2px 8px; border-radius: 12px; font-size: 12px;">Detention</span></td>
                <td style="${tdStyle}">$0.00 (Grace)</td>
                <td style="${tdStyle}">$150.00</td>
                <td style="${tdStyle} color: #dc2626; font-weight: 700;">+$150.00</td>
                <td style="${tdStyle}">92%</td>
              </tr>
              <tr>
                <td style="${tdStyle} font-family: monospace;">XPO-7741</td>
                <td style="${tdStyle} font-weight: 600;">XPO Logistics</td>
                <td style="${tdStyle}"><span style="background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 12px; font-size: 12px;">Fuel Surcharge</span></td>
                <td style="${tdStyle}">18.5%</td>
                <td style="${tdStyle}">22.0%</td>
                <td style="${tdStyle} color: #dc2626; font-weight: 700;">+$84.25</td>
                <td style="${tdStyle}">99%</td>
              </tr>
              <tr>
                <td style="${tdStyle} font-family: monospace;">INV-99401</td>
                <td style="${tdStyle} font-weight: 600;">FedEx Freight</td>
                <td style="${tdStyle}"><span style="background: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 12px; font-size: 12px;">Duplicate</span></td>
                <td style="${tdStyle}">already paid</td>
                <td style="${tdStyle}">$1,240.00</td>
                <td style="${tdStyle} color: #dc2626; font-weight: 700;">+$1,240.00</td>
                <td style="${tdStyle}">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style="${cardStyle}">
        <h3 style="margin-top: 0; color: #111827;">📝 Action Plan: Automating the Dispute</h3>
        <p style="margin-bottom: 16px;">Copy and paste the following communication to your FedEx account representative.</p>
        
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px; font-family: 'Courier New', monospace; font-size: 13px; color: #334155;">
          <strong>Subject:</strong> Urgent: Discrepancy Notice for Invoice INV-99283 & INV-99401 - Contract Violation<br><br>
          Dear Account Team,<br><br>
          Our automated audit system has flagged specific line items that violate the terms of our Master Service Agreement (MSA-2024-Q1). Please review the following discrepancies:<br><br>
          1. <strong>INV-99283:</strong> Shipment was reclassified from Class 50 to Class 70 without a valid W&I certificate attached. As per Clause 4.2, reclassifications require photographic proof. <em>Overcharge: $370.50.</em><br><br>
          2. <strong>INV-99401:</strong> This is a duplicate billing for tracking #77482910, previously paid on Invoice INV-98100.<br><br>
          Please issue a corrected invoice or credit note for the total amount of <strong>$1,610.50</strong> within 5 business days.<br><br>
          Regards,<br>
          [Your Name]<br>
          Logistics Audit Team
        </div>
        <div style="margin-top: 12px; text-align: right;">
          <button style="background: white; border: 1px solid #d1d5db; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; color: #374151; cursor: pointer;">📋 Copy Email Draft</button>
        </div>
      </div>
    `;

    // --- SCENARIO 2: LEGAL CONTRACT REVIEW ---
  } else if (isContractReview) {
    summaryText = "Risk Analysis: Found 3 critical liability loopholes in the proposed agreement.";
    bodyHtml = `
      <div style="${cardStyle}">
        <h2 style="color: #ea580c; margin-top: 0;">⚖️ Legal Risk Assessment</h2>
        <div style="display: flex; gap: 12px; margin-bottom: 20px;">
           <span style="background: #ffedd5; color: #9a3412; padding: 4px 12px; border-radius: 16px; font-weight: 600; font-size: 12px;">Risk Score: HIGH (8/10)</span>
           <span style="background: #f3f4f6; color: #4b5563; padding: 4px 12px; border-radius: 16px; font-weight: 600; font-size: 12px;">Jurisdiction: NY Information Law</span>
        </div>
        <p>The proposed <strong>Indemnification Clause (Section 12.3)</strong> is aggressively one-sided and exposes your company to unlimited liability for third-party IP claims. This deviates from standard market practice.</p>
      </div>
      
      <div style="${cardStyle}">
        <h3>🚩 Critical Red Flags</h3>
        <ul style="list-style: none; padding: 0;">
          <li style="padding: 12px; border-left: 4px solid #dc2626; background: #fef2f2; margin-bottom: 12px;">
            <strong>1. Uncapped Liability:</strong> "Customer shall indemnify Vendor for <em>any and all</em> claims..." <br>
            <span style="font-size: 13px; color: #991b1b;">Recommendation: Cap liability at 12 months fees paid.</span>
          </li>
          <li style="padding: 12px; border-left: 4px solid #f59e0b; background: #fffbeb; margin-bottom: 12px;">
            <strong>2. Auto-Renewal Trap:</strong> Section 5.1 requires 90-day written notice to terminate.<br>
            <span style="font-size: 13px; color: #92400e;">Recommendation: Change to 30 days.</span>
          </li>
        </ul>
      </div>
    `;

    // --- SCENARIO 3: GENERIC HIGH QUALITY FALLBACK ---
  } else {
    summaryText = "Analysis complete. Generated strategic insights and actionable recommendations.";
    bodyHtml = `
      <div style="${cardStyle}">
        <h2 style="margin-top: 0; color: #111827;">📋 Strategic Analysis & Insights</h2>
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0;"><strong>Context:</strong> Deep analysis of the provided input data against industry benchmarks (v2025.1).</p>
        </div>
        
        <h3>Key Findings</h3>
        <ul style="margin-bottom: 24px; padding-left: 20px; color: #374151;">
          <li style="margin-bottom: 12px;"><strong>Optimization Potential:</strong> Identified a process bottleneck reducing throughput by 14%.</li>
          <li style="margin-bottom: 12px;"><strong>Cost Driver:</strong> Tertiary dependencies account for 22% of current expenditure.</li>
          <li><strong>Risk Factor:</strong> Single point of failure detected in the supply/data chain.</li>
        </ul>

        <h3>Recommended Action Matrix</h3>
        <table style="${tableStyle}">
          <thead>
            <tr>
              <th style="${thStyle}">Initiative</th>
              <th style="${thStyle}">Impact</th>
              <th style="${thStyle}">Effort</th>
              <th style="${thStyle}">Timeline</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="${tdStyle}"><strong>Process Automation</strong></td>
              <td style="${tdStyle} color: #059669; font-weight: 600;">High</td>
              <td style="${tdStyle}">Medium</td>
              <td style="${tdStyle}">30 Days</td>
            </tr>
            <tr>
              <td style="${tdStyle}"><strong>Vendor Consolidation</strong></td>
              <td style="${tdStyle} color: #059669; font-weight: 600;">Medium</td>
              <td style="${tdStyle}">High</td>
              <td style="${tdStyle}">90 Days</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  // Combine into final HTML
  const finalHtml = `
    <div style="${containerStyle}">
      <div style="${headerStyle}">
        <h1 style="margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.025em;">${title} Result</h1>
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 8px;">
          <p style="margin: 0; opacity: 0.9; font-size: 14px;">Powered by AISBS RAG Engine</p>
          <div style="background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
            ${new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
      
      <div style="padding: 0 4px;">
        ${bodyHtml}
        
        <div style="text-align: center; margin-top: 32px; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 24px;">
          Generated by AISBS Platform • Sensitivity: ${severity} • Mode: Simulation
        </div>
      </div>
    </div>
  `;

  return {
    html: finalHtml,
    summary: summaryText,
    format: 'html',
    type: isFreightAudit ? 'audit' : 'analysis'
  };
}

/**
 * Generate using LLM API
 */
async function generateLLM(augmentedPrompt, promptMetadata, startTime, options = {}) {
  const apiProvider = options.provider || process.env.LLM_PROVIDER || 'anthropic';
  const apiKey = options.apiKey || process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error(`No API key provided for ${apiProvider}. Set ${apiProvider.toUpperCase()}_API_KEY environment variable.`);
  }

  let response;
  let model;

  try {
    if (apiProvider === 'anthropic') {
      const Anthropic = require('@anthropic-ai/sdk');
      const anthropic = new Anthropic({ apiKey });

      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: augmentedPrompt
        }]
      });

      response = message.content[0].type === 'text' ? message.content[0].text : '';
      model = 'claude-3-5-sonnet';

    } else if (apiProvider === 'openai') {
      const OpenAI = require('openai');
      const openai = new OpenAI({ apiKey });

      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [{
          role: 'user',
          content: augmentedPrompt
        }],
        max_tokens: 4096,
        temperature: 0.7
      });

      response = completion.choices[0].message.content;
      model = 'gpt-4-turbo';

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
    console.error('[RAG] LLM generation failed:', error.message);

    // Fallback to mock for demo purposes
    if (options.fallbackToMock) {
      console.log('[RAG] Falling back to mock mode');
      return generateMock(promptMetadata, startTime);
    }

    throw error;
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

module.exports = {
  generate,
  generateMock,
  generateLLM,
  validateResponse,
  compareOutputFormats,
  generateExecutionSummary
};
