const { retrieve, generate } = require('../backend/rag/index');

const mockUstav = {
  chapters: [
    {
      id: 'ch1',
      title: 'Financial Services',
      problems: [
        {
          id: 'p1',
          title: 'Credit Risk Assessment',
          narrative: 'Test narrative',
          roi: '$2.3M annually',
          prompts: [
            {
              id: 'pr1',
              title: 'Risk Scorer',
              code: 'Score risk',
              mockOutput: { riskScore: 6.2, recommendation: 'APPROVE' },
              inputSchema: {
                type: 'object',
                properties: {
                  creditScore: { type: 'number' },
                },
              },
            },
          ],
        },
      ],
    },
  ],
  mockOutputExamples: {},
};

describe('RAG System', () => {
  describe('Retrieve', () => {
    test('should retrieve prompt with context', () => {
      const result = retrieve('pr1', mockUstav);

      expect(result).toBeDefined();
      expect(result.prompt.id).toBe('pr1');
      expect(result.problem.id).toBe('p1');
      expect(result.chapter.id).toBe('ch1');
    });

    test('should throw error for non-existent prompt', () => {
      expect(() => {
        retrieve('pr_nonexistent', mockUstav);
      }).toThrow('Prompt pr_nonexistent not found');
    });
  });

  describe('Generate', () => {
    test('should generate mock output by default', async () => {
      const result = await generate('pr1', { creditScore: 750 }, 'mock', mockUstav);

      expect(result).toBeDefined();
      expect(result.mode).toBe('mock');
      expect(result.output).toBeDefined();
      expect(result.output.riskScore).toBe(6.2);
    });

    test('should include prompt ID in result', async () => {
      const result = await generate('pr1', {}, 'mock', mockUstav);

      expect(result.promptId).toBe('pr1');
      expect(result.timestamp).toBeDefined();
    });

    test('should fall back to mock if LLM API unavailable', async () => {
      const result = await generate('pr1', {}, 'llm', mockUstav);

      expect(result.mode).toBeDefined();
      expect(result.output).toBeDefined();
    });

    test('should throw error for non-existent prompt', async () => {
      try {
        await generate('pr_nonexistent', {}, 'mock', mockUstav);
        fail('Should have thrown error');
      } catch (err) {
        expect(err.message).toContain('not found');
      }
    });
  });
});
