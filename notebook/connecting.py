import pickle
import pandas as pd
import os
import sys
from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
import openai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set up OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")
print(f"OpenAI API Key set: {'Yes' if openai.api_key and openai.api_key.startswith('sk-') else 'No'}")

# Load your trained model
try:
    with open('../frontend/random_forest_model.pkl', 'rb') as f:
        model = pickle.load(f)
        
    # Print feature names if available for debugging
    if hasattr(model, 'feature_names_in_'):
        print("Model expects these features:", model.feature_names_in_)
except Exception as e:
    print(f"Error loading model: {e}")
    # Create a dummy model for testing if the real one can't be loaded
    class DummyModel:
        def predict(self, X):
            return [3.5]  # Return a dummy prediction
    model = DummyModel()
    print("Using dummy model for testing")

app = Flask(__name__)
CORS(app)

@app.route('/api/predict', methods=['POST'])
def predict_api():
    try:
        print("Received request at /api/predict")
        data = request.json
        print(f"Incoming JSON data: {data}")

        def safe_float(value, default=0.0):
            try:
                return float(value)
            except (ValueError, TypeError):
                return default

        user_data = pd.DataFrame([{
            'University_GPA': safe_float(data.get('universityGPA')),
            'Soft_Skills_Score': calculate_soft_skills(data),
            'Networking_Score': calculate_networking(data),
            'Career_Satisfaction': safe_float(data.get('jobSatisfaction')),
            'Work_Life_Balance': calculate_work_life_balance(data)
        }])

        print(f"Mapped user data for model: {user_data}")
        prediction = model.predict(user_data)[0]
        print(f"Prediction from Random Forest: {prediction}")

        current_age = safe_float(data.get('age'), 30)
        crisis_age = calculate_crisis_age(current_age, prediction)
        print(f"Calculated crisis age: {crisis_age}")

        severity = calculate_severity(prediction)
        crisis_type = determine_crisis_type(prediction, user_data, data)
        print(f"Severity: {severity}, Crisis Type: {crisis_type}")

        # Get silly crash title
        crashout_title = get_silly_crash_title(crisis_type)
        print(f"Silly Crashout Title: {crashout_title}")

        # Get serious prevention steps
        prevention_steps = get_prevention_steps(data, prediction, severity, crisis_type)
        print(f"Steps to Prevent: {prevention_steps}")

        response = {
            'prediction': float(prediction),
            'crisisAge': crisis_age,
            'severity': severity,
            'type': crashout_title,
            'stepsToPrevent': prevention_steps
        }

        print("Sending response:", response)
        return jsonify(response)

    except Exception as e:
        print(f"Error in prediction API: {e}")
        return jsonify({'error': str(e)}), 400

# --- Test endpoints for OpenAI functions ---

@app.route('/api/test-silly-title', methods=['POST'])
def test_silly_title():
    try:
        data = request.json
        crisis_type = data.get('crisisType', 'Unknown crisis')
        
        print(f"Testing silly title generation for crisis type: {crisis_type}")
        
        # Call the OpenAI function directly
        silly_title = get_silly_crash_title(crisis_type)
        
        print(f"Generated silly title: {silly_title}")
        return jsonify({'title': silly_title})
    except Exception as e:
        print(f"Error testing silly title API: {e}")
        return jsonify({'error': str(e)}), 400

@app.route('/api/test-prevention', methods=['POST'])
def test_prevention():
    try:
        data = request.json
        print(f"Testing prevention steps with data: {data}")
        
        # Call the OpenAI function directly
        prevention_steps = get_prevention_steps(
            data,                     # Form data
            3.5,                      # Prediction (mock value)
            7,                        # Severity (mock value)
            data.get('crisisType', 'Career change')  # Crisis type
        )
        
        print(f"Generated prevention steps: {prevention_steps}")
        return jsonify({'steps': prevention_steps})
    except Exception as e:
        print(f"Error testing prevention steps API: {e}")
        return jsonify({'error': str(e)}), 400

@app.route('/api/check-openai-config', methods=['GET'])
def check_openai_config():
    try:
        # Check if API key is set
        api_key = os.getenv("OPENAI_API_KEY")
        key_status = "Set" if api_key and api_key.startswith("sk-") else "Missing or Invalid"
        
        # Check if dotenv loaded correctly
        dotenv_status = "Loaded" if os.getenv("OPENAI_API_KEY") is not None else "Not loaded"
        
        # Check for OpenAI module
        openai_status = "Imported" if 'openai' in sys.modules else "Import Error"
        
        # Try a simple OpenAI API call to verify key works
        api_working = "Unknown"
        try:
            if api_key and api_key.startswith("sk-"):
                response = openai.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": "Hello"}],
                    max_tokens=5
                )
                api_working = "Working" if response else "Failed"
        except Exception as e:
            api_working = f"Error: {str(e)}"
        
        # Return config status
        config_data = {
            'api_key_status': key_status,
            'dotenv_status': dotenv_status,
            'openai_module_status': openai_status,
            'api_working': api_working,
            'env_file_path': os.path.abspath('.env') if os.path.exists('.env') else "Not found"
        }
        print("OpenAI config check:", config_data)
        return jsonify(config_data)
    except Exception as e:
        error_msg = f"Error checking OpenAI config: {str(e)}"
        print(error_msg)
        return jsonify({'error': error_msg}), 500

# --- OpenAI integration functions ---

def get_silly_crash_title(crisis_type):
    try:
        prompt = f"Give a silly but creative name for a midlife crisis involving: {crisis_type}. Keep it under 6 words, make it fun."
        
        print(f"Sending OpenAI request for silly title with prompt: {prompt}")
        
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=30,
            temperature=0.9
        )
        
        title = response.choices[0].message.content.strip()
        print(f"OpenAI returned silly title: {title}")
        return title
    except Exception as e:
        print(f"Error getting silly crash title: {e}")
        return f"Hilarious {crisis_type}"  # Fallback title if OpenAI fails

def get_prevention_steps(form_data, prediction, severity, crisis_type):
    try:
        age = form_data.get('age', 'unknown')
        job_satisfaction = form_data.get('jobSatisfaction', 'unknown')
        health = form_data.get('health', 'unknown')
        hobbies = form_data.get('hobbies', 'unknown')

        prompt = f"""
        Give helpful, practical steps this person can take to avoid a midlife crisis titled "{crisis_type}". 
        They are {age} years old, with job satisfaction {job_satisfaction}/5, health: {health}, hobbies: {hobbies}. 
        Provide 3-4 bullet points on actions they can take right now.
        """
        
        print(f"Sending OpenAI request for prevention steps with prompt: {prompt}")

        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=150,
            temperature=0.7
        )
        
        steps = response.choices[0].message.content.strip()
        print(f"OpenAI returned prevention steps: {steps}")
        return steps
    except Exception as e:
        print(f"Error getting prevention steps: {e}")
        return "Unable to generate prevention advice at this time."

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