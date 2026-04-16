import React, { useState } from 'react';
import QuizGenerator from './components/QuizGenerator';
import History from './components/History';

function App() {
  const [activeTab, setActiveTab] = useState('generate');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Header / Nav */}
      <header className="glass-panel" style={{ borderBottom: '1px solid var(--glass-border)', position: 'sticky', top: 0, zIndex: 50, background: 'rgba(15, 23, 42, 0.8)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px', height: '40px',
              background: 'var(--color-primary-gradient)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white',
              boxShadow: 'var(--shadow-glow)'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '24px', height: '24px' }}>
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.025em' }}>
              WikiQuiz <span style={{ background: 'var(--color-primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span>
            </h1>
          </div>

          <nav style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
            <button
              onClick={() => setActiveTab('generate')}
              className={`nav-btn ${activeTab === 'generate' ? 'active' : ''}`}
            >
              Generate Quiz
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`nav-btn ${activeTab === 'history' ? 'active' : ''}`}
            >
              History
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container" style={{ flex: 1, paddingBottom: '4rem', marginTop: '1rem' }}>
        {activeTab === 'generate' ? <QuizGenerator /> : <History />}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--color-border)', padding: '2rem 0', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
        <p>© 2026 WikiQuiz AI. Built for Learning.</p>
      </footer>

    </div>
  );
}

export default App;