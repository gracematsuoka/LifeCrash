import React, { useState } from 'react';

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

interface Props {
  step: number;
  formData: FormData;
  handleNext: (data: Partial<FormData>) => void;
  handlePredict: () => void;
}

const stepTitles = ['Basic Info', 'Education', 'Job', 'Health', 'Hobbies'];

const MultiStepForm: React.FC<Props> = ({ step, formData, handleNext, handlePredict }) => {
  const [input, setInput] = useState<Partial<FormData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 5) {
      handleNext(input);
      handlePredict();
    } else {
      handleNext(input);
    }
    setInput({});
  };

  const renderFormFields = () => {
    switch (step) {
      case 1:
        return (
          <>
            <label>Age: <input name="age" value={input.age || ''} onChange={handleChange} /></label>
            <label>Relationship Status: <input name="relationshipStatus" value={input.relationshipStatus || ''} onChange={handleChange} /></label>
            <label>Children (number): <input name="children" value={input.children || ''} onChange={handleChange} /></label>
          </>
        );
      case 2:
        return (
          <>
            <label>Education Level: <input name="education" value={input.education || ''} onChange={handleChange} /></label>
          </>
        );
      case 3:
        return (
          <>
            <label>Career Type: <input name="careerType" value={input.careerType || ''} onChange={handleChange} /></label>
            <label>Job Satisfaction (1-5): <input name="jobSatisfaction" value={input.jobSatisfaction || ''} onChange={handleChange} /></label>
            <label>Income: <input name="income" value={input.income || ''} onChange={handleChange} /></label>
          </>
        );
      case 4:
        return (
          <>
            <label>Health/Exercise Habits: <input name="health" value={input.health || ''} onChange={handleChange} /></label>
          </>
        );
      case 5:
        return (
          <>
            <label>Hobbies: <input name="hobbies" value={input.hobbies || ''} onChange={handleChange} /></label>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{stepTitles[step - 1]}</h2>
      {renderFormFields()}
      <button type="submit">{step === 5 ? 'Predict My Crisis' : 'Next'}</button>
    </form>
  );
};

export default MultiStepForm;
