const _ = require('lodash');

/**
 * RAG Retrieval: Fetch prompt + related USTAV sections
 */
const retrieve = (promptId, ustav) => {
  let foundPrompt = null;

  // Search through all chapters/problems for the prompt
  for (const chapter of ustav.chapters) {
    for (const problem of chapter.problems) {
      const prompt = problem.prompts.find((p) => p.id === promptId);
      if (prompt) {
        foundPrompt = {
          prompt,
          problem,
          chapter,
        };
        break;
      }
    }
    if (foundPrompt) break;
  }

  if (!foundPrompt) {
    throw new Error(`Prompt ${promptId} not found in USTAV`);
  }

  return foundPrompt;
};

/**
 * RAG Augmentation: Combine prompt template with user data
 */
const augment = (promptTemplate, userData, context) => {
  // Template string substitution with context
  const augmentedPrompt = `
PROMPT:
${promptTemplate}

CONTEXT:
Chapter: ${context.chapter.title}
Problem: ${context.problem.title}

USER DATA:
${JSON.stringify(userData, null, 2)}

RELATED CONTENT:
- Narrative: ${context.problem.narrative.substring(0, 200)}...
- ROI/Impact: ${context.problem.roi}
`;

  return augmentedPrompt;
};

/**
 * RAG Generation: Deterministic output (mock by default, LLM optional)
 */
const generate = async (promptId, userData, mode, ustav) => {
  const { prompt, problem, chapter } = retrieve(promptId, ustav);

  // Default mock output
  let result = {
    promptId,
    mode: 'mock',
    timestamp: new Date().toISOString(),
    output: prompt.mockOutput || { message: 'Default mock output', data: userData },
  };

  // Optional LLM mode
  if (mode === 'llm') {
    const apiKey = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      console.warn('LLM mode requested but no API key configured. Falling back to mock.');
      return result;
    }

    try {
      // Example: Call external LLM API (mocked here)
      // In production, integrate Claude/OpenAI API
      result.mode = 'llm';
      result.output = {
        ...prompt.mockOutput,
        note: 'LLM generation would occur here with actual API integration',
      };
    } catch (err) {
      console.error('LLM API call failed:', err.message);
      console.warn('Falling back to mock output');
    }
  }

  return result;
};

module.exports = {
  retrieve,
  augment,
  generate,
};
