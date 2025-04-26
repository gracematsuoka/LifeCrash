import React, { useState } from 'react';
import { FormData, Prediction } from './types';
import { initialFormData, validateForm } from './utils/validation';
import FormStep from './components/FormStep';
import Results from './components/Results';
import './styles/App.css';

const App = () => {
  const [step, setStep] = useState(0); // 0 = Home, 1-5 = Forms, 6 = Results
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = (stepData: Partial<FormData>) => {
    if (!validateForm(stepData, step, setErrors)) return;
    setFormData(prev => ({ ...prev, ...stepData }));
    setStep(prev => prev + 1);
  };

  const handleBack = () => setStep(prev => prev - 1);

  const handleStartOver = () => {
    setStep(0);
    setFormData(initialFormData);
    setPrediction(null);
  };

  const handlePredict = async () => {
    setIsLoading(true);
    setTimeout(() => {
      const age = parseInt(formData.age);
      const jobSatisfaction = parseInt(formData.jobSatisfaction);
      const crisisAge = Math.min(Math.max(age + 15 + (5 - jobSatisfaction) * 2, 38), 65);

      let severityBase = 10 - jobSatisfaction * 1.2;
      if (formData.relationshipStatus.toLowerCase().includes('single')) severityBase += 1;
      else if (formData.relationshipStatus.toLowerCase().includes('married')) severityBase -= 1;
      const severity = Math.min(Math.max(severityBase, 1), 10);

      let type = '';
      const randFactor = Math.floor(Math.random() * 3);
      if (jobSatisfaction <= 2) {
        const options = ['Career change to follow passion', 'Starts a business', 'Goes back to school'];
        type = options[randFactor];
      } else if (formData.income.toLowerCase().includes('high')) {
        const options = ['Buys impractical sports car', 'Takes a sabbatical year', 'Extreme hobby adoption'];
        type = options[randFactor];
      } else {
        const options = ['Joins a rock band', 'Radical image change', 'Sudden travel obsession'];
        type = options[randFactor];
      }

      setPrediction({ crisisAge: parseFloat(crisisAge.toFixed(1)), severity: parseFloat(severity.toFixed(1)), type });
      setIsLoading(false);
      setStep(6);
    }, 1500);
  };

  const renderHome = () => (
    <div className="home-screen">
      <div className="home-content">
        <h1 className="app-title">LifeCrash™</h1>
        <p className="app-subtitle">Predict your midlife crisis before it hits!</p>
      </div>
      <button
        onClick={() => setStep(1)}
        className="start-button"
      >
        Start Prediction
      </button>
    </div>
  );

  return (
    <div className="app-container">
      <div className="main-content">
        <div className="container">
          {step === 0 && renderHome()}
          {step > 0 && step < 6 && (
            <FormStep
              step={step}
              formData={formData}
              errors={errors}
              handleNext={handleNext}
              handleBack={handleBack}
              handlePredict={handlePredict}
            />
          )}
          {step === 6 && prediction && (
            <Results
              prediction={prediction}
              handleStartOver={handleStartOver}
            />
          )}
        </div>

        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-card">
              <div className="spinner"></div>
              <p className="loading-text">Analyzing your life choices...</p>
              <p className="loading-subtext">Please wait while we predict your future crisis.</p>
            </div>
          </div>
        )}
      </div>
      <footer className="footer">LifeCrash™ | Disclaimer: For entertainment purposes only</footer>
    </div>
  );
};

export default App;