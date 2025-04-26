import React, { useState } from 'react';
import MultiStepForm from './components/MultiStepForm';
import Results from './components/Results';
import './styles/app.css';

interface FormData {
  age: string;
  relationshipStatus: string;
  children: string;
  education: string;
  jobSatisfaction: string;
  careerType: string;
  income: string;
  health: string;
  hobbies: string;
}

interface Prediction {
  crisisAge: number;
  severity: number;
  type: string;
}

const App: React.FC = () => {
  const [step, setStep] = useState<number>(0); // 0 = Home, 1-5 = Forms, 6 = Results
  const [formData, setFormData] = useState<FormData>({
    age: '',
    relationshipStatus: '',
    children: '',
    education: '',
    jobSatisfaction: '',
    careerType: '',
    income: '',
    health: '',
    hobbies: '',
  });
  const [prediction, setPrediction] = useState<Prediction | null>(null);

  const handleNext = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((prev) => prev + 1);
  };

  const handlePredict = () => {
    // Simulate prediction
    const fakePrediction: Prediction = {
      crisisAge: 45.2,
      severity: 8.1,
      type: 'Joins a rock band',
    };
    setPrediction(fakePrediction);
    setStep(6); // Go to results
  };

  return (
    <div className="app-container">
      {step === 0 && (
        <div className="home">
          <h1>LifeCrash™</h1>
          <p>Predict your midlife crisis before it hits!</p>
          <button onClick={() => setStep(1)}>Give Us Info</button>
        </div>
      )}

      {step > 0 && step < 6 && (
        <MultiStepForm
          step={step}
          formData={formData}
          handleNext={handleNext}
          handlePredict={handlePredict}
        />
      )}

      {step === 6 && prediction && <Results prediction={prediction} />}
    </div>
  );
};

export default App;
// Note: The above code is a simplified version of the app. In a real-world scenario, you would want to handle form validation, API calls for predictions, and possibly more complex state management.