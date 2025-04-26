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
    try {
      const dataToSend = {
        Age: parseInt(formData.age),
        High_School_GPA: parseFloat(formData.highSchoolGPA),
        SAT_Score: parseInt(formData.satScore),
        University_GPA: formData.universityGPA,
        Field_of_Study: formData.major,
        Internships_Completed: parseInt(formData.internshipsCompleted),
        Career_Satisfaction: parseInt(formData.jobSatisfaction),
        Current_Job_Level: formData.jobLevel,
      };
  
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
  
      const result = await response.json();
      console.log('Prediction result from Flask:', result);
  
      setPrediction({
        crisisAge: parseFloat(result.prediction.toFixed(1)),
        severity: 5.0,     
        type: 'Predicted by model' 
      });
  
      setIsLoading(false);
      setStep(6); 
    } catch (error) {
      console.error('Error during prediction:', error);
      setIsLoading(false);
      alert('Prediction failed. Please try again.');
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