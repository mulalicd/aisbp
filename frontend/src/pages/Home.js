import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/chapters')
      .then(response => {
        setChapters(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching chapters:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return (<div className="p-8 text-center">Loading...</div>);
  if (error) return (<div className="p-8 text-center text-red-600">Error: {error}</div>);

  // Render the provided literal dashboard design using Tailwind classes (CDN in public/index.html)
  return (
    <div className="bg-white min-h-screen flex">
      <div className="w-2 md:w-4 bg-[#C8102E] shrink-0" />

      <main className="flex-1 flex flex-col p-8 md:p-16 relative">
        <div className="absolute top-8 right-8 text-right text-[10px] md:text-xs uppercase tracking-widest text-gray-500">
          <p>For specialized implementation support, training workshops,</p>
          <p>or executive consulting</p>
          <p className="text-[#C8102E] font-bold">mulalic.ai-studio.wiki</p>
        </div>

        <header className="mt-12 mb-16">
          <h1 className="text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter text-black uppercase">
            AI SOLVED<br />BUSINESS<br />PROBLEMS
          </h1>
          <div className="mt-8 flex flex-col gap-1">
            <p className="text-lg md:text-xl font-medium text-gray-800">50 Real-World Challenges from 10 Industries</p>
            <p className="text-md md:text-lg text-gray-500 italic">A Manager's Workbook</p>
          </div>
        </header>

        <hr className="border-t border-gray-300 mb-12" />

        <section className="max-w-5xl">
          <h2 className="text-2xl font-bold mb-8 uppercase tracking-tight">Table of Contents</h2>

          <div className="flex flex-col border-t border-gray-100">
            {chapters.slice(0,10).map((chapter, idx) => (
              <Link key={chapter.id || idx} to={`/chapter/${chapter.id || chapter.number}`} className="group flex items-center py-4 border-b border-gray-100 hover:bg-gray-50 transition-all px-2">
                <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase w-24">Chapter {chapter.number || idx+1}</span>
                <span className="text-sm md:text-base font-bold text-gray-800 uppercase flex-1">{chapter.title}</span>
                <span className="text-sm text-gray-400 italic">{chapter.intro ? '— ' + (chapter.intro.split('\n')[0].slice(0,40)) : chapter.subtitle || ''}</span>
                <svg className="w-4 h-4 ml-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </Link>
            ))}
          </div>
        </section>

        <footer className="mt-auto pt-16">
          <p className="text-xl md:text-2xl font-bold tracking-tight text-black">Davor Mulalić</p>
        </footer>
      </main>
    </div>
  );
}

export default Home;
