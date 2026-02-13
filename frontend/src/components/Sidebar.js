import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useUstav } from '../App';

const Sidebar = () => {
  const { ustav, loading } = useUstav();

  return (
    <aside className="sidebar">
      <Link to="/" className="sidebar-logo">
        AI SOLVED<br />BUSINESS<br />PROBLEMS
      </Link>

      <nav className="nav-container">
        <div className="nav-group">
          <span className="nav-label">Main</span>
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Dashboard
          </NavLink>
        </div>

        <div className="nav-group">
          <span className="nav-label">Chapters</span>
          {loading ? (
            <div className="nav-link">Loading...</div>
          ) : (
            ustav?.chapters?.map((chapter) => (
              <NavLink
                key={chapter.id}
                to={`/chapter/${chapter.id}`}
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              >
                {chapter.id.toUpperCase().replace('_', ' ')}
              </NavLink>
            ))
          )}
        </div>
      </nav>

      <div className="sidebar-footer" style={{ marginTop: 'auto', paddingTop: '2rem' }}>
        <p style={{ fontSize: '0.75rem', color: '#64748b' }}>© 2026 Davor Mulalić</p>
      </div>
    </aside>
  );
};

export default Sidebar;
