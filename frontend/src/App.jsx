import { useState } from 'react';
import './App.css';

function App() {
  const [submissions, setSubmissions] = useState('');
  const [clusters, setClusters] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setClusters(null);

    const submissionArray = submissions.split('\n').filter(line => line.trim() !== '');

    if (submissionArray.length === 0) {
      setError("Please enter at least one submission.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ submissions: submissionArray }),
      });

      if (!response.ok) {
        throw new Error('Something went wrong with the server.');
      }

      const data = await response.json();
      setClusters(data.clusters);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <header>
        <h1>Clarity AI ✨</h1>
        <p>Paste student submissions below, one per line, to uncover hidden patterns.</p>
      </header>
      <main>
        <textarea
          value={submissions}
          onChange={(e) => setSubmissions(e.target.value)}
          placeholder="The capital of France is Paris.&#10;France's capital city is Paris.&#10;I think Paris is the capital of Italy."
          rows="10"
          disabled={isLoading}
        />
        <button onClick={handleAnalyze} disabled={isLoading}>
          {isLoading ? 'Analyzing...' : 'Analyze Submissions'}
        </button>
      </main>

      {error && <div className="error-message">{error}</div>}

      {isLoading && <div className="loading-spinner"></div>}

      {clusters && (
        <div className="results-container">
          <h2>Analysis Results</h2>
          {clusters.map((cluster, index) => (
            <div key={index} className="cluster">
              <h3>{cluster.title}</h3>
              <p className="explanation">{cluster.explanation}</p>
              <h4>Example Submissions:</h4>
              <ul>
                {cluster.examples.map((example, i) => (
                  <li key={i}>"{example}"</li>
                ))}
              </ul>
              <div className="action-plan">
                <h4>Action Plan:</h4>
                <p>{cluster.actionPlan.suggestion}</p>
                <h5>Quick Quiz:</h5>
                <ol>
                  {cluster.actionPlan.quiz.map((q, i) => (
                    <li key={i}>{q.question}</li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;