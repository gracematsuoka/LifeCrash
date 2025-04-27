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
      return ['age', 'gender', 'relationshipStatus', 'children'];
    case 2:
      return ['education', 'highSchoolGPA', 'satScore', 'universityName', 'major', 'universityGPA', 'internshipsCompleted'];
    case 3:
      return ['jobSatisfaction', 'income', 'jobLevel'];
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
    const value = stepData[field as keyof FormData];
    
    // Skip validation for optional fields
    if (field === 'highSchoolGPA' || field === 'satScore' || 
        field === 'universityName' || field === 'major' || 
        field === 'universityGPA' || field === 'internshipsCompleted') {
      return;
    }
    
    // Required field validation
    if (!value || String(value).trim() === '') {
      newErrors[field as keyof FormData] = 'This field is required';
      isValid = false;
    }
  });

  // Special validation for numeric fields
  if (stepData.age !== undefined && stepData.age !== '') {
    const ageNum = Number(stepData.age);
    if (isNaN(ageNum) || ageNum < 0 || !Number.isInteger(ageNum)) {
      newErrors.age = 'Age must be a positive whole number';
      isValid = false;
    }
  }

  if (stepData.children !== undefined && stepData.children !== '') {
    const childrenNum = Number(stepData.children);
    if (isNaN(childrenNum) || childrenNum < 0 || !Number.isInteger(childrenNum)) {
      newErrors.children = 'Number of children must be a positive whole number';
      isValid = false;
    }
  }

  if (stepData.jobSatisfaction !== undefined && stepData.jobSatisfaction !== '') {
    const satisfactionNum = Number(stepData.jobSatisfaction);
    if (isNaN(satisfactionNum) || satisfactionNum < 1 || satisfactionNum > 10 || !Number.isInteger(satisfactionNum)) {
      newErrors.jobSatisfaction = 'Job satisfaction must be a whole number between 1-10';
      isValid = false;
    }
  }

  if (stepData.income !== undefined && stepData.income !== '') {
    const incomeNum = Number(stepData.income);
    if (isNaN(incomeNum) || incomeNum < 0) {
      newErrors.income = 'Income must be a positive number';
      isValid = false;
    }
  }

  if (stepData.highSchoolGPA !== undefined && stepData.highSchoolGPA !== '') {
    const gpaNum = Number(stepData.highSchoolGPA);
    if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 4.0) {
      newErrors.highSchoolGPA = 'GPA must be between 0 and 4.0';
      isValid = false;
    }
  }

  if (stepData.universityGPA !== undefined && stepData.universityGPA !== '') {
    const gpaNum = Number(stepData.universityGPA);
    if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 4.0) {
      newErrors.universityGPA = 'GPA must be between 0 and 4.0';
      isValid = false;
    }
  }

  // Only validate SAT score if we're submitting the form (not during typing)
  if (stepData.satScore !== undefined && stepData.satScore !== '') {
    const satNum = Number(stepData.satScore);
    if (isNaN(satNum)) {
      newErrors.satScore = 'SAT score must be a number';
      isValid = false;
    } else if (satNum < 400 || satNum > 1600 || !Number.isInteger(satNum)) {
      // Still validate the range, but this will only show when they try to submit
      newErrors.satScore = 'SAT score must be a whole number between 400 and 1600';
      isValid = false;
    }
  }

  if (stepData.internshipsCompleted !== undefined && stepData.internshipsCompleted !== '') {
    const internshipsNum = Number(stepData.internshipsCompleted);
    if (isNaN(internshipsNum) || internshipsNum < 0 || !Number.isInteger(internshipsNum)) {
      newErrors.internshipsCompleted = 'Internships must be a positive whole number';
      isValid = false;
    }
  }

  setErrors(newErrors);
  return isValid;
};