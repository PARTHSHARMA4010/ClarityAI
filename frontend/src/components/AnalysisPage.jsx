import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './AnalysisPage.css';

ChartJS.register(ArcElement, Tooltip, Legend);

// --- THIS IS OUR HARDCODED "PERFECT" AI RESPONSE ---
const mockReport = {
  stats: {
    totalSubmissions: 12,
    correct: 8,
    incorrect: 4,
    misconceptionCount: 2,
  },
  clusters: [
    {
      title: "Confusion between 'Mitosis' and 'Meiosis'",
      explanation: "A significant number of students are incorrectly using the terms interchangeably or confusing the outcomes of each process.",
      studentCount: 3,
      examples: [
        "'Meiosis results in two identical daughter cells.'",
        "'Plants use mitosis to produce seeds.'",
      ],
      actionPlan: {
        suggestion: "Use a Venn diagram to visually compare and contrast the two processes, focusing on the number of divisions and the chromosome number in the resulting cells.",
        quiz: [
          { question: "Which process creates genetically identical cells?" },
          { question: "How many cells are produced at the end of meiosis?" },
        ]
      }
    },
    {
      title: "Misunderstanding of Photosynthesis Inputs",
      explanation: "One student incorrectly identified the inputs for photosynthesis.",
      studentCount: 1,
      examples: [
        "'Plants make food using only sunlight and water.'",
      ],
      actionPlan: {
        suggestion: "Review the chemical equation for photosynthesis, emphasizing the role of Carbon Dioxide (CO2) as a key reactant.",
        quiz: [
          { question: "What are the three main 'ingredients' for photosynthesis?" },
        ]
      }
    }
  ]
};

function AnalysisPage() {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const { assignmentId } = useParams();

  const handleAnalysis = () => {
    setIsLoading(true);
    setReport(null);

    // --- SIMULATED AI LOADING SEQUENCE ---
    setLoadingMessage('Step 1/4: Analyzing 12 student submissions...');
    setTimeout(() => {
      setLoadingMessage('Step 2/4: Identifying common patterns...');
      setTimeout(() => {
        setLoadingMessage('Step 3/4: Clustering misconceptions...');
        setTimeout(() => {
          setLoadingMessage('Step 4/4: Generating final report...');
          setTimeout(() => {
            setReport(mockReport);
            setIsLoading(false);
          }, 1500);
        }, 2000);
      }, 2000);
    }, 1500);
  };

  const chartData = {
    labels: report ? report.clusters.map(c => c.title) : [],
    datasets: [{
      label: '# of Students',
      data: report ? report.clusters.map(c => c.studentCount) : [],
      backgroundColor: ['rgba(52, 152, 219, 0.7)', 'rgba(231, 76, 60, 0.7)'],
      borderColor: ['rgba(52, 152, 219, 1)', 'rgba(231, 76, 60, 1)'],
      borderWidth: 1,
    }]
  };

  return (
    <div className="analysis-container">
      <div className="analysis-header">
        <h2>Analysis for Assignment</h2>
        <Link to={`/assignment/${assignmentId}/submissions`} className="view-submissions-link">
          View All Submissions
        </Link>
      </div>
      
      {!report && (
        <button onClick={handleAnalysis} disabled={isLoading} className="analyze-button large">
          {isLoading ? loadingMessage : '✨ Generate AI Report'}
        </button>
      )}

      {isLoading && <div className="loading-dots"><div></div><div></div><div></div></div>}

      {report && (
        <div className="report-view">
          {/* --- STATS SECTION --- */}
          <div className="report-section stats-grid">
            <div className="stat-item">
              <h4>Overall Understanding</h4>
              <div className="progress-bar">
                <div 
                  className="progress-correct" 
                  style={{ width: `${(report.stats.correct / report.stats.totalSubmissions) * 100}%` }}
                >
                  {report.stats.correct} Correct
                </div>
                <div 
                  className="progress-incorrect" 
                  style={{ width: `${(report.stats.incorrect / report.stats.totalSubmissions) * 100}%` }}
                >
                  {report.stats.incorrect} Incorrect
                </div>
              </div>
            </div>
            <div className="stat-item">
              <h4>Misconception Groups</h4>
              <p><span>{report.stats.misconceptionCount}</span> common issues found</p>
            </div>
          </div>

          {/* --- CHART & CLUSTERS SECTION --- */}
          <div className="report-section chart-and-clusters">
            <div className="chart-container">
              <h4>Misconception Distribution</h4>
              <Doughnut data={chartData} />
            </div>
            <div className="clusters-container">
              <h4>Key Insights</h4>
              {report.clusters.map((cluster, index) => (
                <div key={index} className="cluster">
                  <h5>{index + 1}. {cluster.title} ({cluster.studentCount} students)</h5>
                  <p className="explanation">{cluster.explanation}</p>
                  <h6>Example from Submissions:</h6>
                  <ul>{cluster.examples.map((ex, i) => <li key={i}>{ex}</li>)}</ul>
                  <div className="action-plan">
                    <h6>Suggested Action Plan:</h6>
                    <p>{cluster.actionPlan.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalysisPage;