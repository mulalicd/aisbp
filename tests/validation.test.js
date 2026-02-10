const { buildPromptSchemas, validateInput } = require('../backend/validation/schemas');

// Mock USTAV data for testing
const mockUstav = {
  chapters: [
    {
      id: 'ch1',
      title: 'Test Chapter',
      problems: [
        {
          id: 'p1',
          title: 'Test Problem',
          prompts: [
            {
              id: 'pr1',
              title: 'Test Prompt',
              inputSchema: {
                type: 'object',
                properties: {
                  amount: { type: 'number', min: 0, max: 1000000 },
                  name: { type: 'string' },
                  country: { type: 'string', enum: ['USA', 'UK', 'Canada'] },
                },
                required: ['amount', 'name'],
              },
            },
          ],
        },
      ],
    },
  ],
};

describe('Validation Schemas', () => {
  let schemas;

  beforeEach(() => {
    schemas = buildPromptSchemas(mockUstav);
  });

  test('should build schemas for all prompts', () => {
    expect(Object.keys(schemas).length).toBeGreaterThan(0);
    expect(schemas['pr1']).toBeDefined();
  });

  test('should validate correct input', () => {
    const result = validateInput('pr1', {
      amount: 500,
      name: 'John Doe',
      country: 'USA',
    }, schemas);

    expect(result.valid).toBe(true);
  });

  test('should reject invalid input (missing required field)', () => {
    const result = validateInput('pr1', {
      amount: 500,
    }, schemas);

    expect(result.valid).toBe(false);
    expect(result.error).toContain('name');
  });

  test('should reject invalid input (out of range)', () => {
    const result = validateInput('pr1', {
      amount: 2000000,
      name: 'John Doe',
    }, schemas);

    expect(result.valid).toBe(false);
    expect(result.error).toContain('amount');
  });

  test('should reject invalid enum value', () => {
    const result = validateInput('pr1', {
      amount: 500,
      name: 'John Doe',
      country: 'France',
    }, schemas);

    expect(result.valid).toBe(false);
    expect(result.error).toContain('country');
  });

  test('should accept valid input with optional field', () => {
    const result = validateInput('pr1', {
      amount: 500,
      name: 'John Doe',
    }, schemas);

    expect(result.valid).toBe(true);
  });
});
