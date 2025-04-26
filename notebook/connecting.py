import pickle
import pandas as pd
import os
from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
import openai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set up OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

# Load your trained model
with open('../frontend/random_forest_model.pkl', 'rb') as f:
    model = pickle.load(f)
    
# Print feature names if available for debugging
if hasattr(model, 'feature_names_in_'):
    print("Model expects these features:", model.feature_names_in_)

app = Flask(__name__)
CORS(app)

@app.route('/api/predict', methods=['POST'])
def predict_api():
    try:
        print("Received request at /api/predict")

        # Get JSON data from React
        data = request.json
        print(f"Incoming JSON data: {data}")

        # Handle missing/empty values safely
        def safe_float(value, default=0.0):
            try:
                return float(value)
            except (ValueError, TypeError):
                return default

        # Based on the notebook images, the model was trained with these exact features
        # Image 3 shows Feature Importance with: University_GPA, Soft_Skills_Score, Networking_Score, 
        # Career_Satisfaction, Work_Life_Balance
        user_data = pd.DataFrame([{
            'University_GPA': safe_float(data.get('universityGPA')),
            'Soft_Skills_Score': calculate_soft_skills(data),
            'Networking_Score': calculate_networking(data),
            'Career_Satisfaction': safe_float(data.get('jobSatisfaction')),
            'Work_Life_Balance': calculate_work_life_balance(data)
        }])

        print(f"Mapped user data for model: {user_data}")

        # Make prediction
        prediction = model.predict(user_data)[0]
        print(f"Prediction from Random Forest: {prediction}")

        # Calculate crisis age based on current age and prediction
        current_age = safe_float(data.get('age'), 30)
        crisis_age = calculate_crisis_age(current_age, prediction)
        print(f"Calculated crisis age: {crisis_age}")

        # Determine severity and type based on prediction
        severity = calculate_severity(prediction)
        crisis_type = determine_crisis_type(prediction, user_data, data)
        print(f"Severity: {severity}, Crisis Type: {crisis_type}")

        # Get AI analysis from OpenAI
        ai_analysis = get_ai_analysis(data, prediction, severity, crisis_type)
        print(f"AI Analysis: {ai_analysis}")

        # Prepare response
        response = {
            'prediction': float(prediction),
            'crisisAge': crisis_age,
            'severity': severity,
            'type': crisis_type,
            'aiAnalysis': ai_analysis
        }

        print("Sending response:", response)
        return jsonify(response)

    except Exception as e:
        print(f"Error in prediction API: {e}")
        error_message = str(e)
        
        # Provide more helpful error message for common issues
        if "Feature names" in error_message and "fit time" in error_message:
            # Extract expected feature names from error
            import re
            seen_features = []
            if "Feature names seen at fit time" in error_message:
                seen_match = re.search(r"Feature names seen at fit time.*?:(.*?)(?:Feature names|$)", 
                                    error_message, re.DOTALL)
                if seen_match:
                    seen_text = seen_match.group(1)
                    seen_features = [f.strip() for f in re.findall(r'- ([^\n]+)', seen_text) if f.strip()]
            
            error_message = f"Model feature mismatch. Model expects these features: {', '.join(seen_features)}"
        
        return jsonify({'error': error_message}), 400

# Helper functions for calculating missing features - based on your notebook
def calculate_soft_skills(data):
    # Example calculation for soft skills based on job level and education
    education_level = map_education_to_level(data.get('education', 'Bachelor'))
    job_level = map_job_level_to_score(data.get('jobLevel', 'Mid'))
    
    # Simple formula: combine education and job level
    score = (education_level * 0.6) + (job_level * 0.4)
    return max(min(score, 5), 1)  # Keep between 1-5

def calculate_networking(data):
    # Example calculation for networking score
    job_level = map_job_level_to_score(data.get('jobLevel', 'Mid'))
    hobbies = data.get('hobbies', '')
    
    # Social hobbies indicate better networking
    hobby_score = 4 if 'Social' in hobbies else 3
    
    # Higher job levels typically correlate with better networking
    score = (job_level * 0.7) + (hobby_score * 0.3)
    return max(min(score, 5), 1)  # Keep between 1-5

def calculate_work_life_balance(data):
    # Example calculation for work-life balance
    job_satisfaction = safe_float(data.get('jobSatisfaction', 3), 3)
    hobbies = data.get('hobbies', '')
    
    # Having any hobbies indicates better work-life balance
    hobby_factor = 4 if hobbies else 2
    
    # Simple formula
    score = (job_satisfaction * 0.5) + (hobby_factor * 0.5)
    return max(min(score, 5), 1)  # Keep between 1-5

# OpenAI integration for enhanced analysis
def get_ai_analysis(form_data, prediction, severity, crisis_type):
    try:
        age = form_data.get('age', 'unknown')
        gender = form_data.get('gender', 'unknown')
        education = form_data.get('education', 'unknown')
        major = form_data.get('major', 'unknown')
        job_satisfaction = form_data.get('jobSatisfaction', 'unknown')
        health = form_data.get('health', 'unknown')
        hobbies = form_data.get('hobbies', 'unknown')

        prompt = f"""
        As a life coach and career analyst, provide a personalized analysis of this person's midlife crisis prediction.

        Individual's Profile:
        - Age: {age}
        - Gender: {gender}
        - Education: {education}
        - Field of Study: {major}
        - Job Satisfaction (1-5): {job_satisfaction}
        - Health/Exercise Habits: {health}
        - Primary Hobby Type: {hobbies}

        Model's Prediction:
        - Crisis Risk Score: {prediction}/10
        - Severity: {severity}/10
        - Predicted Crisis Type: {crisis_type}
        - Expected Age of Crisis: {calculate_crisis_age(float(age) if age != 'unknown' else 30, prediction)}

        Based on this information, provide a 2-3 paragraph personalized analysis including:
        1. Key factors contributing to their risk level
        2. How their education and career choices impact their trajectory
        3. Practical advice to mitigate their crisis risk
        4. The most critical area they should focus on for prevention

        Your analysis should be supportive, honest, and insightful.
        """

        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a compassionate life coach and career analyst specializing in midlife crisis prevention."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=400,
            temperature=0.7
        )

        ai_analysis = response.choices[0].message.content.strip()
        return ai_analysis

    except Exception as e:
        print(f"Error getting AI analysis: {e}")
        return "Unable to generate AI analysis at this time."

# Additional helper functions
def safe_float(value, default=0.0):
    try:
        return float(value)
    except (ValueError, TypeError):
        return default

def map_education_to_level(education):
    education_map = {
        'High School': 1,
        'Associate': 2,
        'Bachelor': 3,
        'Bachelor\'s Degree': 3,
        'Master': 4,
        'Master\'s Degree': 4,
        'Doctorate': 5,
        'PhD': 5
    }
    return education_map.get(education, 3)  # Default to Bachelor level

def map_job_level_to_score(job_level):
    level_map = {
        'Entry': 1,
        'Mid': 3,
        'Senior': 4,
        'Executive': 5
    }
    return level_map.get(job_level, 3)  # Default to Mid level

def map_health_to_score(health):
    health_map = {
        'Poor': 1,
        'Below Average': 2,
        'Average': 3,
        'Active': 4,
        'Fitness Enthusiast': 5,
        'Above Average': 4,
        'Excellent': 5
    }
    return health_map.get(health, 3)  # Default to Average

def calculate_crisis_age(current_age, prediction):
    # Based on your notebook code, prediction is Crisis_Intensity
    # Lower number means more severe crisis
    if prediction < 2:
        years_until_crisis = 3
    elif prediction < 3:
        years_until_crisis = 5
    elif prediction < 4:
        years_until_crisis = 8
    else:
        years_until_crisis = 12
        
    crisis_age = current_age + years_until_crisis
    return min(max(int(crisis_age), 35), 70)  # Keep between 35-70 and whole number

def calculate_severity(prediction):
    # Based on images, lower prediction means higher crisis intensity
    # So we invert it for the severity display (10 = max severity)
    max_prediction = 5  # Based on the scale seen in the plots
    severity = max_prediction - prediction
    normalized_severity = (severity / max_prediction) * 10
    return min(max(round(normalized_severity, 1), 1), 10)  # Keep between 1-10

def determine_crisis_type(prediction, user_data, form_data):
    job_satisfaction = safe_float(form_data.get('jobSatisfaction', 5))
    income = form_data.get('income', '')
    income_value = safe_float(income, 50000)
    hobbies = form_data.get('hobbies', '')
    
    # Based on your notebook's assign_crisis_type function
    if prediction < 2:  # High intensity crisis
        if job_satisfaction <= 2:
            return "Career change to follow passion"
        elif income_value > 100000:
            return "Buys impractical sports car"
        else:
            return "Goes back to school"
    elif prediction < 3.5:  # Medium intensity
        if "Creative" in hobbies:
            return "Joins a rock band"
        elif income_value > 80000:
            return "Takes a sabbatical year"
        else:
            return "Radical image change"
    else:  # Low intensity
        if "Physical" in hobbies or "Fitness" in form_data.get('health', ''):
            return "Extreme hobby adoption"
        else:
            return "Sudden travel obsession"

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5001)