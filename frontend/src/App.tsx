<<<<<<< HEAD
import { useState } from 'react'
import './css/App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
        </a>
        <a href="https://react.dev" target="_blank">
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
=======
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
>>>>>>> dbaec5f (added in basic)
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