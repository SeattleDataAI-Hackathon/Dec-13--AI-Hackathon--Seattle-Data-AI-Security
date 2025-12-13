import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import './App.css';

const API_BASE = 'http://localhost:5000';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  type: 'multiple-choice' | 'true-false';
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  weakAreas: string[];
  strongAreas: string[];
}

interface Resource {
  title: string;
  type: 'tutorial' | 'course' | 'book' | 'documentation' | 'video';
  description: string;
  isPremium: boolean;
  url: string;
}

interface RoadmapStep {
  title: string;
  description: string;
  resources: Resource[];
  estimatedTime: string;
}

interface Roadmap {
  topic: string;
  timeline: string;
  assessmentScore: number;
  steps: RoadmapStep[];
  summary: string;
  focusAreas: string[];
}

function App() {
  const [topic, setTopic] = useState('');
  const [timeline, setTimeline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Quiz state
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  // Roadmap state
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Step 1: Generate pre-quiz
      const quizResponse = await fetch(`${API_BASE}/api/generate-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });
      if (!quizResponse.ok) {
        throw new Error('Failed to generate quiz');
      }

      const quizData = await quizResponse.json();
      setQuiz(quizData.questions);
      setCurrentQuestionIndex(0);
      setAnswers({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleQuizAnswer = (optionIndex: number) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: optionIndex,
    });
  };

  const handleNextQuestion = () => {
    if (quiz && currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;

    setError('');
    setLoading(true);

    try {
      // Step 2: Submit quiz answers and get assessment
      const assessmentResponse = await fetch(`${API_BASE}/api/assess-knowledge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          answers,
          questions: quiz,
        }),
      });

      if (!assessmentResponse.ok) {
        throw new Error('Failed to assess knowledge');
      }

      const result = await assessmentResponse.json();
      setQuizResult(result);

      // Step 3: Generate personalized roadmap based on assessment
      const roadmapResponse = await fetch(`${API_BASE}/api/generate-roadmap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          timeline,
          assessmentScore: result.percentage,
          weakAreas: result.weakAreas,
          strongAreas: result.strongAreas,
        }),
      });

      if (!roadmapResponse.ok) {
        throw new Error('Failed to generate roadmap');
      }

      const roadmapData = await roadmapResponse.json();
      setRoadmap(roadmapData);
      setQuiz(null); // Clear quiz from display
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const downloadRoadmap = () => {
    if (!roadmap || !quizResult) return;

    const doc = new jsPDF();
    let yPos = 10;
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    const lineHeight = 6;

    // Helper function to add a new page if needed
    const checkPageBreak = (height: number) => {
      if (yPos + height > pageHeight - margin) {
        doc.addPage();
        yPos = margin;
      }
    };

    // Title
    doc.setFontSize(20);
    doc.setTextColor(102, 126, 234); // Purple
    doc.text("LearnMap.ai", margin, yPos);
    yPos += 10;

    doc.setFontSize(16);
    doc.setTextColor(50, 50, 50);
    doc.text(`Personalized Learning Roadmap`, margin, yPos);
    yPos += 10;

    // Topic and Info
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Topic: ${roadmap.topic}`, margin, yPos);
    yPos += 6;
    doc.text(`Timeline: ${roadmap.timeline}`, margin, yPos);
    yPos += 6;
    doc.text(`Assessment Score: ${roadmap.assessmentScore}%`, margin, yPos);
    yPos += 6;
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, yPos);
    yPos += 12;

    // Summary
    checkPageBreak(20);
    doc.setFontSize(13);
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', margin, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    const summaryLines = doc.splitTextToSize(roadmap.summary, pageWidth - 2 * margin);
    doc.text(summaryLines, margin, yPos);
    yPos += summaryLines.length * lineHeight + 4;

    // Focus Areas
    checkPageBreak(15);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(50, 50, 50);
    doc.text('Key Focus Areas', margin, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    roadmap.focusAreas.forEach((area) => {
      checkPageBreak(6);
      doc.text(`• ${area}`, margin + 5, yPos);
      yPos += 6;
    });

    yPos += 4;

    // Assessment Results
    checkPageBreak(20);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(50, 50, 50);
    doc.text('Assessment Results', margin, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(`Score: ${quizResult.score} / ${quizResult.totalQuestions} (${quizResult.percentage}%)`, margin, yPos);
    yPos += 8;

    if (quizResult.strongAreas.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Strong Areas:', margin, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      quizResult.strongAreas.forEach((area) => {
        checkPageBreak(6);
        doc.text(`✓ ${area}`, margin + 5, yPos);
        yPos += 6;
      });
      yPos += 2;
    }

    if (quizResult.weakAreas.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Areas to Focus On:', margin, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      quizResult.weakAreas.forEach((area) => {
        checkPageBreak(6);
        doc.text(`→ ${area}`, margin + 5, yPos);
        yPos += 6;
      });
    }

    yPos += 6;

    // Learning Steps
    roadmap.steps.forEach((step, stepIndex) => {
      checkPageBreak(15);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(102, 126, 234);
      doc.text(`Step ${stepIndex + 1}: ${step.title}`, margin, yPos);
      yPos += 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      const descLines = doc.splitTextToSize(step.description, pageWidth - 2 * margin);
      doc.text(descLines, margin, yPos);
      yPos += descLines.length * lineHeight + 4;

      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'italic');
      doc.text(`Estimated Time: ${step.estimatedTime}`, margin, yPos);
      yPos += 7;

      // Resources
      if (step.resources && step.resources.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(50, 50, 50);
        doc.text('Resources:', margin, yPos);
        yPos += 6;

        step.resources.forEach((resource) => {
          checkPageBreak(8);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          const premiumLabel = resource.isPremium ? ' [PREMIUM]' : ' [FREE]';
          if (resource.isPremium) {
            doc.setTextColor(255, 152, 0);
          } else {
            doc.setTextColor(76, 175, 80);
          }
          doc.text(`• ${resource.title}${premiumLabel}`, margin + 5, yPos);
          yPos += 5;

          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          const resLines = doc.splitTextToSize(resource.description, pageWidth - 20);
          doc.text(resLines, margin + 10, yPos);
          yPos += resLines.length * 4 + 2;

          doc.setFont('helvetica', 'italic');
          doc.text(`Type: ${resource.type}`, margin + 10, yPos);
          yPos += 4;
        });
      }

      yPos += 4;
    });

    // Footer
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${i} of ${totalPages}`,
        pageWidth / 2,
        pageHeight - 5,
        { align: 'center' }
      );
    }

    // Save PDF
    doc.save(`LearnMap_${roadmap.topic.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🗺️ LearnMap.ai</h1>
        <p>Your Personal AI-Powered Learning Roadmap</p>
      </header>

      <main className="main-content">
        {/* Initial Input Form */}
        {!quiz && !roadmap && (
          <section className="input-section">
            <form onSubmit={handleInitialSubmit} className="form">
              <div className="form-group">
                <label htmlFor="topic">What do you want to learn?</label>
                <input
                  type="text"
                  id="topic"
                  placeholder="e.g., Machine Learning, Web Development, Data Science"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="timeline">How long do you want to learn?</label>
                <select
                  id="timeline"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  required
                >
                  <option value="">Select a timeline</option>
                  <option value="1week">1 Week</option>
                  <option value="2weeks">2 Weeks</option>
                  <option value="1month">1 Month</option>
                  <option value="3months">3 Months</option>
                  <option value="6months">6 Months</option>
                  <option value="1year">1 Year</option>
                </select>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Starting Assessment...' : 'Start Knowledge Assessment'}
              </button>
            </form>

            {error && <div className="error-message">{error}</div>}
          </section>
        )}

        {/* Quiz Section */}
        {quiz && !roadmap && (
          <section className="quiz-section">
            <div className="quiz-header">
              <h2>Knowledge Assessment: {topic}</h2>
              <div className="quiz-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${((currentQuestionIndex + 1) / quiz.length) * 100}%`,
                    }}
                  />
                </div>
                <p>Question {currentQuestionIndex + 1} of {quiz.length}</p>
              </div>
            </div>

            <div className="quiz-content">
              <h3>{quiz[currentQuestionIndex].question}</h3>
              <div className="options">
                {quiz[currentQuestionIndex].options.map((option, idx) => (
                  <button
                    key={idx}
                    className={`option ${
                      answers[currentQuestionIndex] === idx ? 'selected' : ''
                    }`}
                    onClick={() => handleQuizAnswer(idx)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="quiz-navigation">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="nav-btn"
              >
                ← Previous
              </button>
              {currentQuestionIndex === quiz.length - 1 ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={loading || Object.keys(answers).length < quiz.length}
                  className="submit-btn"
                >
                  {loading ? 'Generating Roadmap...' : 'Submit & Generate Roadmap'}
                </button>
              ) : (
                <button onClick={handleNextQuestion} className="nav-btn">
                  Next →
                </button>
              )}
            </div>

            {error && <div className="error-message">{error}</div>}
          </section>
        )}

        {/* Results and Roadmap Section */}
        {roadmap && (
          <section className="results-section">
            {quizResult && (
              <div className="quiz-results">
                <h2>Assessment Results</h2>
                <div className="score-display">
                  <div className="score-circle">
                    <span className="score-percent">{quizResult.percentage}%</span>
                  </div>
                  <div className="score-details">
                    <p>You scored {quizResult.score} out of {quizResult.totalQuestions}</p>
                  </div>
                </div>

                {quizResult.strongAreas.length > 0 && (
                  <div className="areas-box strong">
                    <h4>✅ Strong Areas</h4>
                    <ul>
                      {quizResult.strongAreas.map((area, idx) => (
                        <li key={idx}>{area}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {quizResult.weakAreas.length > 0 && (
                  <div className="areas-box weak">
                    <h4>📚 Areas to Focus On</h4>
                    <ul>
                      {quizResult.weakAreas.map((area, idx) => (
                        <li key={idx}>{area}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="roadmap-section">
              <div className="roadmap-header">
                <h2>Your Personalized Learning Roadmap</h2>
                <div className="roadmap-meta">
                  <span>🎯 Topic: {roadmap.topic}</span>
                  <span>📅 Timeline: {roadmap.timeline}</span>
                  <span>📊 Assessment Score: {roadmap.assessmentScore}%</span>
                </div>
              </div>

              <p className="roadmap-summary">{roadmap.summary}</p>

              {roadmap.focusAreas.length > 0 && (
                <div className="focus-areas">
                  <h3>Key Focus Areas</h3>
                  <div className="focus-tags">
                    {roadmap.focusAreas.map((area, idx) => (
                      <span key={idx} className="tag">{area}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="roadmap-steps">
                {roadmap.steps.map((step, index) => (
                  <div key={index} className="step-card">
                    <div className="step-number">{index + 1}</div>
                    <div className="step-content">
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                      <div className="step-details">
                        <span className="time">⏱️ {step.estimatedTime}</span>
                      </div>
                      {step.resources && step.resources.length > 0 && (
                        <div className="resources">
                          <h4>Resources:</h4>
                          <ul className="resource-list">
                            {step.resources.map((resource, idx) => (
                              <li key={idx} className={`resource-item ${resource.isPremium ? 'premium' : 'free'}`}>
                                <div className="resource-header">
                                  <span className="resource-title">{resource.title}</span>
                                  <span className="resource-badge">
                                    {resource.isPremium ? '🔒 Premium' : '✓ Free'}
                                  </span>
                                </div>
                                <p className="resource-description">{resource.description}</p>
                                <span className="resource-type">{resource.type}</span>
                                {resource.isPremium && (
                                  <p className="premium-notice">Unlock with LearnMap Pro to access detailed content</p>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="roadmap-actions">
                <button
                  onClick={downloadRoadmap}
                  className="download-btn pro-feature"
                  title="Download your comprehensive roadmap - LearnMap Pro feature"
                >
                  📥 Download Roadmap (Pro)
                </button>
                <button
                  onClick={() => {
                    setRoadmap(null);
                    setQuizResult(null);
                    setTopic('');
                    setTimeline('');
                    setCurrentQuestionIndex(0);
                    setAnswers({});
                  }}
                  className="reset-btn"
                >
                  Create Another Roadmap
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
