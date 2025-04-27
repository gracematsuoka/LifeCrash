import React, { useEffect } from 'react';

interface Prediction {
  crisisAge: number;
  severity: number;
  type: string;
  stepsToPrevent?: string;
  prediction?: number;
}

interface ResultsProps {
  prediction: Prediction;
  handleStartOver: () => void;
}

const Results: React.FC<ResultsProps> = ({ prediction, handleStartOver }) => {
  // Debug log when component receives prediction
  useEffect(() => {
    console.log("Results component received prediction:", prediction);
    if (prediction.stepsToPrevent) {
      console.log("Prevention steps length:", prediction.stepsToPrevent.length);
      console.log("Prevention steps content:", prediction.stepsToPrevent);
    } else {
      console.log("No prevention steps found in prediction object");
    }
  }, [prediction]);

  // Format prevention steps
  const formatSteps = (steps: string): React.ReactNode[] => {
    if (!steps) return [<p key="no-steps">No prevention steps available.</p>];
    
    // Split by numbered lines or bullet points
    const formattedSteps: React.ReactNode[] = [];
    
    const lines = steps.split('\n').filter(line => line.trim() !== '');
    
    lines.forEach((line, index) => {
      // Check if line starts with a number followed by a period or a dash
      if (line.match(/^\d+\./) || line.match(/^-\s/)) {
        formattedSteps.push(
          <p key={index} className="prevention-step">
            <strong>{line.match(/^\d+\./)?.[0] || '•'}</strong>
            {' ' + line.replace(/^\d+\.|-\s/, '')}
          </p>
        );
      } else {
        formattedSteps.push(<p key={index}>{line}</p>);
      }
    });
    
    return formattedSteps;
  };

  return (
    <div className="results-container">
      <div className="results-card">
        <h2 className="results-title">Your LifeCrash™ Prediction</h2>
        
        <div className="results-data">
          <div className="data-item">
            <span className="data-label">Crisis Age</span>
            <div className="age-display">
              <span className="data-value">{prediction.crisisAge}</span>
              <span className="data-unit">years old</span>
            </div>
          </div>
          
          <div className="data-item">
            <span className="data-label">Severity</span>
            <div className="severity-display">
              <span className="data-value">{prediction.severity}</span>
              <span className="data-unit">/10</span>
              <div className="severity-bar-container">
                <div
                  className="severity-bar"
                  style={{ width: `${(prediction.severity / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="data-item">
            <span className="data-label">Crisis Type: </span>
            <span className="crisis-type">{prediction.type.replace(/"/g, '')}</span>
          </div>
          
          {/* Prevention Steps Section */}
          <div className="data-item prevention-analysis">
            
              <div className="prevention-steps">
                <h3>Steps to Prevent Your Crisis</h3>
                <div className="steps-content">
                  {prediction.stepsToPrevent ? 
                    formatSteps(prediction.stepsToPrevent) : 
                    <p>No prevention steps available.</p>
                  }
                </div>
              </div>
              <div className="analysis-disclaimer">
                Analysis based on your inputs and model predictions. Take action now to avoid your predicted crisis.
              </div>
            </div>
        
        </div>
        
        <div className="start-over">
          <p className="start-over-text">Not satisfied with your prediction?</p>
          <button
            onClick={handleStartOver}
            className="next-button"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;