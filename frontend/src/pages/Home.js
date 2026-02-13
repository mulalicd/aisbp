import React from 'react';
import { Link } from 'react-router-dom';
import { useUstav } from '../App';

function Home() {
  const { ustav, loading, error } = useUstav();

  if (loading) return <div className="loading-container">Loading book contents...</div>;
  if (error) return <div className="error-container">Error: {error}</div>;

  const chapters = ustav?.chapters || [];

  return (
    <div className="home-dashboard">
      <header className="dashboard-header">
        <h1 className="problem-main-title">Workbook Dashboard</h1>
        <p className="dashboard-subtitle">50 Real-World Challenges from 10 Strategic Industries</p>
      </header>

      <div className="dashboard-stats-grid">
        <div className="sidebar-card">
          <div className="metric-label">Total Chapters</div>
          <div className="metric-value" style={{ fontSize: '2rem' }}>{chapters.length}</div>
        </div>
        <div className="sidebar-card">
          <div className="metric-label">Total Problems</div>
          <div className="metric-value" style={{ fontSize: '2rem' }}>
            {chapters.reduce((acc, ch) => acc + (ch.problems?.length || 0), 0)}
          </div>
        </div>
        <div className="sidebar-card">
          <div className="metric-label">Target Implementation ROI</div>
          <div className="metric-value highlight-gain" style={{ fontSize: '2rem' }}>$22M+</div>
        </div>
      </div>

      <section className="chapters-selection-grid">
        <h2 className="section-title">Strategic Domains</h2>
        <div className="chapters-list-modern">
          {chapters.map((chapter) => (
            <Link key={chapter.id} to={`/chapter/${chapter.id}`} className="chapter-luxury-card">
              <div className="chapter-card-meta">Chapter {chapter.number}</div>
              <h3 className="chapter-card-title">{chapter.title}</h3>
              <p className="chapter-card-intro">{chapter.subtitle || 'Executive exploration of AI impact within this domain.'}</p>
              <div className="chapter-card-footer">
                <span>{chapter.problems?.length || 0} Problems</span>
                <span className="arrow">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="consulting-footer-banner">
        <span>For specialized implementation support or executive consulting:</span>
        <a href="https://mulalic.ai-studio.wiki" target="_blank" rel="noreferrer" className="highlight-red">mulalic.ai-studio.wiki</a>
      </div>
    </div>
  );
}

export default Home;
