import React from 'react';
import QuizCard from './QuizCard';

const QuizDisplay = ({ data, isInteractive = false }) => {

    // State to toggle between "Study Mode" (answers shown) and "Test Mode" (interactive)
    const [mode, setMode] = React.useState('study'); // 'study' | 'test'
    const [submitted, setSubmitted] = React.useState(false);
    const [score, setScore] = React.useState({ correct: 0, total: 0 });
    const [userAnswers, setUserAnswers] = React.useState({}); // Store user answers in test mode

    // Reset state when mode or data changes
    React.useEffect(() => {
        setSubmitted(false);
        setScore({ correct: 0, total: 0 });
        setUserAnswers({});
    }, [mode, data]);

    const handleAnswerSelect = (questionIdx, isCorrect) => {
        // Just store the answer result for calculation later (or live score if you prefer)
        // Let's store boolean correctness for simplicity
        setUserAnswers(prev => ({ ...prev, [questionIdx]: isCorrect }));
    };

    const handleSubmit = () => {
        let correctCount = 0;
        let totalCount = 0;

        // Calculate score based on stored answers
        // Note: this assumes user answered everything. 
        // We can just iterate over userAnswers keys.
        // Or better: iterate over all questions.

        if (data.quiz) {
            totalCount = data.quiz.length;
            Object.values(userAnswers).forEach(isCorrect => {
                if (isCorrect) correctCount++;
            });
        }

        setScore({ correct: correctCount, total: totalCount });
        setSubmitted(true);
    };

    if (!data) return null;

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div></div>

                {/* Mode Toggle & Score */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {mode === 'test' && submitted && (
                        <span style={{ fontWeight: 700, color: 'white', background: 'var(--color-primary-gradient)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-glow)' }}>
                            Final Score: {score.correct} / {score.total}
                        </span>
                    )}
                    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', padding: '4px', border: '1px solid var(--glass-border)' }}>
                        <button
                            onClick={() => setMode('study')}
                            style={{
                                padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
                                background: mode === 'study' ? 'var(--color-surface)' : 'transparent',
                                color: mode === 'study' ? 'white' : 'var(--color-text-muted)',
                                boxShadow: mode === 'study' ? 'var(--shadow-sm)' : 'none',
                                fontWeight: mode === 'study' ? 600 : 500,
                                transition: 'all 0.2s'
                            }}
                        >
                            Study Mode
                        </button>
                        <button
                            onClick={() => setMode('test')}
                            style={{
                                padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
                                background: mode === 'test' ? 'var(--color-surface)' : 'transparent',
                                color: mode === 'test' ? 'white' : 'var(--color-text-muted)',
                                boxShadow: mode === 'test' ? 'var(--shadow-sm)' : 'none',
                                fontWeight: mode === 'test' ? 600 : 500,
                                transition: 'all 0.2s'
                            }}
                        >
                            Take Quiz
                        </button>
                    </div>
                </div>
            </div>

            <div className="card" style={{ marginBottom: '2rem', textAlign: 'center', padding: '2rem', background: 'var(--color-surface)' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem', background: 'var(--color-primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {data.title}
                </h2>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>{data.summary}</p>

                {data.sections && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                        <strong>Sections covered:</strong> {data.sections.join(', ')}
                    </div>
                )}
            </div>

            <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
                {data.quiz && data.quiz.map((q, idx) => (
                    <QuizCard
                        key={q.id || idx}
                        question={q}
                        index={idx}
                        isInteractive={true}
                        mode={mode}
                        submitted={submitted} // Pass submitted state
                        onAnswer={(isCorrect) => handleAnswerSelect(idx, isCorrect)}
                    />
                ))}
            </div>

            {/* Submit Button for Test Mode */}
            {mode === 'test' && !submitted && (
                <div style={{ textAlign: 'center', marginTop: '2rem', marginBottom: '3rem' }}>
                    <button
                        className="btn btn-primary"
                        onClick={handleSubmit}
                        style={{ padding: '0.875rem 3rem', fontSize: '1.1rem' }}
                    >
                        Submit Quiz
                    </button>
                </div>
            )}

            <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Explore Related Topics
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {data.related_topics.map((topic, idx) => (
                        <span
                            key={idx}
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                padding: '0.5rem 1.25rem',
                                borderRadius: '2rem',
                                border: '1px solid var(--glass-border)',
                                fontSize: '0.9rem',
                                color: 'white',
                                fontWeight: 500,
                                cursor: 'default',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'white'; }}
                        >
                            {topic}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuizDisplay;
