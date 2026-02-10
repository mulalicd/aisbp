import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUstav } from '../App';
import Breadcrumbs from '../components/Breadcrumbs';

const ProblemView = () => {
  const { chapterId, problemId } = useParams();
  const { ustav, loading, error } = useUstav();
  const navigate = useNavigate();

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!ustav) return null;

  const chapter = ustav.chapters.find((ch) => ch.id === chapterId);
  if (!chapter) return <div className="error">Chapter not found</div>;

  const problem = chapter.problems.find((p) => p.id === problemId);
  if (!problem) return <div className="error">Problem not found</div>;

  const breadcrumbItems = [
    { label: chapter.title, link: `/chapter/${chapterId}` },
    { label: `Problem ${problem.number}`, link: null },
  ];

  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />
      <h2 className="book-title" style={{ fontSize: '2vw', marginBottom: '1rem' }}>
        Problem {problem.number}: {problem.title}
      </h2>
      <div className="divider" />

      <div className="problem-section">
        <h3 className="problem-section-title">Narrative</h3>
        <p>{problem.narrative}</p>
      </div>

      <div className="problem-section">
        <h3 className="problem-section-title">Workflow</h3>
        <p>{problem.workflow}</p>
      </div>

      <div className="problem-section">
        <h3 className="problem-section-title">Business Case</h3>
        <p>{problem.businessCase}</p>
      </div>

      <div className="problem-section">
        <h3 className="problem-section-title">Failure Modes</h3>
        <ul style={{ marginLeft: '1.5rem' }}>
          {problem.failureModes.map((mode, index) => (
            <li key={index} style={{ marginBottom: '0.5rem' }}>
              {mode}
            </li>
          ))}
        </ul>
      </div>

      <div className="problem-section">
        <h3 className="problem-section-title">ROI & Business Impact</h3>
        <p>{problem.roi}</p>
      </div>

      <div className="divider" style={{ marginTop: '3rem' }} />

      <h3 className="problem-section-title">Prompts & Execution</h3>
      {problem.prompts.length > 0 ? (
        <ul className="prompt-list">
          {problem.prompts.map((prompt) => (
            <li
              key={prompt.id}
              className="prompt-item"
              onClick={() => navigate(`/chapter/${chapterId}/problem/${problemId}/prompt/${prompt.id}`)}
            >
              <h4>{prompt.title}</h4>
              <p style={{ marginTop: '0.5rem', fontSize: '0.9vw', color: '#666' }}>
                Click to execute prompt →
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: '#999' }}>No prompts available for this problem yet.</p>
      )}
    </div>
  );
};

export default ProblemView;
