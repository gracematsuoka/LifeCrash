import { FormData } from '../types';

export const initialFormData: FormData = {
  age: '',
  gender: '',
  relationshipStatus: '',
  children: '',
  education: '',
  jobSatisfaction: '',
  income: '',
  health: '',
  hobbies: '',
  highSchoolGPA: '',
  satScore: '',
  universityName: '',
  major: '',
  universityGPA: '',
  internshipsCompleted: '',
  jobLevel: '',
};

export const getFieldsForStep = (currentStep: number): string[] => {
  switch (currentStep) {
    case 1:
      return ['age', 'relationshipStatus', 'children'];
    case 2:
      return ['education'];
    case 3:
      return ['careerType', 'jobSatisfaction', 'income'];
    case 4:
      return ['health'];
    case 5:
      return ['hobbies'];
    default:
      return [];
  }
};

export const validateForm = (
  stepData: Partial<FormData>, 
  step: number, 
  setErrors: React.Dispatch<React.SetStateAction<Partial<FormData>>>
): boolean => {
  const newErrors: Partial<FormData> = {};
  let isValid = true;

  // Check which fields should be validated based on current step
  const fieldsToValidate = getFieldsForStep(step);
  
  fieldsToValidate.forEach(field => {
    if (!stepData[field as keyof FormData] || stepData[field as keyof FormData]?.trim() === '') {
      newErrors[field as keyof FormData] = 'This field is required';
      isValid = false;
    }
  });

  // Special validation for numeric fields
  if (stepData.age && !/^\d+$/.test(stepData.age)) {
    newErrors.age = 'Age must be a number';
    isValid = false;
  }

  if (stepData.children && !/^\d+$/.test(stepData.children)) {
    newErrors.children = 'Number of children must be a number';
    isValid = false;
  }

  if (stepData.jobSatisfaction && (parseInt(stepData.jobSatisfaction) < 1 || parseInt(stepData.jobSatisfaction) > 5)) {
    newErrors.jobSatisfaction = 'Job satisfaction must be between 1-5';
    isValid = false;
  }

  setErrors(newErrors);
  return isValid;
};