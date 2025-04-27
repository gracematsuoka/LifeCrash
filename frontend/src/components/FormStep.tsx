import React, { useState, useEffect } from "react";
import { FormData } from "../types";
import { getFieldsForStep } from "../utils/validation";
import FormField from "./FormField";
import Select from "react-select";
import { universityOptions as preloadedUniversityOptions } from "../data/universityOptions";
import { majorOptions as preloadedMajorOptions } from "../data/majorOptions";

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

  // This state is kept for backward compatibility but won't be actively used
  const [universities, setUniversities] = useState<
    Array<{ name: string; city: string; ranking: number }>
  >([]);
  const [isLoadingUniversities, setIsLoadingUniversities] =
    useState<boolean>(false);

  // Load universities when on education step
  useEffect(() => {
    if (step === 2) {
      // Nothing to do here anymore since we're using preloaded data
      setIsLoadingUniversities(false);
    }
  }, [step]);

  // Default universities in case data fails to load
  const defaultUniversities = [
    { name: "Harvard University", city: "Cambridge, MA", ranking: 1 },
    { name: "Stanford University", city: "Stanford, CA", ranking: 2 },
    {
      name: "Massachusetts Institute of Technology",
      city: "Cambridge, MA",
      ranking: 3,
    },
    {
      name: "University of California, Berkeley",
      city: "Berkeley, CA",
      ranking: 4,
    },
    { name: "University of Michigan", city: "Ann Arbor, MI", ranking: 5 },
  ];

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

  const universityOptions = preloadedUniversityOptions;
  const majorOptions = preloadedMajorOptions;

  const handleMajorChange = (selectedOption: any) => {
    setStepData({
      ...stepData,
      major: selectedOption ? selectedOption.value : "",
    });
  };

  const handleUniversityChange = (selectedOption: any) => {
    setStepData({
      ...stepData,
      universityName: selectedOption ? selectedOption.value : "",
      universityRanking: selectedOption && selectedOption.data ? selectedOption.data.ranking : null,
      universityLocation: selectedOption && selectedOption.data ? selectedOption.data.city : ""
    });
  };

  const filterUniversities = (option: any, inputValue: string) => {
    const searchInput = inputValue.toLowerCase();
    return option.label.toLowerCase().includes(searchInput);
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
              min="0"
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
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="error-message">{errors.gender}</p>
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
              min="0"
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
              <FormField
                label="High School GPA"
                name="highSchoolGPA"
                type="number"
                value={stepData.highSchoolGPA || ""}
                onChange={handleChange}
                error={errors.highSchoolGPA}
                placeholder="e.g., 3.5"
                min="0"
                max="4.0"
                step="0.01"
              />
            )}

            {/* SAT Score - Only show if education is High School or higher */}
            {stepData.education && (
              <FormField
                label="SAT Score"
                name="satScore"
                type="number"
                value={stepData.satScore || ""}
                onChange={handleChange}
                error={errors.satScore}
                placeholder="e.g., 1200"
                min="400"
                max="1600"
              />
            )}

            {/* University Information - Only show if education is Some College or higher */}
            {stepData.education && stepData.education !== "High School" && (
              <>
                <div className="form-group">
                  <label>University Name</label>
                  <Select
                    name="universityName"
                    options={universityOptions}
                    value={
                      stepData.universityName
                        ? universityOptions.find(
                            (option) => option.value === stepData.universityName
                          )
                        : null
                    }
                    onChange={handleUniversityChange}
                    placeholder="Select your university"
                    classNamePrefix="react-select"
                    isClearable
                    isSearchable
                    className={`${errors.universityName ? "error" : ""}`}
                    filterOption={filterUniversities}
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
                      stepData.major
                        ? majorOptions.find(
                            (option) => option.value === stepData.major
                          )
                        : null
                    }
                    onChange={handleMajorChange}
                    placeholder="Select your major"
                    classNamePrefix="react-select"
                    isClearable
                    isSearchable
                    className={`${errors.major ? "error" : ""}`}
                    filterOption={(option, inputValue) => {
                      const searchInput = inputValue.toLowerCase();
                      return option.label.toLowerCase().includes(searchInput);
                    }}
                  />
                  {errors.major && (
                    <p className="error-message">{errors.major}</p>
                  )}
                </div>

                <FormField
                  label="University GPA"
                  name="universityGPA"
                  type="number"
                  value={stepData.universityGPA || ""}
                  onChange={handleChange}
                  error={errors.universityGPA}
                  placeholder="e.g., 3.5"
                  min="0"
                  max="4.0"
                  step="0.01"
                />

                <FormField
                  label="Internships Completed"
                  name="internshipsCompleted"
                  type="number"
                  value={stepData.internshipsCompleted || ""}
                  onChange={handleChange}
                  error={errors.internshipsCompleted}
                  placeholder="e.g., 3"
                  min="0"
                />
              </>
            )}
          </div>
        );
      case 3:
        return (
          <div className="form-fields">
            <FormField
              label="Job Satisfaction"
              name="jobSatisfaction"
              type="number"
              value={stepData.jobSatisfaction || ""}
              onChange={handleChange}
              error={errors.jobSatisfaction}
              placeholder="1-10 (1 = Very Unsatisfied, 10 = Very Satisfied)"
              min="1"
              max="10"
            />

            <FormField
              label="Salary Per Year ($)"
              name="income"
              type="number"
              value={stepData.income || ""}
              onChange={handleChange}
              error={errors.income}
              placeholder="e.g., 60000"
              min="0"
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
