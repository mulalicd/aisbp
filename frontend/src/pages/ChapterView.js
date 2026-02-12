import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function ChapterView() {
  const { chapterId } = useParams();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`/api/chapters/${chapterId}`)
      .then(response => {
        console.log('Chapter data:', response.data);
        setChapter(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching chapter:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [chapterId]);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Loading chapter...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
        <h2>Error: {error}</h2>
        <Link to="/" style={{ color: '#1976D2' }}>← Back to Home</Link>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Chapter not found</h2>
        <Link to="/" style={{ color: '#1976D2' }}>← Back to Home</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Breadcrumbs */}
      <div style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
        <Link to="/" style={{ color: '#1976D2', textDecoration: 'none' }}>Home</Link>
        {' '} / {' '}
        <span style={{ color: '#333' }}>Chapter {chapter.number}</span>
      </div>

      {/* Chapter Header */}
      <h1 style={{ 
        fontSize: '48px',
        fontWeight: '900',
        marginBottom: '10px',
        color: 'black'
      }}>
        Chapter {chapter.number}
      </h1>
      
      <h2 style={{
        fontSize: '32px',
        fontWeight: '700',
        marginBottom: '20px',
        color: '#424242'
      }}>
        {chapter.title}
      </h2>

      {chapter.subtitle && (
        <h3 style={{
          fontSize: '24px',
          fontWeight: '500',
          marginBottom: '30px',
          color: '#666'
        }}>
          {chapter.subtitle}
        </h3>
      )}

      {/* Chapter Introduction */}
      {chapter.intro && (
        <div style={{
          fontSize: '16px',
          lineHeight: '1.6',
          color: '#333',
          marginBottom: '40px',
          padding: '20px',
          backgroundColor: '#F5F5F5',
          borderLeft: '4px solid #D32F2F'
        }}>
          <p style={{ whiteSpace: 'pre-wrap' }}>{chapter.intro}</p>
        </div>
      )}

      {/* Divider */}
      <hr style={{ 
        border: 'none',
        borderTop: '2px solid #BDBDBD',
        margin: '40px 0'
      }} />

      {/* Problems List */}
      <h3 style={{
        fontSize: '28px',
        fontWeight: '700',
        marginBottom: '20px',
        color: 'black'
      }}>
        Problems
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {(chapter.problems || []).map((problem) => (
          <Link
            key={problem.id}
            to={`/chapter/${chapterId}/problem/${problem.id}`}
            style={{
              display: 'block',
              padding: '25px',
              backgroundColor: '#F5F5F5',
              borderLeft: '4px solid transparent',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderLeftColor = '#D32F2F';
              e.currentTarget.style.backgroundColor = '#EEEEEE';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderLeftColor = 'transparent';
              e.currentTarget.style.backgroundColor = '#F5F5F5';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#D32F2F',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                fontWeight: 'bold',
                borderRadius: '4px',
                flexShrink: 0
              }}>
                {problem.number}
              </div>
              
              <div style={{ flex: 1 }}>
                <h4 style={{
                  fontSize: '22px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  color: 'black'
                }}>
                  Problem {chapter.number}.{problem.number}: {problem.title}
                </h4>
                
                {problem.sections?.operationalReality?.content && (
                  <p style={{
                    fontSize: '14px',
                    color: '#666',
                    margin: 0,
                    lineHeight: '1.5'
                  }}>
                    {problem.sections.operationalReality.content.substring(0, 150)}...
                  </p>
                )}
              </div>

              <div style={{ fontSize: '24px', color: '#999' }}>
                →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ChapterView;
