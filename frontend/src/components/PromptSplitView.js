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
      console.error('[PromptSplitView] Execution error:', err);
      setError(err.message || 'Execution failed');
    } finally {
      setLoading(false);
    }
  };

  // If inputSchema is missing, we still want a button at least
  const hasSchema = prompt.inputSchema?.properties && Object.keys(prompt.inputSchema.properties).length > 0;

  return (
    <div className="workbench-container">
      <div className="split-view">
        {/* Left Pane: The Intelligence Blueprint */}
        <div className="split-pane">
          <div className="pane-header">
            <span className="pane-title">Reference Blueprint</span>
            <span className={`status-badge ${prompt.severity?.toLowerCase() || 'low'}`}>
              Impact: {prompt.severity || 'Standard'}
            </span>
          </div>
          <div className="pane-content">
            <div className="prompt-display">
              {prompt.content || "No blueprint content available."}
            </div>
            <div style={{ marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              <strong>VERSION:</strong> {prompt.version || '1.0.0'} |
              <strong> PLATFORM:</strong> Universal LLM Compatibility
            </div>
          </div>
        </div>

        {/* Right Pane: Live Execution */}
        <div className="split-pane">
          <div className="pane-header">
            <span className="pane-title">Execution Console</span>
            <span className={`status-badge ${mode === 'llm' ? 'live' : 'mock'}`}>
              {mode === 'llm' ? 'Live LLM' : 'Mock Simulator'}
            </span>
          </div>
          <div className="pane-content">
            <form onSubmit={handleExecute} className="execution-form">
              <div className="input-group">
                <label>Processor Mode</label>
                <select value={mode} onChange={(e) => setMode(e.target.value)}>
                  <option value="mock">Simulation Mode (Deterministic)</option>
                  <option value="llm">Production Mode (Gemini/OpenAI)</option>
                </select>
              </div>

              {hasSchema ? (
                Object.entries(prompt.inputSchema.properties).map(([key, schema]) => (
                  <div key={key} className="input-group">
                    <label>{key} {prompt.inputSchema.required?.includes(key) && '*'}</label>
                    {schema.type === 'array' || key.toLowerCase().includes('data') || key.toLowerCase().includes('text') ? (
                      <textarea
                        name={key}
                        value={inputs[key] || ''}
                        onChange={handleInputChange}
                        placeholder={`Provide ${key}...`}
                        required={prompt.inputSchema.required?.includes(key)}
                      />
                    ) : (
                      <input
                        type={schema.type === 'number' ? 'number' : 'text'}
                        name={key}
                        value={inputs[key] || ''}
                        onChange={handleInputChange}
                        placeholder={`Enter ${key}`}
                        required={prompt.inputSchema.required?.includes(key)}
                      />
                    )}
                  </div>
                ))
              ) : (
                <div className="input-group">
                  <label>Problem Narrative / Context Data</label>
                  <textarea
                    name="context"
                    value={inputs.context || ''}
                    onChange={handleInputChange}
                    placeholder="Paste your specific business data or context here for extraction..."
                  />
                  <small className="text-muted">No specific schema defined for this prompt. You can provide general context.</small>
                </div>
              )}

              <button type="submit" className="execute-button" disabled={loading}>
                {loading ? (
                  <>Synthesizing Insight...</>
                ) : (
                  <>Run Execution Prompt</>
                )}
              </button>
            </form>

            {error && <div className="error-container" style={{ margin: '1.5rem 0' }}>{error}</div>}

            {output && (
              <div className="output-container">
                <div className="nav-label">Synthesis Result</div>
                <div className="output-box">
                  {output.html ? (
                    <div dangerouslySetInnerHTML={{ __html: output.html }} />
                  ) : (
                    <pre>{JSON.stringify(output, null, 2)}</pre>
                  )}
                </div>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    className="nav-link active"
                    style={{ display: 'inline-block', border: 'none', cursor: 'pointer', padding: '8px 16px', borderRadius: '6px' }}
                    onClick={() => {
                      const textToCopy = output.html || JSON.stringify(output, null, 2);
                      navigator.clipboard.writeText(textToCopy);
                      alert('Copied to clipboard!');
                    }}
                  >
                    📋 Copy Result
                  </button>
                  {output.html && (
                    <button
                      className="nav-link"
                      style={{ display: 'inline-block', border: 'none', cursor: 'pointer', padding: '8px 16px', borderRadius: '6px', background: '#6b7280' }}
                      onClick={() => {
                        const jsonView = document.querySelector('.output-box pre');
                        const htmlView = document.querySelector('.output-box > div');
                        if (jsonView) {
                          jsonView.style.display = jsonView.style.display === 'none' ? 'block' : 'none';
                          htmlView.style.display = htmlView.style.display === 'none' ? 'block' : 'none';
                        }
                      }}
                    >
                      🔄 Toggle View
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptSplitView;
