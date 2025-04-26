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

        # Map React form fields to DataFrame columns
        user_data = pd.DataFrame([{
            'Age': safe_float(data.get('age')),
            'Gender': map_gender_to_value(data.get('gender', '')),
            'High_School_GPA': safe_float(data.get('highSchoolGPA')),
            'University_GPA': safe_float(data.get('universityGPA')),
            'Field_of_Study': map_major_to_field(data.get('major', '')),
            'Internships_Completed': safe_float(data.get('internshipsCompleted')),
            'Career_Satisfaction': safe_float(data.get('jobSatisfaction')),
            'Current_Job_Level': map_job_level(data.get('jobLevel', ''))
        }])

        print(f"Mapped user data: {user_data}")

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
        return jsonify({'error': str(e)}), 400

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
        - Expected Age of Crisis: {calculate_crisis_age(float(age), prediction)}

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

# Helper functions
def map_gender_to_value(gender):
    if gender.lower() == 'male':
        return 0
    elif gender.lower() == 'female':
        return 1
    else:
        return 2  # Other

def map_major_to_field(major):
    if not major:
        return 0
    major_lower = major.strip().lower()
    major_map = {
        'computer science': 1, 'cs': 1, 'comp sci': 1, 'informatics': 1,
        'engineering': 1, 'engineer': 1, 'electrical engineering': 1, 'mechanical engineering': 1,
        'business': 2, 'finance': 2, 'economics': 2,
        'english': 3, 'history': 3, 'psychology': 3, 'sociology': 3,
        'art': 4, 'music': 4, 'theater': 4, 'design': 4,
        'medicine': 5, 'nursing': 5, 'biology': 5
    }
    for key, value in major_map.items():
        if key in major_lower:
            return value
    return 0

def map_job_level(job_level):
    level_map = {
        'Entry': 1,
        'Mid': 2,
        'Senior': 3,
        'Executive': 4
    }
    return level_map.get(job_level, 1)

def calculate_crisis_age(current_age, prediction):
    if prediction < 5:
        years_until_crisis = 5
    elif prediction < 7:
        years_until_crisis = 10
    else:
        years_until_crisis = 15
    crisis_age = current_age + years_until_crisis
    return min(max(crisis_age, 35), 70)

def calculate_severity(prediction):
    severity = 10 - prediction
    return min(max(round(severity, 1), 1), 10)

def determine_crisis_type(prediction, user_data, form_data):
    job_satisfaction = float(form_data.get('jobSatisfaction', 5))
    income = form_data.get('income', 'Average')
    hobbies = form_data.get('hobbies', 'None')

    if prediction < 4:
        if job_satisfaction <= 2:
            return "Career change to follow passion"
        elif income in ['High', 'Very High']:
            return "Buys impractical sports car"
        else:
            return "Goes back to school"
    elif prediction < 7:
        if hobbies == 'Creative':
            return "Joins a rock band"
        elif income in ['High', 'Very High']:
            return "Takes a sabbatical year"
        else:
            return "Radical image change"
    else:
        if hobbies == 'Physical':
            return "Extreme hobby adoption"
        else:
            return "Sudden travel obsession"

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5001)
