import React from 'react';

interface Prediction {
  crisisAge: number;
  severity: number;
  type: string;
}

interface ResultsProps {
  prediction: Prediction;
  handleStartOver: () => void;
}

const Results: React.FC<ResultsProps> = ({ prediction, handleStartOver }) => {
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
            <span className="data-label">Crisis Type</span>
            <span className="crisis-type">{prediction.type}</span>
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