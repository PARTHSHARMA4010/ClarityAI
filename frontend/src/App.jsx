import './App.css';
import { useState } from 'react';

function App() {
  const [submissions, setSubmissions] = useState('');
  const [clusters, setClusters] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = () => {
    console.log("Starting analysis for:", submissions);
    // We will connect to the backend here in the next step.
  };

  return (
    <div>
      <header>
        <h1>Clarity AI</h1>
        <p>Paste student submissions below, one per line.</p>
      </header>
      <main>
        <textarea
          value={submissions}
          onChange={(e) => setSubmissions(e.target.value)}
          placeholder="Submission 1&#10;Submission 2&#10;Submission 3"
          rows="10"
        />
        <button onClick={handleAnalyze}>
          Analyze Submissions
        </button>
      </main>
    </div>
  );
}

export default App;