import React, { useState } from 'react';

type Message = {
  role: 'tutor' | 'user';
  text: string;
};

type ConversationHistoryItem = {
  role: 'user' | 'tutor';
  content: string;
};

export default function TutorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [currentImageB64, setCurrentImageB64] = useState<string | null>(null); // CHANGED: Added base64 image state
  const [isLoadingTutor, setIsLoadingTutor] = useState<boolean>(false);
  const [isLoadingDiagram, setIsLoadingDiagram] = useState<boolean>(false);
  const [equationInput, setEquationInput] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [currentEquation, setCurrentEquation] = useState<string>('');
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [conversationHistory, setConversationHistory] = useState<ConversationHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastDiagramPrompt, setLastDiagramPrompt] = useState<string | null>(null); // CHANGED: Track last diagram prompt for retry
  const [diagramError, setDiagramError] = useState<string | null>(null); // CHANGED: Separate error state for diagram (non-blocking)

  const sampleEquations = [
    '2x + 3 = 11',
    '3(x - 2) = 9',
    '5x = 20'
  ];

  // CHANGED: Helper function to fetch diagram - handles base64 (preferred) and URL (fallback)
  // Can be called from tutor response or retry button
  const fetchDiagram = async (prompt: string) => {
    setIsLoadingDiagram(true);
    setDiagramError(null);
    try {
      const diagramResponse = await fetch('/api/diagram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
        }),
      });

      // Diagram API always returns 200, check image_b64 (preferred) and image_url (fallback)
      const diagramData = await diagramResponse.json();
      
      if (diagramData.image_b64) {
        // CHANGED: Use base64 image (most reliable, no remote URL dependency)
        setCurrentImageB64(diagramData.image_b64);
        setCurrentImageUrl(null);
        setDiagramError(null);
      } else if (diagramData.image_url) {
        // Fallback to URL if base64 not available
        setCurrentImageUrl(diagramData.image_url);
        setCurrentImageB64(null);
        setDiagramError(null);
      } else {
        // Both missing - diagram generation failed
        setCurrentImageB64(null);
        setCurrentImageUrl(null);
        setDiagramError(diagramData.error || 'Diagram generation failed');
        // Do NOT set main error state - diagram failures are non-blocking
      }
    } catch (diagramError) {
      // Network or parsing error - still non-blocking
      console.error('Diagram fetch error:', diagramError);
      setCurrentImageB64(null);
      setCurrentImageUrl(null);
      setDiagramError('Network error fetching diagram');
      // Do NOT set main error state - diagram failures should not show error banner
    } finally {
      setIsLoadingDiagram(false);
    }
  };

  const handleSend = async (equation: string, userMessage: string = '', isNewLesson: boolean = false) => {
    if (isLoadingTutor) return;

    setIsLoadingTutor(true);
    setError(null);
    try {
      // Build conversation history for API
      const historyForApi: ConversationHistoryItem[] = isNewLesson 
        ? [] 
        : [...conversationHistory];

      // Add user message to history if provided
      if (userMessage) {
        historyForApi.push({
          role: 'user',
          content: userMessage
        });
      }

      // Call /api/tutor
      const tutorResponse = await fetch('/api/tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          equation: equation,
          user_message: userMessage || undefined,
          conversation_history: historyForApi,
        }),
      });

      // Read error from JSON response and show in UI instead of generic "Internal server error"
      if (!tutorResponse.ok) {
        let errorMessage = 'Failed to get tutor response';
        try {
          const errorData = await tutorResponse.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          // If response isn't JSON, use status text
          errorMessage = `Error ${tutorResponse.status}: ${tutorResponse.statusText}`;
        }
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      const tutorData = await tutorResponse.json();

      // Update conversation history with tutor responses
      const updatedHistory: ConversationHistoryItem[] = [...historyForApi];
      
      if (tutorData.tutor_explanation) {
        updatedHistory.push({
          role: 'tutor',
          content: tutorData.tutor_explanation
        });
      }

      if (tutorData.thinking_question) {
        updatedHistory.push({
          role: 'tutor',
          content: tutorData.thinking_question
        });
      }

      setConversationHistory(updatedHistory);

      // Update messages for display
      const newMessages: Message[] = [];
      
      if (tutorData.tutor_explanation) {
        newMessages.push({
          role: 'tutor',
          text: tutorData.tutor_explanation
        });
      }

      if (tutorData.thinking_question) {
        newMessages.push({
          role: 'tutor',
          text: tutorData.thinking_question
        });
      }

      setMessages(prev => [...prev, ...newMessages]);

      // Update completion status
      setIsComplete(tutorData.is_complete || false);

      // Call /api/diagram if diagram_prompt is provided
      // CHANGED: Now handles base64 images (preferred) and URL (fallback), tracks last prompt for retry
      if (tutorData.diagram_prompt) {
        setLastDiagramPrompt(tutorData.diagram_prompt);
        await fetchDiagram(tutorData.diagram_prompt);
      }

    } catch (error) {
      console.error('Error in handleSend:', error);
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      setError(errorMessage);
      // Add error message to chat
      setMessages(prev => [...prev, {
        role: 'tutor',
        text: `⚠️ Error: ${errorMessage}`
      }]);
    } finally {
      setIsLoadingTutor(false);
    }
  };

  const handleStartLesson = async () => {
    if (equationInput.trim() && !isLoadingTutor) {
      const equation = equationInput.trim();
      setCurrentEquation(equation);
      setMessages([]);
      setConversationHistory([]);
      setIsComplete(false);
      setCurrentImageUrl(null);
      setCurrentImageB64(null); // CHANGED: Clear base64 image on new lesson
      setDiagramError(null);
      setLastDiagramPrompt(null);
      setError(null);
      setEquationInput('');
      
      // Add user message showing the equation
      setMessages([{
        role: 'user',
        text: `Let's solve: ${equation}`
      }]);

      await handleSend(equation, '', true);
    }
  };

  const handleSampleEquation = (equation: string) => {
    setEquationInput(equation);
  };

  const handleUserReply = async () => {
    if (userInput.trim() && !isLoadingTutor && !isComplete && currentEquation) {
      const userMessage = userInput.trim();
      setUserInput('');
      setError(null);
      
      // Add user message to display
      setMessages(prev => [...prev, {
        role: 'user',
        text: userMessage
      }]);

      await handleSend(currentEquation, userMessage, false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      callback();
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @media (max-width: 768px) {
            .main-container {
              flex-direction: column !important;
            }
            .chat-panel {
              border-right: none !important;
              border-bottom: 1px solid #e5e7eb !important;
            }
            .diagram-panel {
              width: 100% !important;
              border-left: none !important;
              max-height: 50vh !important;
            }
          }
        `
      }} />
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#f9fafb'
      }}>
        {/* Header */}
        <header style={{
          padding: '1.25rem 2rem',
          borderBottom: '2px solid #e5e7eb',
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '1.75rem', 
            fontWeight: 700,
            color: '#1f2937',
            letterSpacing: '-0.025em'
          }}>
            Equations as Balance & Undo Tutor
          </h1>
        </header>

        {/* Error Banner */}
        {error && (
          <div style={{
            padding: '0.75rem 2rem',
            backgroundColor: '#fee2e2',
            borderBottom: '1px solid #fecaca',
            color: '#991b1b',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>⚠️</span>
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                color: '#991b1b',
                cursor: 'pointer',
                fontSize: '1.25rem',
                padding: '0 0.5rem'
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="main-container" style={{ 
          display: 'flex', 
          flex: 1, 
          overflow: 'hidden',
          backgroundColor: '#f9fafb'
        }}>
          {/* Left Panel - Chat */}
          <div className="chat-panel" style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            borderRight: '1px solid #e5e7eb',
            backgroundColor: '#ffffff',
            minWidth: 0
          }}>
            {/* Section Title */}
            <div style={{
              padding: '1rem 1.5rem',
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb'
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#374151'
              }}>
                Interactive Tutor
              </h2>
            </div>

            {/* Sample Equation Buttons */}
            <div style={{
              padding: '1rem 1.5rem',
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: '#ffffff'
            }}>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#6b7280',
                marginBottom: '0.75rem'
              }}>
                Try a sample equation:
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {sampleEquations.map((eq, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSampleEquation(eq)}
                    disabled={isLoadingTutor || isLoadingDiagram}
                    style={{
                      padding: '0.625rem 1.25rem',
                      backgroundColor: '#ffffff',
                      color: '#3b82f6',
                      border: '2px solid #3b82f6',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      cursor: (isLoadingTutor || isLoadingDiagram) ? 'not-allowed' : 'pointer',
                      opacity: (isLoadingTutor || isLoadingDiagram) ? 0.5 : 1,
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoadingTutor && !isLoadingDiagram) {
                        e.currentTarget.style.backgroundColor = '#eff6ff';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoadingTutor && !isLoadingDiagram) {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {eq}
                  </button>
                ))}
              </div>
            </div>

            {/* Equation Input Section */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: '#ffffff'
            }}>
              <label style={{
                display: 'block',
                marginBottom: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151'
              }}>
                Or enter your own equation:
              </label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  type="text"
                  value={equationInput}
                  onChange={(e) => setEquationInput(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleStartLesson)}
                  placeholder="e.g., 2x + 3 = 11"
                  disabled={isLoadingTutor || isLoadingDiagram}
                  style={{
                    flex: 1,
                    padding: '0.875rem 1rem',
                    border: '2px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    opacity: (isLoadingTutor || isLoadingDiagram) ? 0.6 : 1
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                  }}
                />
                <button
                  onClick={handleStartLesson}
                  disabled={isLoadingTutor || isLoadingDiagram || !equationInput.trim()}
                  style={{
                    padding: '0.875rem 1.75rem',
                    backgroundColor: '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: (isLoadingTutor || isLoadingDiagram || !equationInput.trim()) ? 'not-allowed' : 'pointer',
                    opacity: (isLoadingTutor || isLoadingDiagram || !equationInput.trim()) ? 0.6 : 1,
                    transition: 'all 0.2s',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoadingTutor && !isLoadingDiagram && equationInput.trim()) {
                      e.currentTarget.style.backgroundColor = '#2563eb';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoadingTutor && !isLoadingDiagram && equationInput.trim()) {
                      e.currentTarget.style.backgroundColor = '#3b82f6';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
                    }
                  }}
                >
                  {isLoadingTutor ? 'Starting...' : 'Start Lesson'}
                </button>
              </div>
            </div>

          {/* Chat Area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            backgroundColor: '#fafafa'
          }}>
            {messages.length === 0 ? (
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9ca3af',
                fontSize: '0.9375rem',
                textAlign: 'center',
                padding: '2rem'
              }}>
                Select a sample equation above or enter your own to begin learning!
              </div>
            ) : (
              <>
                {messages.map((message, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                      alignItems: 'flex-start',
                      gap: '0.5rem'
                    }}
                  >
                    {message.role === 'tutor' && (
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#6366f1',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        flexShrink: 0
                      }}>
                        T
                      </div>
                    )}
                    <div
                      style={{
                        maxWidth: '75%',
                        padding: '0.875rem 1.125rem',
                        borderRadius: message.role === 'user' ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
                        backgroundColor: message.role === 'user' ? '#3b82f6' : '#ffffff',
                        color: message.role === 'user' ? '#ffffff' : '#1f2937',
                        fontSize: '0.9375rem',
                        lineHeight: '1.6',
                        boxShadow: message.role === 'user' 
                          ? '0 2px 4px rgba(59, 130, 246, 0.2)' 
                          : '0 1px 3px rgba(0,0,0,0.1)',
                        border: message.role === 'tutor' ? '1px solid #e5e7eb' : 'none'
                      }}
                    >
                      {message.text}
                    </div>
                    {message.role === 'user' && (
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#3b82f6',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        flexShrink: 0
                      }}>
                        U
                      </div>
                    )}
                  </div>
                ))}
                {isComplete && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '0.5rem'
                  }}>
                    <div
                      style={{
                        padding: '1rem 1.5rem',
                        borderRadius: '0.75rem',
                        backgroundColor: '#d1fae5',
                        color: '#065f46',
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        border: '2px solid #10b981',
                        boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
                      }}
                    >
                      🎉 Lesson complete! Great job!
                    </div>
                  </div>
                )}
              </>
            )}
            {isLoadingTutor && (
              <div style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: '0.5rem'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#6366f1',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  flexShrink: 0
                }}>
                  T
                </div>
                <div
                  style={{
                    padding: '0.875rem 1.125rem',
                    borderRadius: '1rem 1rem 1rem 0.25rem',
                    backgroundColor: '#ffffff',
                    color: '#6b7280',
                    fontSize: '0.9375rem',
                    border: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#6366f1',
                    animation: 'pulse 1.5s ease-in-out infinite'
                  }}></span>
                  Thinking...
                </div>
              </div>
            )}
          </div>

          {/* User Input Section */}
          <div style={{
            padding: '1.5rem',
            borderTop: '2px solid #e5e7eb',
            backgroundColor: '#ffffff'
          }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleUserReply)}
                placeholder={isComplete ? "Lesson complete! Start a new lesson above." : "Type your reply..."}
                disabled={isLoadingTutor || isLoadingDiagram || isComplete || !currentEquation}
                style={{
                  flex: 1,
                  padding: '0.875rem 1rem',
                  border: '2px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  opacity: (isLoadingTutor || isLoadingDiagram || isComplete || !currentEquation) ? 0.6 : 1
                }}
                onFocus={(e) => {
                  if (!isLoadingTutor && !isLoadingDiagram && !isComplete && currentEquation) {
                    e.currentTarget.style.borderColor = '#10b981';
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                }}
              />
              <button
                onClick={handleUserReply}
                disabled={isLoadingTutor || isLoadingDiagram || !userInput.trim() || isComplete || !currentEquation}
                style={{
                  padding: '0.875rem 1.75rem',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: (isLoadingTutor || isLoadingDiagram || !userInput.trim() || isComplete || !currentEquation) ? 'not-allowed' : 'pointer',
                  opacity: (isLoadingTutor || isLoadingDiagram || !userInput.trim() || isComplete || !currentEquation) ? 0.6 : 1,
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  if (!isLoadingTutor && !isLoadingDiagram && userInput.trim() && !isComplete && currentEquation) {
                    e.currentTarget.style.backgroundColor = '#059669';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoadingTutor && !isLoadingDiagram && userInput.trim() && !isComplete && currentEquation) {
                    e.currentTarget.style.backgroundColor = '#10b981';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
                  }
                }}
              >
                {isLoadingTutor ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Diagram Image */}
        <div className="diagram-panel" style={{
          width: '450px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          borderLeft: '1px solid #e5e7eb',
          minWidth: 0
        }}>
          <div style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb'
          }}>
            <h2 style={{
              margin: 0,
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#374151'
            }}>
              Visual Diagram
            </h2>
          </div>
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            backgroundColor: '#fafafa',
            position: 'relative',
            minHeight: '300px'
          }}>
            {isLoadingDiagram ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                color: '#6b7280'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  border: '4px solid #e5e7eb',
                  borderTopColor: '#6366f1',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                  Generating diagram...
                </div>
              </div>
            ) : currentImageB64 ? (
              // CHANGED: Use base64 image (preferred, most reliable)
              <img
                src={`data:image/png;base64,${currentImageB64}`}
                alt="Equation diagram"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
            ) : currentImageUrl ? (
              // Fallback to URL if base64 not available
              <img
                src={currentImageUrl}
                alt="Equation diagram"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
            ) : messages.length > 0 ? (
              // Show styled fallback when diagram generation fails (after lesson has started)
              // CHANGED: Added retry button if lastDiagramPrompt exists
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                backgroundColor: '#fef3c7',
                border: '2px solid #fbbf24',
                borderRadius: '0.75rem',
                color: '#92400e',
                textAlign: 'center',
                gap: '1rem'
              }}>
                <div style={{ fontSize: '2rem' }}>📊</div>
                <div style={{ 
                  fontWeight: 600, 
                  fontSize: '0.9375rem'
                }}>
                  Diagram unavailable — showing explanation only
                </div>
                {diagramError && (
                  <div style={{ 
                    fontSize: '0.75rem',
                    opacity: 0.7,
                    fontStyle: 'italic'
                  }}>
                    {diagramError}
                  </div>
                )}
                {lastDiagramPrompt && (
                  <button
                    onClick={() => fetchDiagram(lastDiagramPrompt)}
                    disabled={isLoadingDiagram}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#f59e0b',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      cursor: isLoadingDiagram ? 'not-allowed' : 'pointer',
                      opacity: isLoadingDiagram ? 0.6 : 1,
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoadingDiagram) {
                        e.currentTarget.style.backgroundColor = '#d97706';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoadingDiagram) {
                        e.currentTarget.style.backgroundColor = '#f59e0b';
                      }
                    }}
                  >
                    {isLoadingDiagram ? 'Retrying...' : 'Retry diagram'}
                  </button>
                )}
                <div style={{ 
                  fontSize: '0.875rem',
                  opacity: 0.8
                }}>
                  You can continue learning with the text explanation above.
                </div>
              </div>
            ) : (
              // Initial empty state before lesson starts
              <div style={{
                color: '#9ca3af',
                fontSize: '0.9375rem',
                textAlign: 'center',
                padding: '2rem'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                <div style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Diagram will appear here</div>
                <div style={{ fontSize: '0.875rem' }}>Start a lesson to see visual explanations</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `
      }} />
    </div>
    </>
  );
}

