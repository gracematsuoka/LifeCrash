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
        
        # Debug logs for university data
        print(f"University Name: {data.get('universityName')}")
        print(f"University Ranking: {data.get('universityRanking')}")

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
        
        # Get the base crisis type
        base_crisis_type = determine_crisis_type(prediction, user_data, data)
        print(f"Base Crisis Type: {base_crisis_type}")

        # Get silly crash title from the base type
        crashout_title = get_silly_crash_title(base_crisis_type)
        print(f"Silly Crashout Title: {crashout_title}")

        # Get serious prevention steps - pass BOTH the silly title AND the base type
        prevention_steps = get_prevention_steps(data, prediction, severity, crashout_title)
        print(f"Steps to Prevent: {prevention_steps}")

        # Make sure to convert numpy types to Python native types for JSON serialization
        response = {
            'prediction': float(prediction),  # Convert to Python float
            'crisisAge': int(crisis_age),     # Convert to Python int
            'severity': float(severity),      # Convert to Python float
            'type': crashout_title,           # Use the generated silly title
            'stepsToPrevent': prevention_steps  # Make sure this is included
        }

        print("Sending response:", response)
        return jsonify(response)  # jsonify will serialize the response

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
        prompt = f"Give a silly but creative name for a midlife crisis involving: {crisis_type}. Keep it under 5 words, make it fun."
        
        print(f"Sending OpenAI request for silly title with prompt: {prompt}")
        
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=30,
            temperature=0.9
        )
        
        title = response.choices[0].message.content.strip()
        print(f"OpenAI returned silly title: {title}")
        
        # Remove any quotes and extra formatting
        title = title.replace('"', '').replace("'", "").strip()
        
        # Ensure we return something even if the title is empty
        if not title:
            title = f"Hilarious {crisis_type}"
            
        return title
    except Exception as e:
        print(f"Error getting silly crash title: {e}")
        return f"Hilarious {crisis_type}" 

def get_prevention_steps(form_data, prediction, severity, silly_title):
    try:
        age = form_data.get('age', 'unknown')
        job_satisfaction = form_data.get('jobSatisfaction', 'unknown')
        health = form_data.get('health', 'unknown')
        hobbies = form_data.get('hobbies', 'unknown')
        education_level = form_data.get('education', 'unknown')
        university_name = form_data.get('universityName', 'unknown')
        university_ranking = form_data.get('universityRanking')
        university_gpa = form_data.get('universityGPA', 'unknown')
        job_level = form_data.get('jobLevel', 'unknown')
        relationship_status = form_data.get('relationshipStatus', 'unknown')

        if job_satisfaction != 'unknown' and int(job_satisfaction) > 5:
            display_satisfaction = f"{job_satisfaction}/10"
        else:
            display_satisfaction = f"{job_satisfaction}/10"
            
        # Create a description of the university with ranking if available
        university_description = university_name
        if university_ranking is not None:
            university_description = f"{university_name} (ranked #{university_ranking})"

        prompt = f"""
        Give helpful, practical steps this person can take to avoid a midlife crisis titled "{silly_title}".
        They are {age} years old, with job satisfaction {display_satisfaction}, health: {health}, hobbies: {hobbies}. 
        The education level they are at is {education_level} at {university_description} with gpa of {university_gpa}. 
        They have a job level of {job_level}. The prediction score is {prediction} and the severity is {severity}. 
        They also have a relationship status of {relationship_status}.
        Provide 1-2 bullet points on actions they can take right now. Make these serious, actionable recommendations.
        Format each point as a good sentence with specific advice. And at the end make a short bullet point kind of bullying them for being in this situation. Making sure the steps were good but the last part is jokey. Dont add any **
        """
        
        print(f"Sending OpenAI request for prevention steps with prompt: {prompt}")

        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,  
            temperature=0.7
        )
        
        steps = response.choices[0].message.content.strip()
        print(f"OpenAI returned prevention steps: {steps}")
        return steps
    except Exception as e:
        print(f"Error getting prevention steps: {e}")
        return "Unable to generate prevention advice at this time."

def calculate_soft_skills(data):
    education_level = map_education_to_level(data.get('education', 'Bachelor'))
    job_level = map_job_level_to_score(data.get('jobLevel', 'Mid'))
    
    score = (education_level * 0.6) + (job_level * 0.4)
    return max(min(score, 5), 1)  

def calculate_networking(data):
    job_level = map_job_level_to_score(data.get('jobLevel', 'Mid'))
    hobbies = data.get('hobbies', '')
    
    hobby_score = 6 if 'Social' in hobbies else 3

    score = (job_level * 0.7) + (hobby_score * 0.3)
    return max(min(score, 5), 1)  

def calculate_work_life_balance(data):
    job_satisfaction_raw = safe_float(data.get('jobSatisfaction', 5), 5)
    
    job_satisfaction = job_satisfaction_raw / 2
    
    hobbies = data.get('hobbies', '')
    
    hobby_factor = 4 if hobbies else 2
    
    score = (job_satisfaction * 0.5) + (hobby_factor * 0.5)
    return max(min(score, 5), 1)

def safe_float(value, default=0.0):
    try:
        return float(value)
    except (ValueError, TypeError):
        return default

def map_education_to_level(education):
    education_map = {
        'High School': 1,
        'Associate': 2,
        'Associate\'s Degree': 2,
        'Some College': 2,
        'Bachelor': 3,
        'Bachelor\'s Degree': 3,
        'Master': 4,
        'Master\'s Degree': 4,
        'Doctorate': 5,
        'PhD': 5
    }
    return education_map.get(education, 3)  

def map_job_level_to_score(job_level):
    level_map = {
        'Entry': 1,
        'Mid': 3,
        'Senior': 4,
        'Executive': 5
    }
    return level_map.get(job_level, 3)

def map_health_to_score(health):
    health_map = {
        'Poor': 1,
        'Sedentary': 1,
        'Below Average': 2,
        'Occasional': 2,
        'Average': 3,
        'Regular': 3,
        'Active': 4,
        'Fitness Enthusiast': 5,
        'Athlete': 5,
        'Above Average': 4,
        'Excellent': 5
    }
    return health_map.get(health, 3)  

def calculate_severity(prediction):
    normalized_severity = prediction
    
    return min(max(round(normalized_severity, 1), 1), 10)

def calculate_crisis_age(current_age, prediction):
    if prediction > 8:
        years_until_crisis = 3
    elif prediction > 5:
        years_until_crisis = 8
    elif prediction > 2:
        years_until_crisis = 15
    else:
        years_until_crisis = 20
        
    crisis_age = current_age + years_until_crisis
    
    if current_age < 18:
        extra_years = max(0, 30 - current_age) * (1 - (prediction / 10))
        crisis_age += int(extra_years)
    
    return min(int(crisis_age), 70) 

def determine_crisis_type(prediction, user_data, form_data):
    job_satisfaction = safe_float(form_data.get('jobSatisfaction', 10))
    income = form_data.get('income', '')
    income_value = safe_float(income)
    hobbies = form_data.get('hobbies', '')
    
    if prediction > 4:  
        if job_satisfaction <= 2:
            return "Career change to follow passion"
        elif income_value > 100000:
            return "Buys impractical sports car"
        else:
            return "Goes back to school"
    elif prediction > 2.5:  
        if "Creative" in hobbies:
            return "Joins a rock band"
        elif income_value > 80000:
            return "Takes a sabbatical year"
        else:
            return "Radical image change"
    else:
        if "Physical" in hobbies or "Fitness" in form_data.get('health', ''):
            return "Extreme hobby adoption"
        else:
            return "Sudden travel obsession"

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5001)