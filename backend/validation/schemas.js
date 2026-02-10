const Joi = require('joi');
const _ = require('lodash');

/**
 * Build Joi schemas from prompt input specs
 */
const buildPromptSchemas = (ustav) => {
  const schemas = {};

  for (const chapter of ustav.chapters) {
    for (const problem of chapter.problems) {
      // Skip problems that don't have prompts defined
      if (!Array.isArray(problem.prompts)) {
        continue;
      }
      for (const prompt of problem.prompts) {
        if (prompt.inputSchema) {
          const joiSchema = Joi.object(
            _.mapValues(prompt.inputSchema.properties, (prop) => {
              let schema;

              if (prop.type === 'string') {
                schema = Joi.string();
              } else if (prop.type === 'number') {
                schema = Joi.number();
                if (prop.min !== undefined) schema = schema.min(prop.min);
                if (prop.max !== undefined) schema = schema.max(prop.max);
              } else if (prop.type === 'boolean') {
                schema = Joi.boolean();
              } else if (prop.type === 'array') {
                schema = Joi.array();
              } else {
                schema = Joi.any();
              }

              if (prop.enum) {
                schema = schema.valid(...prop.enum);
              }

              return schema;
            })
          ).unknown(true);

          schemas[prompt.id] = joiSchema;
        }
      }
    }
  }

  return schemas;
};

/**
 * Validate user input against prompt schema
 */
const validateInput = (promptId, inputs, schemas) => {
  const schema = schemas[promptId];

  if (!schema) {
    return { valid: true, value: inputs }; // No schema = accept all
  }

  const { error, value } = schema.validate(inputs, { abortEarly: false });

  if (error) {
    const messages = error.details.map((detail) => detail.message).join('; ');
    return { valid: false, error: messages };
  }

  return { valid: true, value };
};

module.exports = {
  buildPromptSchemas,
  validateInput,
};
