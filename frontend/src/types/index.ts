export interface FormData {
    age: string;
    relationshipStatus: string;
    children: string;
    education: string;
    highSchoolGPA: string;  // Added for High School GPA
    satScore: string;       // Added for SAT Score
    universityName: string; // Added for University name
    major: string;          // Added for Major
    universityGPA: string;  // Added for University GPA
    jobSatisfaction: string;
    careerType: string;
    income: string;
    health: string;
    hobbies: string;
  }
  
  export interface Prediction {
    crisisAge: number;
    severity: number;
    type: string;
  }