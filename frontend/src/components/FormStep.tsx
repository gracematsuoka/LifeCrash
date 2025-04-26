import React, { useState } from 'react';
import { FormData } from '../types';
import { getFieldsForStep } from '../utils/validation'; 
import FormField from './FormField';

interface FormStepProps {
  step: number;
  formData: FormData;
  errors: Partial<FormData>;
  handleNext: (data: Partial<FormData>) => void;
  handleBack: () => void;
  handlePredict: () => void;
}

const FormStep: React.FC<FormStepProps> = ({ 
  step, 
  formData, 
  errors, 
  handleNext, 
  handleBack, 
  handlePredict 
}) => {
  const [stepData, setStepData] = useState<Partial<FormData>>(() => {
    // Initialize with current values from formData based on step
    const fields = getFieldsForStep(step);
    const initialData: Partial<FormData> = {};
    
    fields.forEach(field => {
      initialData[field as keyof FormData] = formData[field as keyof FormData];
    });
    
    return initialData;
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setStepData({
      ...stepData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 5) {
      handleNext(stepData);
      handlePredict();
    } else {
      handleNext(stepData);
    }
  };

  const renderFormFields = () => {
    switch (step) {
      case 1:
        return (
          <div className="form-fields">
            <FormField
              label="Age"
              name="age"
              type="number"
              value={stepData.age || ''}
              onChange={handleChange}
              error={errors.age}
              placeholder="Enter your age"
            />
            
            <div className="form-group">
              <label>Relationship Status</label>
              <select
                name="relationshipStatus"
                value={stepData.relationshipStatus || ''}
                onChange={handleChange}
                className={`form-control ${errors.relationshipStatus ? 'error' : ''}`}
              >
                <option value="">Select status...</option>
                <option value="Single">Single</option>
                <option value="Dating">Dating</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
              {errors.relationshipStatus && <p className="error-message">{errors.relationshipStatus}</p>}
            </div>
            
            <FormField
              label="Number of Children"
              name="children"
              type="number"
              value={stepData.children || ''}
              onChange={handleChange}
              error={errors.children}
              placeholder="How many children do you have?"
            />
          </div>
        );
      case 2:
        return (
          <div className="form-fields">
            <div className="form-group">
              <label>Education Level</label>
              <select
                name="education"
                value={stepData.education || ''}
                onChange={handleChange}
                className={`form-control ${errors.education ? 'error' : ''}`}
              >
                <option value="">Select level...</option>
                <option value="High School">High School</option>
                <option value="Some College">Some College</option>
                <option value="Associate's Degree">Associate's Degree</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="Doctorate">Doctorate</option>
              </select>
              {errors.education && <p className="error-message">{errors.education}</p>}
            </div>
        
            {/* High School GPA - Only show if education is High School or higher */}
            {stepData.education && (
              <div className="form-group">
                <label>High School GPA</label>
                <input
                  type="number"
                  name="highSchoolGPA"
                  value={stepData.highSchoolGPA || ''}
                  onChange={handleChange}
                  placeholder="e.g., 3.5"
                  min="0"
                  max="4.0"
                  step="0.01"
                  className={`form-control ${errors.highSchoolGPA ? 'error' : ''}`}
                />
                {errors.highSchoolGPA && <p className="error-message">{errors.highSchoolGPA}</p>}
              </div>
            )}
        
            {/* SAT Score - Only show if education is High School or higher */}
            {stepData.education && (
              <div className="form-group">
                <label>SAT Score</label>
                <input
                  type="number"
                  name="satScore"
                  value={stepData.satScore || ''}
                  onChange={handleChange}
                  placeholder="e.g., 1200"
                  min="400"
                  max="1600"
                  className={`form-control ${errors.satScore ? 'error' : ''}`}
                />
                {errors.satScore && <p className="error-message">{errors.satScore}</p>}
              </div>
            )}
        
            {/* University Information - Only show if education is Some College or higher */}
            {stepData.education && stepData.education !== 'High School' && (
              <>
                <div className="form-group">
                  <label>University Name</label>
                  <input
                    type="text"
                    name="universityName"
                    value={stepData.universityName || ''}
                    onChange={handleChange}
                    placeholder="Enter university name"
                    className={`form-control ${errors.universityName ? 'error' : ''}`}
                  />
                  {errors.universityName && <p className="error-message">{errors.universityName}</p>}
                </div>
                
                <div className="form-group">
                  <label>Major</label>
                  <input
                    type="text"
                    name="major"
                    value={stepData.major || ''}
                    onChange={handleChange}
                    placeholder="Enter your major"
                    className={`form-control ${errors.major ? 'error' : ''}`}
                  />
                  {errors.major && <p className="error-message">{errors.major}</p>}
                </div>
                
                <div className="form-group">
                  <label>University GPA</label>
                  <input
                    type="number"
                    name="universityGPA"
                    value={stepData.universityGPA || ''}
                    onChange={handleChange}
                    placeholder="e.g., 3.5"
                    min="0"
                    max="4.0"
                    step="0.01"
                    className={`form-control ${errors.universityGPA ? 'error' : ''}`}
                  />
                  {errors.universityGPA && <p className="error-message">{errors.universityGPA}</p>}
                </div>
              </>
            )}
          </div>
        );
      case 3:
        return (
          <div className="form-fields">
            <FormField
              label="Career Type"
              name="careerType"
              type="text"
              value={stepData.careerType || ''}
              onChange={handleChange}
              error={errors.careerType}
              placeholder="e.g., Finance, Technology, Healthcare"
            />
            
            <div className="form-group">
              <label>Job Satisfaction (1-5)</label>
              <div className="radio-group">
                {[1, 2, 3, 4, 5].map(num => (
                  <label key={num} className="radio-label">
                    <input
                      type="radio"
                      name="jobSatisfaction"
                      value={num.toString()}
                      checked={stepData.jobSatisfaction === num.toString()}
                      onChange={handleChange}
                      className="radio-input"
                    />
                    <span className="radio-text">{num}</span>
                  </label>
                ))}
              </div>
              <div className="radio-labels">
                <span>Very Unsatisfied</span>
                <span>Very Satisfied</span>
              </div>
              {errors.jobSatisfaction && <p className="error-message">{errors.jobSatisfaction}</p>}
            </div>
            
            <div className="form-group">
              <label>Income Level</label>
              <select
                name="income"
                value={stepData.income || ''}
                onChange={handleChange}
                className={`form-control ${errors.income ? 'error' : ''}`}
              >
                <option value="">Select income level...</option>
                <option value="Low">Below Average</option>
                <option value="Average">Average</option>
                <option value="High">Above Average</option>
                <option value="Very High">Significantly Above Average</option>
              </select>
              {errors.income && <p className="error-message">{errors.income}</p>}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="form-fields">
            <div className="form-group">
              <label>Health/Exercise Habits</label>
              <select
                name="health"
                value={stepData.health || ''}
                onChange={handleChange}
                className={`form-control ${errors.health ? 'error' : ''}`}
              >
                <option value="">Select habit level...</option>
                <option value="Sedentary">Sedentary</option>
                <option value="Occasional">Occasional Exercise</option>
                <option value="Regular">Regular Exercise</option>
                <option value="Fitness Enthusiast">Fitness Enthusiast</option>
                <option value="Athlete">Athlete</option>
              </select>
              {errors.health && <p className="error-message">{errors.health}</p>}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="form-fields">
            <div className="form-group">
              <label>Hobbies</label>
              <select
                name="hobbies"
                value={stepData.hobbies || ''}
                onChange={handleChange}
                className={`form-control ${errors.hobbies ? 'error' : ''}`}
              >
                <option value="">Select primary hobby type...</option>
                <option value="Creative">Creative (Art, Music, Writing)</option>
                <option value="Physical">Physical (Sports, Fitness)</option>
                <option value="Intellectual">Intellectual (Reading, Learning)</option>
                <option value="Social">Social (Gatherings, Clubs)</option>
                <option value="Relaxing">Relaxing (TV, Games)</option>
                <option value="None">No Strong Hobbies</option>
              </select>
              {errors.hobbies && <p className="error-message">{errors.hobbies}</p>}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Step titles and progress bar
  const stepTitles = ['Basic Info', 'Education', 'Career', 'Health', 'Hobbies'];

  return (
    <div className="form-container">
      <div className="step-header">
        <h2 className="step-title">{stepTitles[step - 1]}</h2>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${(step / 5) * 100}%` }}></div>
        </div>
        <p className="step-indicator">Step {step} of 5</p>
      </div>
      
      <form onSubmit={handleSubmit} className="form-card">
        {renderFormFields()}
        
        <div className="form-buttons">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="back-button"
            >
              Back
            </button>
          ) : (
            <div></div>
          )}
          
          <button
            type="submit"
            className="next-button"
          >
            {step === 5 ? 'Predict My Crisis' : 'Next'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormStep;