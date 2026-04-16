import React, { useState } from 'react';

const QuizCard = ({ question, index, isInteractive = false, mode = 'study', submitted = false, onAnswer }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);

    // Reset state when question changes or mode resets
    React.useEffect(() => {
        setSelectedOption(null);
        setIsAnswered(false);
    }, [question, mode]);

    const handleSelect = (option) => {
        // Stop interaction if:
        // 1. Not interactive
        // 2. Already submitted (Test Mode)
        // 3. Already answered (Study Mode - single guess allowed)
        if (!isInteractive || submitted || (mode === 'study' && isAnswered)) return;

        setSelectedOption(option);

        // In Study Mode, lock it immediately.
        if (mode === 'study') {
            setIsAnswered(true);
        }

        const isCorrect = option === question.answer;
        if (onAnswer) {
            onAnswer(isCorrect);
        }
    };

    // Determine when to show results (Green/Red colors & Explanation)
    // Study Mode: Show immediately after user picks an option.
    // Test Mode: Show ONLY after the global "submitted" prop is true.
    const showResult = (mode === 'study' && isAnswered) || (mode === 'test' && submitted);

    // Dynamic Styles based on state
    const getOptionStyle = (option) => {
        const baseStyle = {
            padding: '1rem',
            borderRadius: '0.75rem',
            border: '1px solid var(--glass-border)',
            backgroundColor: 'rgba(255,255,255,0.02)',
            cursor: (!isInteractive || submitted || (mode === 'study' && isAnswered)) ? 'default' : 'pointer',
            transition: 'all 0.2s ease',
            color: 'var(--color-text-main)'
        };

        if (!showResult) {
            // Unanswered state (or Test Mode before submit)
            // Show simple Blue selection if selected
            if (selectedOption === option) {
                return {
                    ...baseStyle,
                    borderColor: 'var(--color-primary)',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    boxShadow: '0 0 0 1px var(--color-primary)'
                };
            }
            return baseStyle; // Neutral
        }

        // Result state (Revealed)
        if (option === question.answer) {
            // Always show correct answer in Green
            return {
                ...baseStyle,
                borderColor: 'var(--color-success)',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399'
            };
        }
        if (selectedOption === option && option !== question.answer) {
            // Show User's Wrong Answer in Red
            return {
                ...baseStyle,
                borderColor: 'var(--color-error)',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#f87171'
            };
        }

        // Other unselected options fade out
        return { ...baseStyle, opacity: 0.5 };
    };

    const difficultyColors = {
        easy: "badge-easy",
        medium: "badge-medium",
        hard: "badge-hard"
    };

    return (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid var(--color-primary)', background: 'var(--color-surface)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'white', lineHeight: '1.5' }}>
                    <span style={{ color: 'var(--color-primary)', marginRight: '0.75rem' }}>Q{index + 1}.</span>
                    {question.question}
                </h3>
                <span className={`badge ${difficultyColors[question.difficulty] || 'badge-medium'}`}>
                    {question.difficulty}
                </span>
            </div>

            <div style={{ display: 'grid', gap: '0.75rem' }}>
                {question.options.map((option, idx) => (

                    <div
                        key={idx}
                        onClick={() => handleSelect(option)}
                        style={getOptionStyle(option)}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                width: '28px', height: '28px', borderRadius: '8px',
                                border: '1px solid currentColor',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.85rem', fontWeight: 700,
                                color: 'inherit', opacity: 0.9
                            }}>
                                {String.fromCharCode(65 + idx)}
                            </div>
                            <span style={{ fontSize: '1rem' }}>{option}</span>
                        </div>
                    </div>
                ))}
            </div>


            {showResult && (
                <div className="animate-fade-in" style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                    <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', display: 'flex', gap: '0.5rem', lineHeight: '1.6' }}>
                        <strong style={{ color: 'var(--color-secondary)' }}>Explanation:</strong>
                        <span>{question.explanation}</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default QuizCard;
