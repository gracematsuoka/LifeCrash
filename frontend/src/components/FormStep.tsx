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
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Electrical Engineering', label: 'Electrical Engineering' },
    { value: 'Mechanical Engineering', label: 'Mechanical Engineering' },
    { value: 'Civil Engineering', label: 'Civil Engineering' },
    { value: 'Chemical Engineering', label: 'Chemical Engineering' },
    { value: 'Aerospace Engineering', label: 'Aerospace Engineering' },
    { value: 'Biomedical Engineering', label: 'Biomedical Engineering' },
    { value: 'Software Engineering', label: 'Software Engineering' },
    { value: 'Data Science', label: 'Data Science' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Physics', label: 'Physics' },
    { value: 'Chemistry', label: 'Chemistry' },
    { value: 'Statistics', label: 'Statistics' },
    { value: 'Robotics', label: 'Robotics' },
    { value: 'Artificial Intelligence', label: 'Artificial Intelligence' },
    { value: 'Machine Learning', label: 'Machine Learning' },
  
    // Business Fields
    { value: 'Business', label: 'Business' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Accounting', label: 'Accounting' },
    { value: 'Economics', label: 'Economics' },
    { value: 'Management', label: 'Management' },
    { value: 'Entrepreneurship', label: 'Entrepreneurship' },
  
    // Humanities
    { value: 'English', label: 'English' },
    { value: 'History', label: 'History' },
    { value: 'Philosophy', label: 'Philosophy' },
    { value: 'Psychology', label: 'Psychology' },
    { value: 'Sociology', label: 'Sociology' },
    { value: 'Political Science', label: 'Political Science' },
    { value: 'Communications', label: 'Communications' },
  
    // Arts
    { value: 'Art', label: 'Art' },
    { value: 'Music', label: 'Music' },
    { value: 'Theater', label: 'Theater' },
    { value: 'Design', label: 'Design' },
    { value: 'Film', label: 'Film' },
  
    // Healthcare
    { value: 'Medicine', label: 'Medicine' },
    { value: 'Nursing', label: 'Nursing' },
    { value: 'Pharmacy', label: 'Pharmacy' },
    { value: 'Biology', label: 'Biology' },
    { value: 'Public Health', label: 'Public Health' },
    { value: 'Veterinary', label: 'Veterinary' },
    { value: 'Dentistry', label: 'Dentistry' },
  ];  

  const majorAliasMap: Record<string, string> = {
    // STEM Fields
    'computer science': 'Computer Science',
    'cs': 'Computer Science',
    'comp sci': 'Computer Science',
    'informatics': 'Computer Science',
    
    'engineering': 'Engineering',
    'engineer': 'Engineering',
    
    'electrical engineering': 'Electrical Engineering',
    'ee': 'Electrical Engineering',
    'elec eng': 'Electrical Engineering',
  
    'mechanical engineering': 'Mechanical Engineering',
    'mech eng': 'Mechanical Engineering',
    'me': 'Mechanical Engineering',
  
    'civil engineering': 'Civil Engineering',
    'civil eng': 'Civil Engineering',
    'ce': 'Civil Engineering',
  
    'chemical engineering': 'Chemical Engineering',
    'chem eng': 'Chemical Engineering',
    'che': 'Chemical Engineering',
  
    'aerospace engineering': 'Aerospace Engineering',
    'aero eng': 'Aerospace Engineering',
    'aerospace': 'Aerospace Engineering',
  
    'biomedical engineering': 'Biomedical Engineering',
    'biomed eng': 'Biomedical Engineering',
    'bme': 'Biomedical Engineering',
  
    'software engineering': 'Software Engineering',
    'software eng': 'Software Engineering',
  
    'data science': 'Data Science',
    'data analytics': 'Data Science',
  
    'mathematics': 'Mathematics',
    'math': 'Mathematics',
    'applied math': 'Mathematics',
  
    'physics': 'Physics',
    'astrophysics': 'Physics',
    'quantum physics': 'Physics',
  
    'chemistry': 'Chemistry',
    'biochemistry': 'Chemistry',
    'chemical': 'Chemistry',
  
    'statistics': 'Statistics',
    'statistical science': 'Statistics',
  
    'robotics': 'Robotics',
  
    'artificial intelligence': 'Artificial Intelligence',
    'ai': 'Artificial Intelligence',
  
    'machine learning': 'Machine Learning',
    'ml': 'Machine Learning',
  
    // Business Fields
    'business': 'Business',
    'business administration': 'Business',
    'mba': 'Business',
  
    'finance': 'Finance',
    'financial engineering': 'Finance',
  
    'marketing': 'Marketing',
    'market research': 'Marketing',
  
    'accounting': 'Accounting',
    'cpa': 'Accounting',
  
    'economics': 'Economics',
    'econ': 'Economics',
    'applied economics': 'Economics',
  
    'management': 'Management',
    'entrepreneurship': 'Entrepreneurship',
  
    // Humanities
    'english': 'English',
    'english literature': 'English',
    'literature': 'English',
  
    'history': 'History',
    'world history': 'History',
    'american history': 'History',
  
    'philosophy': 'Philosophy',
    'ethics': 'Philosophy',
    'logic': 'Philosophy',
  
    'psychology': 'Psychology',
    'psy': 'Psychology',
    'clinical psychology': 'Psychology',
  
    'sociology': 'Sociology',
    'social science': 'Sociology',
    'anthropology': 'Sociology',
  
    'political science': 'Political Science',
    'politics': 'Political Science',
    'government': 'Political Science',
  
    'communications': 'Communications',
    'media studies': 'Communications',
  
    // Arts
    'art': 'Art',
    'fine arts': 'Art',
    'visual arts': 'Art',
  
    'music': 'Music',
    'music theory': 'Music',
    'composition': 'Music',
  
    'theater': 'Theater',
    'theatre': 'Theater',
    'drama': 'Theater',
  
    'design': 'Design',
    'graphic design': 'Design',
    'industrial design': 'Design',
  
    'film': 'Film',
    'film studies': 'Film',
    'cinema': 'Film',
  
    // Healthcare
    'medicine': 'Medicine',
    'pre-med': 'Medicine',
    'md': 'Medicine',
  
    'nursing': 'Nursing',
    'rn': 'Nursing',
    'bsn': 'Nursing',
  
    'pharmacology': 'Pharmacy',
    'pharmacy': 'Pharmacy',
    'pharmd': 'Pharmacy',
  
    'biology': 'Biology',
    'biological science': 'Biology',
    'microbiology': 'Biology',
  
    'public health': 'Public Health',
    'health sciences': 'Public Health',
  
    'veterinary': 'Veterinary',
    'vet': 'Veterinary',
    'dvm': 'Veterinary',
  
    'dentistry': 'Dentistry',
    'dental': 'Dentistry',
    'dds': 'Dentistry',
  };
  

  const handleMajorChange = (selectedOption: any) => {
    const input = selectedOption?.value?.toLowerCase() || '';
  
    const mappedMajor = majorAliasMap[input] || input; // default fallback if no mapping
  
    setStepData((prevData) => ({
      ...prevData,
      major: mappedMajor,
    }));
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
                    value={
                      majorOptions.find(option => 
                        option.label === majorAliasMap[(stepData.major || '').toLowerCase()]
                      ) || null
                    }
                    onChange={(selectedOption: any) => {
                      const input = selectedOption?.value?.toLowerCase() || '';
                      const mappedMajor = majorAliasMap[input] || input;
                      setStepData((prevData) => ({
                        ...prevData,
                        major: mappedMajor,
                      }));
                    }}
                    placeholder="Select your major"
                    classNamePrefix="react-select"
                    isClearable
                    isSearchable
                    filterOption={(option, inputValue) => {
                      const searchInput = inputValue.toLowerCase();
                      const candidate = option.label.toLowerCase();

                      if (candidate.includes(searchInput)) {
                        return true;
                      }

                      const mappedInput = majorAliasMap[searchInput];
                      if (mappedInput && mappedInput === option.label) {
                        return true;
                      }

                      return false; 
                    }}
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
