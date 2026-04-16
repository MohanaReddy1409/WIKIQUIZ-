import React, { useState } from 'react';
import QuizDisplay from './QuizDisplay';
import { MOCK_QUIZ_RESPONSE } from '../mockData';

import config from '../config';

const QuizGenerator = () => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [quizData, setQuizData] = useState(null);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!url) {
            setError('Please enter a valid Wikipedia URL');
            return;
        }
        if (!url.includes('wikipedia.org')) {
            setError('URL must be from wikipedia.org');
            return;
        }

        setError('');
        setLoading(true);
        setQuizData(null);

        const cacheKey = `quiz_cache_${url.trim()}`;

        try {
            // Check cache first
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
                // Simulate a small delay for better UX (optional, but feels nicer than instant flickering) or just set it
                // User said "it should not take much time", so instant is good.
                setQuizData(JSON.parse(cachedData));
                return;
            }

            const response = await fetch(`${config.API_URL}/generate-quiz`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Failed to generate quiz');
            }

            const data = await response.json();

            // Save to cache
            try {
                localStorage.setItem(cacheKey, JSON.stringify(data));
            } catch (e) {
                console.warn('Failed to save to cache', e);
            }

            setQuizData(data);
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    // Skeleton Loader Component
    const SkeletonLoader = () => (
        <div className="card" style={{ padding: '2rem', marginTop: '2rem', background: 'var(--color-surface)', borderColor: 'var(--glass-border)' }}>
            <div className="skeleton-pulse" style={{ height: '32px', width: '60%', margin: '0 auto 1.5rem auto', background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)' }}></div>
            <div className="skeleton-pulse" style={{ height: '16px', width: '80%', margin: '0 auto 2.5rem auto', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)' }}></div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {[1, 2, 3].map(i => (
                    <div key={i} style={{ height: '120px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}></div>
                ))}
            </div>
            <style>{`
                @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 0.8; } 100% { opacity: 0.4; } }
                .skeleton-pulse { animation: pulse 2s infinite ease-in-out; }
            `}</style>
        </div>
    );

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>

            {/* Input Section */}
            <div className="card" style={{ padding: '3rem 2rem', marginBottom: '3rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                {/* Decorative background blur */}
                <div style={{ position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }}></div>

                <h2 style={{ marginBottom: '0.5rem', fontSize: '2rem', fontWeight: 800 }}>
                    Generate a Quiz
                </h2>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>
                    Paste any Wikipedia article URL to instantly create an interactive quiz.
                </p>

                <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column', maxWidth: '550px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="https://en.wikipedia.org/wiki/..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            disabled={loading}
                            style={{ paddingLeft: '3rem', fontSize: '1.1rem', height: '3.5rem' }}
                        />
                        {/* Search Icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: '24px', height: '24px', color: 'var(--color-text-muted)' }}
                        >
                            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                        </svg>
                    </div>

                    {error && (
                        <div style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            color: '#fea5a5',
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.9rem'
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '16px', height: '16px' }}>
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <button
                        className="btn btn-primary"
                        onClick={handleGenerate}
                        disabled={loading}
                        style={{ width: '100%', justifyContent: 'center', height: '3.5rem', fontSize: '1.1rem' }}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin" viewBox="0 0 24 24" fill="none" style={{ width: '24px', height: '24px', animation: 'spin 1s linear infinite' }}>
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.3"></circle>
                                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                                Analysing Content...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '20px', height: '20px' }}>
                                    <path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.96l1.192.238a1 1 0 01.785.785l.238 1.192a1 1 0 001.96 0l.238-1.192a1 1 0 01.785-.785l1.192-.238a1 1 0 000-1.96l-1.192-.238a1 1 0 01-.785-.785l-.238-1.192zM6.949 5.684a1 1 0 00-1.898 0l-.683 2.051a1 1 0 01-.633.633l-2.051.683a1 1 0 000 1.898l2.051.683a1 1 0 01.633.633l.683 2.051a1 1 0 001.898 0l.683-2.051a1 1 0 01.633-.633l2.051-.683a1 1 0 000-1.898l-2.051-.683a1 1 0 01-.633-.633L6.95 5.684z" />
                                </svg>
                                Generate Magic Quiz
                            </>
                        )}
                    </button>
                </div>
            </div>

            <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

            {loading && <SkeletonLoader />}

            {/* Results Section */}
            {quizData && !loading && (
                <QuizDisplay data={quizData} isInteractive={true} />
            )}

        </div>
    );
};

export default QuizGenerator;
