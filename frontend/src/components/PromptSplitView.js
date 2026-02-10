import React, { useState } from 'react';

const PromptSplitView = ({ prompt, onExecute }) => {
  const [inputs, setInputs] = useState({});
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('mock');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExecute = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOutput(null);

    try {
      const result = await onExecute(inputs, mode);
      setOutput(result);
    } catch (err) {
      setError(err.message || 'Execution failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-view">
      {/* Left Pane: Prompt */}
      <div className="split-pane split-pane-left">
        <h3>{prompt.title}</h3>
        <div className="divider" />
        <pre>{prompt.code}</pre>
      </div>

      {/* Right Pane: Input & Output */}
      <div className="split-pane split-pane-right">
        <h3>Execution</h3>
        <div className="divider" />

        <form onSubmit={handleExecute}>
          <div className="input-group">
            <label>Mode</label>
            <select value={mode} onChange={(e) => setMode(e.target.value)}>
              <option value="mock">Mock (Deterministic)</option>
              <option value="llm">LLM (if available)</option>
            </select>
          </div>

          {prompt.inputSchema?.properties &&
            Object.entries(prompt.inputSchema.properties).map(([key, schema]) => (
              <div key={key} className="input-group">
                <label>{key}</label>
                {schema.type === 'array' ? (
                  <textarea
                    name={key}
                    value={inputs[key] || ''}
                    onChange={handleInputChange}
                    placeholder={`Enter JSON array for ${key}`}
                  />
                ) : (
                  <input
                    type={schema.type === 'number' ? 'number' : 'text'}
                    name={key}
                    value={inputs[key] || ''}
                    onChange={handleInputChange}
                    placeholder={key}
                    required={prompt.inputSchema.required?.includes(key)}
                  />
                )}
              </div>
            ))}

          <button type="submit" disabled={loading}>
            {loading ? 'Executing...' : 'Execute'}
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        {output && (
          <div style={{ marginTop: '1.5rem' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Output</h4>
            <div className="output-box">
              <pre>{JSON.stringify(output, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptSplitView;
