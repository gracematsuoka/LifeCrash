import React from 'react';

interface Prediction {
  crisisAge: number;
  severity: number;
  type: string;
}

interface Props {
  prediction: Prediction;
}

const Results: React.FC<Props> = ({ prediction }) => {
  return (
    <div className="results">
      <h2>Your LifeCrash™ Prediction</h2>
      <p><strong>Crisis Age:</strong> {prediction.crisisAge} years old</p>
      <p><strong>Severity:</strong> {prediction.severity}/10</p>
      <p><strong>Type:</strong> {prediction.type}</p>
    </div>
  );
};

export default Results;
