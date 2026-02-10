import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useUstav } from '../App';
import Breadcrumbs from '../components/Breadcrumbs';
import PromptSplitView from '../components/PromptSplitView';

const PromptExecution = () => {
  const { chapterId, problemId, promptId } = useParams();
  const { ustav, loading: ustavLoading, error: ustavError } = useUstav();
  const [output, setOutput] = useState(null);

  if (ustavLoading) return <div className="loading">Loading...</div>;
  if (ustavError) return <div className="error">Error: {ustavError}</div>;
  if (!ustav) return null;

  const chapter = ustav.chapters.find((ch) => ch.id === chapterId);
  if (!chapter) return <div className="error">Chapter not found</div>;

  const problem = chapter.problems.find((p) => p.id === problemId);
  if (!problem) return <div className="error">Problem not found</div>;

  const prompt = problem.prompts.find((pr) => pr.id === promptId);
  if (!prompt) return <div className="error">Prompt not found</div>;

  const handleExecute = async (inputs, mode) => {
    try {
      const response = await axios.post('/api/execute', {
        promptId,
        userData: inputs,
        mode,
      });
      setOutput(response.data);
      return response.data.output;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  };

  const breadcrumbItems = [
    { label: chapter.title, link: `/chapter/${chapterId}` },
    { label: `Problem ${problem.number}`, link: `/chapter/${chapterId}/problem/${problemId}` },
    { label: prompt.title, link: null },
  ];

  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />
      <h2 className="book-title" style={{ fontSize: '1.8vw', marginBottom: '1rem' }}>
        {prompt.title}
      </h2>
      <div className="divider" />
      <p style={{ fontSize: '1vw', color: '#666', marginBottom: '1.5rem' }}>
        Problem {problem.number}.{problem.number} in {chapter.title}
      </p>
      <PromptSplitView prompt={prompt} onExecute={handleExecute} />
    </div>
  );
};

export default PromptExecution;
