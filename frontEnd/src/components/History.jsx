import React, { useState } from 'react';
import { MOCK_HISTORY, MOCK_QUIZ_RESPONSE } from '../mockData';
import QuizDisplay from './QuizDisplay';
import config from '../config';

const History = () => {
    const [selectedQuiz, setSelectedQuiz] = useState(null);


    // Use API data or mock data as fallback
    const [historyData, setHistoryData] = useState([]);

    // Fetch history from API on mount
    React.useEffect(() => {
        fetch(`${config.API_URL}/history`)
            .then(res => res.json())
            .then(data => setHistoryData(data))
            .catch(err => {
                console.error("Failed to fetch history:", err);
                setHistoryData(MOCK_HISTORY); // Fallback to mock data if API fails
            });
    }, []);


    return (
        <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div className="card">
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white' }}>History</h2>
                    <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{historyData.length} Quizzes Generated</span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                            <tr>
                                <th style={{ padding: '1rem' }}>Article Topic</th>
                                <th style={{ padding: '1rem' }}>URL</th>
                                <th style={{ padding: '1rem' }}>Date Generated</th>
                                <th style={{ padding: '1rem' }}>Questions</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historyData.map((item) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '1rem', fontWeight: 500, color: 'white' }}>{item.title}</td>
                                    <td style={{ padding: '1rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        <a href={item.url} target="_blank" rel="noreferrer" style={{ color: 'var(--color-secondary)', textDecoration: 'none' }}>
                                            {item.url}
                                        </a>
                                    </td>
                                    <td style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>{item.date}</td>
                                    <td style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>{item.questions_count}</td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <button
                                            className="btn btn-outline"
                                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                                            onClick={() => setSelectedQuiz(item)}
                                        >
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Details */}
            {selectedQuiz && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
                    padding: '1rem'
                }} onClick={() => setSelectedQuiz(null)}>
                    <div className="glass-panel" style={{
                        backgroundColor: '#1e293b',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '16px',
                        width: '100%', maxWidth: '800px', maxHeight: '85vh',
                        display: 'flex', flexDirection: 'column',
                        position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        overflow: 'hidden' // Hide overflow here, scroll content inside
                    }} onClick={(e) => e.stopPropagation()}>

                        {/* Modal Header */}
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.6)' }}>
                            <h3 style={{ margin: 0, color: 'white', fontSize: '1.25rem' }}>Quiz Assessment</h3>
                            <button
                                onClick={() => setSelectedQuiz(null)}
                                style={{
                                    background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '32px', height: '32px',
                                    fontSize: '1.2rem', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'background 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.4)'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Content - Scrollable */}
                        <div style={{ padding: '2rem', overflowY: 'auto' }}>
                            <QuizDisplay data={selectedQuiz} isInteractive={true} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default History;
