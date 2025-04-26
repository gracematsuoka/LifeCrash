import React, { useState } from "react";
import { FormData } from "../types";
import { getFieldsForStep } from "../utils/validation";
import FormField from "./FormField";
import Select from'react-select';

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
  handlePredict,
}) => {
  const [stepData, setStepData] = useState<Partial<FormData>>(() => {
    // Initialize with current values from formData based on step
    const fields = getFieldsForStep(step);
    const initialData: Partial<FormData> = {};

    fields.forEach((field) => {
      initialData[field as keyof FormData] = formData[field as keyof FormData];
    });

    return initialData;
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setStepData({
      ...stepData,
      [e.target.name]: e.target.value,
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

  const majorOptions = [
    // STEM Fields
    { value: 'computer science', label: 'Computer Science' },
    { value: 'cs', label: 'CS' },
    { value: 'comp sci', label: 'Comp Sci' },
    { value: 'informatics', label: 'Informatics' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'engineer', label: 'Engineer' },
    { value: 'electrical engineering', label: 'Electrical Engineering' },
    { value: 'ee', label: 'EE' },
    { value: 'elec eng', label: 'Elec Eng' },
    { value: 'mechanical engineering', label: 'Mechanical Engineering' },
    { value: 'mech eng', label: 'Mech Eng' },
    { value: 'me', label: 'ME' },
    { value: 'civil engineering', label: 'Civil Engineering' },
    { value: 'civil eng', label: 'Civil Eng' },
    { value: 'ce', label: 'CE' },
    { value: 'chemical engineering', label: 'Chemical Engineering' },
    { value: 'chem eng', label: 'Chem Eng' },
    { value: 'che', label: 'CHE' },
    { value: 'aerospace engineering', label: 'Aerospace Engineering' },
    { value: 'aero eng', label: 'Aero Eng' },
    { value: 'aerospace', label: 'Aerospace' },
    { value: 'biomedical engineering', label: 'Biomedical Engineering' },
    { value: 'biomed eng', label: 'Biomed Eng' },
    { value: 'bme', label: 'BME' },
    { value: 'software engineering', label: 'Software Engineering' },
    { value: 'software eng', label: 'Software Eng' },
    { value: 'data science', label: 'Data Science' },
    { value: 'data analytics', label: 'Data Analytics' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'math', label: 'Math' },
    { value: 'applied math', label: 'Applied Math' },
    { value: 'physics', label: 'Physics' },
    { value: 'astrophysics', label: 'Astrophysics' },
    { value: 'quantum physics', label: 'Quantum Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'biochemistry', label: 'Biochemistry' },
    { value: 'chemical', label: 'Chemical' },
    { value: 'statistics', label: 'Statistics' },
    { value: 'statistical science', label: 'Statistical Science' },
    { value: 'robotics', label: 'Robotics' },
    { value: 'artificial intelligence', label: 'Artificial Intelligence' },
    { value: 'ai', label: 'AI' },
    { value: 'machine learning', label: 'Machine Learning' },
    { value: 'ml', label: 'ML' },
  
    // Business Fields
    { value: 'business', label: 'Business' },
    { value: 'business administration', label: 'Business Administration' },
    { value: 'mba', label: 'MBA' },
    { value: 'finance', label: 'Finance' },
    { value: 'financial engineering', label: 'Financial Engineering' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'market research', label: 'Market Research' },
    { value: 'accounting', label: 'Accounting' },
    { value: 'cpa', label: 'CPA' },
    { value: 'economics', label: 'Economics' },
    { value: 'econ', label: 'Econ' },
    { value: 'applied economics', label: 'Applied Economics' },
    { value: 'management', label: 'Management' },
    { value: 'entrepreneurship', label: 'Entrepreneurship' },
  
    // Humanities
    { value: 'english', label: 'English' },
    { value: 'english literature', label: 'English Literature' },
    { value: 'literature', label: 'Literature' },
    { value: 'history', label: 'History' },
    { value: 'world history', label: 'World History' },
    { value: 'american history', label: 'American History' },
    { value: 'philosophy', label: 'Philosophy' },
    { value: 'ethics', label: 'Ethics' },
    { value: 'logic', label: 'Logic' },
    { value: 'psychology', label: 'Psychology' },
    { value: 'psy', label: 'Psy' },
    { value: 'clinical psychology', label: 'Clinical Psychology' },
    { value: 'sociology', label: 'Sociology' },
    { value: 'social science', label: 'Social Science' },
    { value: 'anthropology', label: 'Anthropology' },
    { value: 'political science', label: 'Political Science' },
    { value: 'politics', label: 'Politics' },
    { value: 'government', label: 'Government' },
    { value: 'communications', label: 'Communications' },
    { value: 'media studies', label: 'Media Studies' },
  
    // Arts
    { value: 'art', label: 'Art' },
    { value: 'fine arts', label: 'Fine Arts' },
    { value: 'visual arts', label: 'Visual Arts' },
    { value: 'music', label: 'Music' },
    { value: 'music theory', label: 'Music Theory' },
    { value: 'composition', label: 'Composition' },
    { value: 'theater', label: 'Theater' },
    { value: 'theatre', label: 'Theatre' },
    { value: 'drama', label: 'Drama' },
    { value: 'design', label: 'Design' },
    { value: 'graphic design', label: 'Graphic Design' },
    { value: 'industrial design', label: 'Industrial Design' },
    { value: 'film', label: 'Film' },
    { value: 'film studies', label: 'Film Studies' },
    { value: 'cinema', label: 'Cinema' },
  
    // Healthcare
    { value: 'medicine', label: 'Medicine' },
    { value: 'pre-med', label: 'Pre-Med' },
    { value: 'md', label: 'MD' },
    { value: 'nursing', label: 'Nursing' },
    { value: 'rn', label: 'RN' },
    { value: 'bsn', label: 'BSN' },
    { value: 'pharmacology', label: 'Pharmacology' },
    { value: 'pharmacy', label: 'Pharmacy' },
    { value: 'pharmd', label: 'PharmD' },
    { value: 'biology', label: 'Biology' },
    { value: 'biological science', label: 'Biological Science' },
    { value: 'microbiology', label: 'Microbiology' },
    { value: 'public health', label: 'Public Health' },
    { value: 'health sciences', label: 'Health Sciences' },
    { value: 'veterinary', label: 'Veterinary' },
    { value: 'vet', label: 'Vet' },
    { value: 'dvm', label: 'DVM' },
    { value: 'dentistry', label: 'Dentistry' },
    { value: 'dental', label: 'Dental' },
    { value: 'dds', label: 'DDS' },
  ];  

  const handleMajorChange = (selectedOption: any) => {
    setStepData({
      ...stepData,
      major: selectedOption.value,
    });
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
              value={stepData.age || ""}
              onChange={handleChange}
              error={errors.age}
              placeholder="Enter your age"
            />

            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={stepData.gender || ""}
                onChange={handleChange}
                className={`form-control ${errors.gender ? "error" : ""}`}
              >
                <option value="">Select gender...</option>
                <option value="male">Female</option>
                <option value="female">Male</option>
                <option value="other">Other</option>
              </select>
              {errors.relationshipStatus && (
                <p className="error-message">{errors.relationshipStatus}</p>
              )}
            </div>

            <div className="form-group">
              <label>Relationship Status</label>
              <select
                name="relationshipStatus"
                value={stepData.relationshipStatus || ""}
                onChange={handleChange}
                className={`form-control ${
                  errors.relationshipStatus ? "error" : ""
                }`}
              >
                <option value="">Select status...</option>
                <option value="Single">Single</option>
                <option value="Dating">Dating</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
              {errors.relationshipStatus && (
                <p className="error-message">{errors.relationshipStatus}</p>
              )}
            </div>

            <FormField
              label="Number of Children"
              name="children"
              type="number"
              value={stepData.children || ""}
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
                value={stepData.education || ""}
                onChange={handleChange}
                className={`form-control ${errors.education ? "error" : ""}`}
              >
                <option value="">Select level...</option>
                <option value="Some College">Some College</option>
                <option value="Associate's Degree">Associate's Degree</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="Doctorate">Doctorate</option>
              </select>
              {errors.education && (
                <p className="error-message">{errors.education}</p>
              )}
            </div>

            {/* High School GPA - Only show if education is High School or higher */}
            {stepData.education && (
              <div className="form-group">
                <label>High School GPA</label>
                <input
                  type="number"
                  name="highSchoolGPA"
                  value={stepData.highSchoolGPA || ""}
                  onChange={handleChange}
                  placeholder="e.g., 3.5"
                  min="0"
                  max="4.0"
                  step="0.01"
                  className={`form-control ${
                    errors.highSchoolGPA ? "error" : ""
                  }`}
                />
                {errors.highSchoolGPA && (
                  <p className="error-message">{errors.highSchoolGPA}</p>
                )}
              </div>
            )}

            {/* SAT Score - Only show if education is High School or higher */}
            {stepData.education && (
              <div className="form-group">
                <label>SAT Score</label>
                <input
                  type="number"
                  name="satScore"
                  value={stepData.satScore || ""}
                  onChange={handleChange}
                  placeholder="e.g., 1200"
                  min="400"
                  max="1600"
                  className={`form-control ${errors.satScore ? "error" : ""}`}
                />
                {errors.satScore && (
                  <p className="error-message">{errors.satScore}</p>
                )}
              </div>
            )}

            {/* University Information - Only show if education is Some College or higher */}
            {stepData.education && stepData.education !== "High School" && (
              <>
                <div className="form-group">
                  <label>University Name</label>
                  <input
                    type="text"
                    name="universityName"
                    value={stepData.universityName || ""}
                    onChange={handleChange}
                    placeholder="Enter university name"
                    className={`form-control ${
                      errors.universityName ? "error" : ""
                    }`}
                  />
                  {errors.universityName && (
                    <p className="error-message">{errors.universityName}</p>
                  )}
                </div>

                <div className="form-group">
                  <label>Major</label>
                  <Select
                    name="major"
                    options={majorOptions}
                    value={majorOptions.find(option => option.value === stepData.major)}
                    onChange={handleMajorChange}
                    placeholder="Select your major"
                    classNamePrefix="react-select"
                  />
                  {errors.major && (
                    <p className="error-message">{errors.major}</p>
                  )}
                </div>

                <div className="form-group">
                  <label>University GPA</label>
                  <input
                    type="number"
                    name="universityGPA"
                    value={stepData.universityGPA || ""}
                    onChange={handleChange}
                    placeholder="e.g., 3.5"
                    min="0"
                    max="4.0"
                    step="0.01"
                    className={`form-control ${
                      errors.universityGPA ? "error" : ""
                    }`}
                  />
                  {errors.universityGPA && (
                    <p className="error-message">{errors.universityGPA}</p>
                  )}
                </div>

                <div className="form-group">
                  <label>Internships Completed</label>
                  <input
                    type="number"
                    name="internshipsCompleted"
                    value={stepData.internshipsCompleted || ""}
                    onChange={handleChange}
                    placeholder="e.g., 3"
                    className={`form-control ${
                      errors.internshipsCompleted ? "error" : ""
                    }`}
                  />
                  {errors.internshipsCompleted && (
                    <p className="error-message">
                      {errors.internshipsCompleted}
                    </p>
                  )}
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
              value={stepData.careerType || ""}
              onChange={handleChange}
              error={errors.careerType}
              placeholder="e.g., Finance, Technology, Healthcare"
            />

            <div className="form-group">
              <label>Job Satisfaction</label>
              <p className="satisfaction-description">
                How satisfied are you with your job? (1 - 5)
              </p>
              <div className="radio-group">
                <span className="radio-extreme">
                  <small>Very Unsatisfied</small>
                </span>
                {[1, 2, 3, 4, 5].map((num) => (
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
                <span className="radio-extreme">
                  <small>Very Satisfied</small>
                </span>
              </div>
              {errors.jobSatisfaction && (
                <p className="error-message">{errors.jobSatisfaction}</p>
              )}
            </div>

            <FormField
              label="Salary Per Year ($)"
              name="income"
              type="number"
              value={stepData.income || ""}
              onChange={handleChange}
              error={errors.income}
              placeholder="e.g., 60000"
            />

            <div className="form-group">
              <label>Job Level</label>
              <select
                name="jobLevel"
                value={stepData.jobLevel || ""}
                onChange={handleChange}
                className={`form-control ${errors.jobLevel ? "error" : ""}`}
              >
                <option value="">Select job level...</option>
                <option value="Entry">Entry</option>
                <option value="Mid">Mid</option>
                <option value="Senior">Senior</option>
                <option value="Executive">Executive</option>
              </select>
              {errors.jobLevel && (
                <p className="error-message">{errors.jobLevel}</p>
              )}
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
                value={stepData.health || ""}
                onChange={handleChange}
                className={`form-control ${errors.health ? "error" : ""}`}
              >
                <option value="">Select habit level...</option>
                <option value="Sedentary">Sedentary</option>
                <option value="Occasional">Occasional Exercise</option>
                <option value="Regular">Regular Exercise</option>
                <option value="Fitness Enthusiast">Fitness Enthusiast</option>
                <option value="Athlete">Athlete</option>
              </select>
              {errors.health && (
                <p className="error-message">{errors.health}</p>
              )}
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
                value={stepData.hobbies || ""}
                onChange={handleChange}
                className={`form-control ${errors.hobbies ? "error" : ""}`}
              >
                <option value="">Select primary hobby type...</option>
                <option value="Creative">Creative (Art, Music, Writing)</option>
                <option value="Physical">Physical (Sports, Fitness)</option>
                <option value="Intellectual">
                  Intellectual (Reading, Learning)
                </option>
                <option value="Social">Social (Gatherings, Clubs)</option>
                <option value="Relaxing">Relaxing (TV, Games)</option>
                <option value="None">No Strong Hobbies</option>
              </select>
              {errors.hobbies && (
                <p className="error-message">{errors.hobbies}</p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Step titles and progress bar
  const stepTitles = ["Basic Info", "Education", "Career", "Health", "Hobbies"];

  return (
    <div className="form-container">
      <div className="step-header">
        <h2 className="step-title">{stepTitles[step - 1]}</h2>
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{ width: `${(step / 5) * 100}%` }}
          ></div>
        </div>
        <p className="step-indicator">Step {step} of 5</p>
      </div>

      <form onSubmit={handleSubmit} className="form-card">
        {renderFormFields()}

        <div className="form-buttons">
          {step > 1 ? (
            <button type="button" onClick={handleBack} className="back-button">
              Back
            </button>
          ) : (
            <div></div>
          )}

          <button type="submit" className="next-button">
            {step === 5 ? "Predict My Crisis" : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormStep;
