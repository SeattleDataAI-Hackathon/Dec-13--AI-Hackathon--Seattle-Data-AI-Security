import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import './App.css';

const API_BASE = 'http://localhost:5000';

interface Resource {
  title: string;
  type: string;
  description: string;
  creator?: string;
  isPremium?: boolean;
  url?: string;
}

interface RoadmapStep {
  id?: number;
  title: string;
  description: string;
  estimatedTime: string;
  keyTopics?: string[];
  resources?: Resource[];
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  type: string;
  correctAnswer?: number;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  weakAreas: string[];
  strongAreas: string[];
}

interface Roadmap {
  topic: string;
  timeline: string;
  assessmentScore: number;
  steps: RoadmapStep[];
  summary: string;
  focusAreas: string[];
}

export default function App() {
  const [page, setPage] = useState<'home' | 'quiz' | 'review' | 'roadmap'>('home');
  const [topic, setTopic] = useState('');
  const [timeline, setTimeline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);

  // Function to parse and render code blocks
  const renderQuestionText = (text: string) => {
    const codeBlockRegex = /```(bash|sh|shell|javascript|python|jsx|typescript)?\n([\s\S]*?)```/g;
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    let blockIndex = 0;

    let match;
    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const language = match[1] || 'bash';
      const code = match[2];

      // Add code block
      parts.push(
        <pre key={`code-${blockIndex}`} className="code-block">
          <code className={`language-${language}`}>{code.trim()}</code>
        </pre>
      );

      lastIndex = match.index + match[0].length;
      blockIndex++;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const startQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !timeline) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${API_BASE}/api/generate-quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      
      const data = await res.json();
      setQuiz(data.questions || []);
      setCurrentIdx(0);
      setAnswers({});
      setPage('quiz');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quiz');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (optIdx: number) => {
    setAnswers(prev => ({ ...prev, [currentIdx]: optIdx }));
  };

  const skipQuestion = () => {
    setAnswers(prev => ({ ...prev, [currentIdx]: null }));
    if (currentIdx < quiz.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < quiz.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const submitQuiz = async () => {
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${API_BASE}/api/assess-knowledge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, answers, questions: quiz }),
      });
      
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      
      const assessmentResult = await res.json();
      setResult(assessmentResult);
      setPage('review');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit quiz');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateRoadmap = async () => {
    if (!result) return;
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${API_BASE}/api/generate-roadmap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          timeline,
          assessmentScore: result.percentage,
          weakAreas: result.weakAreas,
          strongAreas: result.strongAreas,
        }),
      });
      
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      
      const roadmapData = await res.json();
      setRoadmap(roadmapData);
      setPage('roadmap');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate roadmap');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!roadmap || !result) return;
    
    const doc = new jsPDF();
    let y = 15;
    
    doc.setFontSize(20);
    doc.text(`LearnMap - ${roadmap.topic}`, 15, y);
    y += 15;
    
    doc.setFontSize(12);
    doc.text(`Score: ${result.percentage}%`, 15, y);
    y += 8;
    doc.text(`Timeline: ${roadmap.timeline}`, 15, y);
    y += 12;
    
    doc.setFontSize(11);
    doc.text('Summary:', 15, y);
    y += 6;
    doc.setFontSize(10);
    const summaryLines = doc.splitTextToSize(roadmap.summary, 180);
    doc.text(summaryLines, 15, y);
    y += summaryLines.length * 4 + 8;
    
    doc.setFontSize(11);
    doc.text('Learning Path:', 15, y);
    y += 8;
    
    roadmap.steps.forEach((step, idx) => {
      if (y > 250) {
        doc.addPage();
        y = 15;
      }
      doc.setFontSize(10);
      doc.text(`Step ${idx + 1}: ${step.title}`, 15, y);
      y += 6;
      doc.setFontSize(9);
      const descLines = doc.splitTextToSize(step.description, 180);
      doc.text(descLines, 15, y);
      y += descLines.length * 4 + 4;
      
      if (step.resources && step.resources.length > 0) {
        doc.setFontSize(9);
        doc.text('Resources:', 15, y);
        y += 4;
        doc.setFontSize(8);
        step.resources.forEach(resource => {
          if (y > 270) {
            doc.addPage();
            y = 15;
          }
          const resourceText = `• ${resource.title} (${resource.type})${resource.isPremium ? ' [Premium]' : ''}`;
          doc.text(resourceText, 18, y);
          y += 4;
        });
        y += 2;
      }
    });
    
    doc.save(`${roadmap.topic}-roadmap.pdf`);
  };

  const restart = () => {
    setPage('home');
    setTopic('');
    setTimeline('');
    setQuiz([]);
    setCurrentIdx(0);
    setAnswers({});
    setResult(null);
    setRoadmap(null);
    setError('');
  };

  // HOME PAGE
  if (page === 'home') {
    return (
      <div className="app">
        <header className="header">
          <h1>🎓 LearnMap.ai</h1>
          <p>AI-Powered Personalized Learning Roadmaps</p>
        </header>
        <main className="main-content">
          <section className="input-section">
            <form onSubmit={startQuiz}>
              <div className="form-group">
                <label>What do you want to learn?</label>
                <input
                  type="text"
                  placeholder="e.g., React, Python, Machine Learning, Data Science..."
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>How much time do you have?</label>
                <select value={timeline} onChange={e => setTimeline(e.target.value)}>
                  <option value="">Select your timeline</option>
                  <option value="1 week">1 Week</option>
                  <option value="2 weeks">2 Weeks</option>
                  <option value="1 month">1 Month</option>
                  <option value="3 months">3 Months</option>
                  <option value="6 months">6 Months</option>
                </select>
              </div>
              {error && <div className="error-message">{error}</div>}
              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? 'Loading...' : 'Start Assessment'}
              </button>
            </form>
          </section>
        </main>
      </div>
    );
  }

  // QUIZ PAGE
  if (page === 'quiz' && quiz.length > 0) {
    const q = quiz[currentIdx];
    const selected = answers[currentIdx];
    
    return (
      <div className="app">
        <header className="header">
          <h1>🎓 LearnMap.ai</h1>
          <div className="quiz-progress">Question {currentIdx + 1} of {quiz.length}</div>
        </header>
        <main className="main-content">
          <section className="quiz-section">
            <div className="question-content">
              {renderQuestionText(q.question)}
            </div>
            <div className="options">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  className={`option ${selected === i ? 'selected' : ''}`}
                  onClick={() => selectAnswer(i)}
                >
                  {renderQuestionText(opt)}
                </button>
              ))}
            </div>
            <div className="quiz-controls">
              <button onClick={prevQuestion} disabled={currentIdx === 0} className="nav-btn prev-btn">
                ← Previous
              </button>
              <button onClick={skipQuestion} className="skip-btn">
                ❓ Skip
              </button>
              {currentIdx === quiz.length - 1 ? (
                <button onClick={submitQuiz} disabled={loading} className="submit-btn final-btn">
                  {loading ? 'Submitting...' : 'Submit Quiz'}
                </button>
              ) : (
                <button onClick={nextQuestion} className="nav-btn next-btn">
                  Next →
                </button>
              )}
            </div>
            {error && <div className="error-message">{error}</div>}
          </section>
        </main>
      </div>
    );
  }

  // REVIEW PAGE
  if (page === 'review' && result) {
    return (
      <div className="app">
        <header className="header">
          <h1>📊 Your Results</h1>
        </header>
        <main className="main-content">
          <section className="review-section">
            <div className="score-card">
              <div className="score-circle">
                <span className="percentage">{result.percentage}%</span>
              </div>
              <div className="score-details">
                <h2>Score: {result.score}/{result.totalQuestions}</h2>
                <p>{result.percentage >= 80 ? 'Excellent work!' : result.percentage >= 60 ? 'Good effort!' : 'Room for improvement'}</p>
              </div>
            </div>

            {result.strongAreas.length > 0 && (
              <div className="performance-card">
                <h3>✨ Strong Areas</h3>
                {result.strongAreas.map((area, i) => (
                  <span key={i} className="area-badge success">{area}</span>
                ))}
              </div>
            )}

            {result.weakAreas.length > 0 && (
              <div className="performance-card">
                <h3>📚 Areas to Improve</h3>
                {result.weakAreas.map((area, i) => (
                  <span key={i} className="area-badge warning">{area}</span>
                ))}
              </div>
            )}

            <div className="questions-review">
              <h3>📋 Review Your Answers</h3>
              {quiz.map((q, idx) => {
                const userAnswer = answers[idx];
                const isCorrect = userAnswer === q.correctAnswer;
                
                return (
                  <div key={idx} className={`review-card ${isCorrect ? 'correct' : userAnswer === null ? 'skipped' : 'incorrect'}`}>
                    <p className="question-number">Q{idx + 1}: {q.question}</p>
                    <p className="answer-text">
                      Your answer: <strong>{userAnswer === null ? '(Skipped)' : q.options[userAnswer]}</strong>
                    </p>
                    {!isCorrect && userAnswer !== null && (
                      <p className="correct-answer">Correct answer: <strong>{q.options[q.correctAnswer || 0]}</strong></p>
                    )}
                    <div className={isCorrect ? 'answer-indicator correct' : userAnswer === null ? 'answer-indicator skipped' : 'answer-indicator incorrect'}>
                      {isCorrect ? '✓ Correct' : userAnswer === null ? '⊘ Skipped' : '✗ Incorrect'}
                    </div>
                  </div>
                );
              })}
            </div>

            <button onClick={generateRoadmap} disabled={loading} className="submit-btn">
              {loading ? 'Generating...' : 'Generate Personalized Roadmap'}
            </button>
            <button onClick={restart} className="nav-btn">
              Start Over
            </button>
            {error && <div className="error-message">{error}</div>}
          </section>
        </main>
      </div>
    );
  }

  // ROADMAP PAGE
  if (page === 'roadmap' && roadmap) {
    return (
      <div className="app">
        <header className="header">
          <h1>🗺️ Your Learning Roadmap</h1>
          <p>{roadmap.topic} • {roadmap.timeline}</p>
        </header>
        <main className="main-content">
          <section className="roadmap-section">
            <div className="roadmap-header">
              <h2>{roadmap.topic}</h2>
              <p>📅 Timeline: {roadmap.timeline} | 📊 Assessment Score: {roadmap.assessmentScore}%</p>
            </div>

            <div className="roadmap-summary">
              {roadmap.summary}
            </div>

            {roadmap.focusAreas && roadmap.focusAreas.length > 0 && (
              <div className="focus-areas">
                <h3>🎯 Key Focus Areas</h3>
                <div className="focus-grid">
                  {roadmap.focusAreas.map((area, i) => (
                    <div key={i} className="focus-item">{area}</div>
                  ))}
                </div>
              </div>
            )}

            <div className="roadmap-steps">
              {roadmap.steps.map((step, i) => (
                <div key={i} className="step-card">
                  <div className="step-number">{i + 1}</div>
                  <div className="step-content">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                    
                    {step.keyTopics && step.keyTopics.length > 0 && (
                      <div className="key-topics">
                        <strong>Key Topics:</strong> {step.keyTopics.join(', ')}
                      </div>
                    )}

                    <div className="time-badge">⏱️ {step.estimatedTime}</div>

                    {step.resources && step.resources.length > 0 && (
                      <div className="resources">
                        <h4>📚 Learning Resources</h4>
                        <div className="resources-grid">
                          {step.resources.map((resource, idx) => (
                            <div key={idx} className={`resource-card ${resource.isPremium ? 'premium' : 'free'}`}>
                              <div className="resource-header">
                                <h5>{resource.title}</h5>
                                {resource.isPremium && <span className="premium-badge">💎 Premium</span>}
                              </div>
                              <p className="resource-type">📌 {resource.type}</p>
                              {resource.creator && <p className="resource-creator">by {resource.creator}</p>}
                              <p className="resource-description">{resource.description}</p>
                              {resource.url && (
                                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-link">
                                  View Resource →
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="roadmap-actions">
              <button onClick={downloadPDF} className="submit-btn">
                📥 Download Roadmap as PDF
              </button>
              <button onClick={restart} className="nav-btn">
                🔄 Start New Assessment
              </button>
            </div>
            
            {error && <div className="error-message">{error}</div>}
          </section>
        </main>
      </div>
    );
  }

  return null;
}
