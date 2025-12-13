import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import './App.css';

const API_BASE = 'http://localhost:5000';

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
  steps: any[];
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
      
      const data = await res.json();
      setResult(data);
      setPage('review');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assess quiz');
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
      
      const data = await res.json();
      setRoadmap(data);
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
    doc.text('Learning Steps:', 15, y);
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
          <p>AI-Powered Learning Roadmap</p>
        </header>
        <main className="main-content">
          <section className="input-section">
            <form onSubmit={startQuiz}>
              <div className="form-group">
                <label>What do you want to learn?</label>
                <input
                  type="text"
                  placeholder="e.g., React, Python, Machine Learning..."
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>How long do you have?</label>
                <select value={timeline} onChange={e => setTimeline(e.target.value)}>
                  <option value="">Select timeline</option>
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
          <div className="quiz-progress">Question {currentIdx + 1} / {quiz.length}</div>
        </header>
        <main className="main-content">
          <section className="quiz-section">
            <h2>{q.question}</h2>
            <div className="options">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  className={`option ${selected === i ? 'selected' : ''}`}
                  onClick={() => selectAnswer(i)}
                >
                  {opt}
                </button>
              ))}
            </div>
            <div className="quiz-controls">
              <button onClick={prevQuestion} disabled={currentIdx === 0} className="nav-btn">
                ← Previous
              </button>
              <button onClick={skipQuestion} className="skip-btn">
                ❓ Skip
              </button>
              {currentIdx === quiz.length - 1 ? (
                <button onClick={submitQuiz} disabled={loading} className="submit-btn">
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              ) : (
                <button onClick={nextQuestion} className="nav-btn">
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
          <h1>📊 Quiz Results</h1>
        </header>
        <main className="main-content">
          <section className="review-section">
            <div className="score-card">
              <div className="score-circle">
                <span className="percentage">{result.percentage}%</span>
              </div>
              <div className="score-details">
                <h2>Score: {result.score}/{result.totalQuestions}</h2>
              </div>
            </div>

            {result.strongAreas.length > 0 && (
              <div className="performance-card">
                <h3>✨ Strong Areas</h3>
                {result.strongAreas.map((area, i) => (
                  <span key={i} className="area-badge">{area}</span>
                ))}
              </div>
            )}

            {result.weakAreas.length > 0 && (
              <div className="performance-card">
                <h3>📚 Areas to Improve</h3>
                {result.weakAreas.map((area, i) => (
                  <span key={i} className="area-badge">{area}</span>
                ))}
              </div>
            )}

            <div className="questions-review">
              <h3>Review Answers</h3>
              {quiz.map((q, idx) => {
                const userAnswer = answers[idx];
                const isCorrect = userAnswer === q.correctAnswer;
                
                return (
                  <div key={idx} className={`review-card ${isCorrect ? 'correct' : 'incorrect'}`}>
                    <p className="question-number">Q{idx + 1}: {q.question}</p>
                    <p className="answer-text">Your answer: {userAnswer === null ? '(Skipped)' : q.options[userAnswer]}</p>
                    {!isCorrect && <p className="correct-answer">Correct: {q.options[q.correctAnswer || 0]}</p>}
                    <p className={isCorrect ? 'status-correct' : 'status-wrong'}>{isCorrect ? '✓ Correct' : '✗ Wrong'}</p>
                  </div>
                );
              })}
            </div>

            <button onClick={generateRoadmap} disabled={loading} className="submit-btn">
              Generate Roadmap
            </button>
            <button onClick={restart} className="secondary-btn">
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
          <h1>🗺️ Your Roadmap</h1>
          <p>{roadmap.topic}</p>
        </header>
        <main className="main-content">
          <section className="roadmap-section">
            <div className="roadmap-header">
              <h2>{roadmap.topic}</h2>
              <p>�� {roadmap.timeline}</p>
            </div>
            <p className="summary">{roadmap.summary}</p>
            <div className="steps">
              {roadmap.steps.map((step, i) => (
                <div key={i} className="step">
                  <h3>Step {i + 1}: {step.title}</h3>
                  <p>{step.description}</p>
                  {step.estimatedTime && <p>⏱️ {step.estimatedTime}</p>}
                </div>
              ))}
            </div>
            <button onClick={downloadPDF} className="submit-btn">
              📥 Download PDF
            </button>
            <button onClick={restart} className="secondary-btn">
              New Assessment
            </button>
          </section>
        </main>
      </div>
    );
  }

  return null;
}
