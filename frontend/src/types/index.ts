export interface FormData {
    age: string;
    relationshipStatus: string;
    children: string;
    education: string;
    highSchoolGPA: string;  
    satScore: string;    
    universityName: string; 
    major: string;   
    internshipsCompleted: string;       
    universityGPA: string; 
    gender: string;         
    jobSatisfaction: string;
    income: string;
    jobLevel: string;
    health: string;
    hobbies: string;
  }
  
  export interface Prediction {
    crisisAge: number;
    severity: number;
    type: string;
    stepsToPrevent: string;
  }

  export interface Prediction {
    crisisAge: number;
    severity: number;
    type: string;
    aiAnalysis?: string; // Optional AI analysis field
  }