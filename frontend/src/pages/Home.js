import React from 'react';
import { Link } from 'react-router-dom';
import { useUstav } from '../App';

const Home = () => {
  const { ustav, loading, error } = useUstav();

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!ustav) return null;

  return (
    <div>
      <h1 className="book-title">
        AI SOLVED
        <br />
        BUSINESS
        <br />
        PROBLEMS
      </h1>
      <div className="divider" />
      <p className="book-subtitle">
        50 Real-World Challenges from 10 Industries
        <br />
        A Manager's Workbook
      </p>
      <div className="divider" />
      <ul className="chapter-list">
        {ustav.chapters.map((chapter) => (
          <li key={chapter.id}>
            <Link to={`/chapter/${chapter.id}`}>
              {chapter.number}. {chapter.title}
            </Link>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: '4rem' }}>
        <p className="book-author">Davor Mulalić</p>
      </div>
    </div>
  );
};

export default Home;
