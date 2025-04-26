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
    careerType: string;
    income: string;
    jobLevel: string;
    health: string;
    hobbies: string;
  }
  
  export interface Prediction {
    crisisAge: number;
    severity: number;
    type: string;
  }