import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
}

const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  name, 
  type, 
  value, 
  onChange, 
  error, 
  placeholder 
}) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`form-control ${error ? 'error' : ''}`}
      />
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default FormField;