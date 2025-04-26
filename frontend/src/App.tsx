import React, { useState } from 'react';
import FormStep from './components/FormStep';
import Results from './components/Results';
import { initialFormData, validateForm } from './utils/validation';
import { FormData, Prediction } from './types'; 
import './styles/App.css';


const App: React.FC = () => {
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
    console.log("Sending data to API:", formData);
    
    try {
      const response = await fetch('http://localhost:5001/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      console.log(`API Response status: ${response.status}`); 
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error: ${errorText}`);
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Received prediction result:", result); // Log response data
      
      setPrediction({
        crisisAge: result.crisisAge,
        severity: result.severity,
        type: result.type,
        aiAnalysis: result.aiAnalysis
      });
    } catch (error) {
      console.error('Error getting prediction from API:', error);
      // You might want to set an error state here to display to the user
    } finally {
      setIsLoading(false);
      setStep(6); // Consider only moving to step 6 if there was no error
    }
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