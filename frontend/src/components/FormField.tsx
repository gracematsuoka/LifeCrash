import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  min?: string;
  max?: string;
  step?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type,
  value,
  onChange,
  error,
  placeholder,
  min,
  max,
  step
}) => {
  // Handle number input restrictions
  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Convert to number for validation
    const numValue = parseFloat(value);
    
    // Special validation for specific fields
    if (name === 'jobSatisfaction') {
      // Only allow integers 1-10
      if (value === '' || (numValue >= 1 && numValue <= 10 && Number.isInteger(numValue))) {
        onChange(e);
      }
    } 
    else if (name === 'age' || name === 'children' || name === 'internshipsCompleted') {
      // Only allow positive integers
      if (value === '' || (numValue >= 0 && Number.isInteger(numValue))) {
        onChange(e);
      }
    }
    else if (name === 'highSchoolGPA' || name === 'universityGPA') {
      // Allow values between 0 and 4.0
      if (value === '' || (numValue >= 0 && numValue <= 4.0)) {
        onChange(e);
      }
    }
    else if (name === 'satScore') {
      // For SAT scores, allow any input and validate only at submission
      onChange(e);
    }
    else if (name === 'income') {
      // Allow any positive number
      if (value === '' || numValue >= 0) {
        onChange(e);
      }
    }
    else {
      // For other numeric fields, just pass through
      onChange(e);
    }
  };

  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={type === 'number' ? handleNumberInput : onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className={`form-control ${error ? 'error' : ''}`}
      />
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default FormField;