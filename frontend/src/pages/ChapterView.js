import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUstav } from '../App';
import Breadcrumbs from '../components/Breadcrumbs';

const ChapterView = () => {
  const { chapterId } = useParams();
  const { ustav, loading, error } = useUstav();
  const navigate = useNavigate();

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!ustav) return null;

  const chapter = ustav.chapters.find((ch) => ch.id === chapterId);

  if (!chapter) return <div className="error">Chapter not found</div>;

  const breadcrumbItems = [
    { label: chapter.title, link: null },
  ];

  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />
      <h2 className="book-title" style={{ fontSize: '2.5vw', marginBottom: '1rem' }}>
        Chapter {chapter.number}: {chapter.title}
      </h2>
      <div className="divider" />
      <p style={{ fontSize: '1vw', lineHeight: '1.8', marginBottom: '2rem' }}>
        {chapter.intro}
      </p>
      <div className="divider" />
      <h3 style={{ fontSize: '1.3vw', fontWeight: '700', marginBottom: '1.5rem' }}>
        Problems in This Chapter
      </h3>
      <ul className="problem-list">
        {chapter.problems.map((problem) => (
          <li key={problem.id}>
            <a
              href="/#"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/chapter/${chapterId}/problem/${problem.id}`);
              }}
            >
              {problem.number}. {problem.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChapterView;
