import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import './index.css'

function App() {
  const [stage, setStage] = useState('input')
  const [thoughts, setThoughts] = useState('')
  const [results, setResults] = useState({
    classify: null,
    prioritize: null,
    convert: null,
    release: null
  })
  const [loading, setLoading] = useState(false)
  const [modelStatus, setModelStatus] = useState('checking')
  const resultsEndRef = useRef(null)

  useEffect(() => {
    checkModelStatus()
  }, [])

  useEffect(() => {
    resultsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [results, loading])

  const checkModelStatus = async () => {
    try {
      const response = await axios.get('/api/status')
      setModelStatus(response.data.status)
    } catch (error) {
      setModelStatus('error')
      console.error('Model status check failed:', error)
    }
  }

  const handleProcessThoughts = async (nextStage) => {
    if (!thoughts.trim() || loading) return

    setLoading(true)
    let contentToProcess = thoughts
    if (nextStage !== 'classify') {
      contentToProcess = results[stage] || thoughts
    }

    try {
      const response = await axios.post('/api/process-thoughts', {
        thoughts: contentToProcess,
        stage: nextStage
      })

      const newResults = { ...results, [nextStage]: response.data.response }
      setResults(newResults)
      setStage(nextStage)
    } catch (error) {
      console.error('Error:', error)
      alert('Error processing thoughts. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setThoughts('')
    setResults({ classify: null, prioritize: null, convert: null, release: null })
    setStage('input')
  }

  const renderStageContent = () => {
    switch (stage) {
      case 'input':
        return (
          <div className="stage-container">
            <div className="stage-header">
              <h2>🧠 Uncluttered</h2>
              <p>Transform your messy thoughts into clarity and action</p>
            </div>

            <div className="input-section">
              <label htmlFor="thoughts-input">
                <strong>Your Thought Dump</strong>
                <span className="subtitle">Write out everything on your mind—messy, unfiltered, and incomplete thoughts welcome</span>
              </label>
              <textarea
                id="thoughts-input"
                value={thoughts}
                onChange={(e) => setThoughts(e.target.value)}
                placeholder="Example: Need to call mom... should exercise more... worried about budget... want to learn coding... feeling overwhelmed... should organize desk... dreaming of travel... can't focus at work..."
                className="thoughts-textarea"
                disabled={loading || modelStatus !== 'ready'}
              />
              <div className="button-group">
                <button
                  onClick={() => handleProcessThoughts('classify')}
                  disabled={loading || !thoughts.trim() || modelStatus !== 'ready'}
                  className="btn btn-primary"
                >
                  {loading ? '⏳ Processing...' : '📊 Classify My Thoughts'}
                </button>
              </div>
            </div>

            {modelStatus !== 'ready' && (
              <div className="warning-box">
                ⚠️ Model is {modelStatus === 'checking' ? 'checking' : 'offline'}. Please wait or ensure Ollama is running.
              </div>
            )}

            <div className="info-box">
              <h3>How it works:</h3>
              <ul>
                <li><strong>Classify:</strong> Organize your thoughts into meaningful categories</li>
                <li><strong>Prioritize:</strong> Identify what truly matters</li>
                <li><strong>Convert:</strong> Turn ideas into concrete action steps</li>
                <li><strong>Release:</strong> Create a ritual to let go of what doesn't serve you</li>
              </ul>
            </div>
          </div>
        )

      case 'classify':
        return (
          <StageView
            title="📊 Classified Thoughts"
            description="Your thoughts have been organized into categories"
            content={results.classify}
            loading={loading}
            onNext={() => handleProcessThoughts('prioritize')}
            onReset={handleReset}
          />
        )

      case 'prioritize':
        return (
          <StageView
            title="⭐ Prioritized Thoughts"
            description="What truly matters has been identified"
            content={results.prioritize}
            loading={loading}
            onNext={() => handleProcessThoughts('convert-to-actions')}
            onPrev={() => setStage('classify')}
            onReset={handleReset}
          />
        )

      case 'convert':
        return (
          <StageView
            title="✅ Action Plan"
            description="Your high-priority items are now actionable"
            content={results.convert}
            loading={loading}
            onNext={() => handleProcessThoughts('release-ritual')}
            onPrev={() => setStage('prioritize')}
            onReset={handleReset}
          />
        )

      case 'release':
        return (
          <StageView
            title="🕊️ Release Ritual"
            description="A sacred moment to let go of what no longer serves you"
            content={results.release}
            loading={loading}
            isLast={true}
            onReset={handleReset}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Uncluttered</h1>
        <div className={`status ${modelStatus}`}>
          {modelStatus === 'ready' && '✓ Ready'}
          {modelStatus === 'checking' && '⏳ Checking...'}
          {modelStatus === 'error' && '✗ Offline'}
        </div>
      </header>

      <main className="app-content">
        {stage !== 'input' && (
          <div className="progress-bar">
            <div className={`progress-step ${['input', 'classify'].includes(stage) ? 'active' : ''}`}>1. Classify</div>
            <div className={`progress-step ${stage === 'prioritize' ? 'active' : ''}`}>2. Prioritize</div>
            <div className={`progress-step ${stage === 'convert' ? 'active' : ''}`}>3. Convert</div>
            <div className={`progress-step ${stage === 'release' ? 'active' : ''}`}>4. Release</div>
          </div>
        )}
        {renderStageContent()}
      </main>

      <div ref={resultsEndRef} />
    </div>
  )
}

function StageView({ title, description, content, loading, onNext, onPrev, onReset, isLast = false }) {
  return (
    <div className="stage-container">
      <div className="stage-header">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Processing your thoughts...</p>
        </div>
      ) : (
        <>
          <div className="result-box">
            <div className="result-content">
              {content}
            </div>
          </div>

          <div className="button-group">
            {onPrev && (
              <button onClick={onPrev} className="btn btn-secondary">
                ← Previous
              </button>
            )}
            {onNext && (
              <button onClick={onNext} className="btn btn-primary">
                Next →
              </button>
            )}
            {isLast && (
              <button onClick={onReset} className="btn btn-success">
                🔄 Start Over
              </button>
            )}
            {!isLast && (
              <button onClick={onReset} className="btn btn-secondary">
                Reset
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default App
