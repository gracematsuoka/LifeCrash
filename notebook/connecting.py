import pickle
import pandas as pd
from flask import Flask, request, render_template, jsonify
from flask_cors import CORS  # pip install flask-cors

# Load your trained model
with open('random_forest_model.pkl', 'rb') as f:
    model = pickle.load(f)

app = Flask(__name__)
CORS(app)  # Enable CORS for React integration

# New API endpoint for React frontend
@app.route('/api/predict', methods=['POST'])
def predict_api():
    try:
        # Get JSON data from React
        data = request.json

        # Map React form fields to your DataFrame columns
        user_data = pd.DataFrame([{
            'Age': float(data.get('age', 0)),
            'Gender': map_gender_to_value(data.get('gender', '')),
            'High_School_GPA': float(data.get('highSchoolGPA', 0)),
            'University_GPA': float(data.get('universityGPA', 0)),
            'Field_of_Study': map_major_to_field(data.get('major', '')),
            'Internships_Completed': float(data.get('internshipsCompleted', 0)),
            'Career_Satisfaction': float(data.get('jobSatisfaction', 0)),
            'Current_Job_Level': map_job_level(data.get('jobLevel', ''))
        }])

        # Make prediction
        prediction = model.predict(user_data)[0]

        # Calculate crisis age based on current age and prediction
        current_age = float(data.get('age', 30))
        crisis_age = calculate_crisis_age(current_age, prediction)

        # Determine severity and type based on prediction
        severity = calculate_severity(prediction)
        crisis_type = determine_crisis_type(prediction, user_data, data)

        # Prepare response for React
        response = {
            'prediction': float(prediction),
            'crisisAge': crisis_age,
            'severity': severity,
            'type': crisis_type
        }

        return jsonify(response)

    except Exception as e:
        print(f"Error in prediction API: {e}")
        return jsonify({'error': str(e)}), 400

# Keep the original web form endpoint
@app.route('/', methods=['GET', 'POST'])
def predict():
    if request.method == 'POST':
        # Get user input from form
        age = float(request.form['Age'])
        gender = float(request.form['Gender'])
        hsgpa = float(request.form['High_School_GPA'])
        unigpa = float(request.form['University_GPA'])
        major = float(request.form['Field_of_Study'])
        internships = float(request.form['Internships_Completed'])
        career_satisfaction = float(request.form['Career_Satisfaction'])
        currentjoblvl = float(request.form['Current_Job_Level'])

        # Put into a DataFrame (columns must match training data columns)
        user_data = pd.DataFrame([{
            'Age': age,
            'Gender': gender,
            'High_School_GPA': hsgpa,
            'University_GPA': unigpa,
            'Field_of_Study': major,
            'Internships_Completed': internships,
            'Career_Satisfaction': career_satisfaction,
            'Current_Job_Level': currentjoblvl
        }])

        # Predict
        prediction = model.predict(user_data)[0]

        return render_template('result.html', prediction=prediction)

    return render_template('form.html')

# Helper functions for data mapping

def map_gender_to_value(gender):
    """Map gender string to numeric value"""
    if gender.lower() == 'male':
        return 0
    elif gender.lower() == 'female':
        return 1
    else:
        return 2  # Other

def map_major_to_field(major):
    """Enhanced mapping for major text to Field_of_Study numeric code with many synonyms."""
    if not major:
        return 0

    major_lower = major.strip().lower()

    major_map = {
        # STEM Fields
        'computer science': 1, 'cs': 1, 'comp sci': 1, 'informatics': 1,
        'engineering': 1, 'engineer': 1,
        'electrical engineering': 1, 'ee': 1, 'elec eng': 1,
        'mechanical engineering': 1, 'mech eng': 1, 'me': 1,
        'civil engineering': 1, 'civil eng': 1, 'ce': 1,
        'chemical engineering': 1, 'chem eng': 1, 'che': 1,
        'aerospace engineering': 1, 'aero eng': 1, 'aerospace': 1,
        'biomedical engineering': 1, 'biomed eng': 1, 'bme': 1,
        'software engineering': 1, 'software eng': 1,
        'data science': 1, 'data analytics': 1,
        'mathematics': 1, 'math': 1, 'applied math': 1,
        'physics': 1, 'astrophysics': 1, 'quantum physics': 1,
        'chemistry': 1, 'biochemistry': 1, 'chemical': 1,
        'statistics': 1, 'statistical science': 1,
        'robotics': 1, 'artificial intelligence': 1, 'ai': 1,
        'machine learning': 1, 'ml': 1,

        # Business Fields
        'business': 2, 'business administration': 2, 'mba': 2,
        'finance': 2, 'financial engineering': 2,
        'marketing': 2, 'market research': 2,
        'accounting': 2, 'cpa': 2,
        'economics': 2, 'econ': 2, 'applied economics': 2,
        'management': 2, 'entrepreneurship': 2,

        # Humanities
        'english': 3, 'english literature': 3, 'literature': 3,
        'history': 3, 'world history': 3, 'american history': 3,
        'philosophy': 3, 'ethics': 3, 'logic': 3,
        'psychology': 3, 'psy': 3, 'clinical psychology': 3,
        'sociology': 3, 'social science': 3, 'anthropology': 3,
        'political science': 3, 'politics': 3, 'government': 3,
        'communications': 3, 'media studies': 3,

        # Arts
        'art': 4, 'fine arts': 4, 'visual arts': 4,
        'music': 4, 'music theory': 4, 'composition': 4,
        'theater': 4, 'theatre': 4, 'drama': 4,
        'design': 4, 'graphic design': 4, 'industrial design': 4,
        'film': 4, 'film studies': 4, 'cinema': 4,

        # Healthcare
        'medicine': 5, 'pre-med': 5, 'md': 5,
        'nursing': 5, 'rn': 5, 'bsn': 5,
        'pharmacology': 5, 'pharmacy': 5, 'pharmd': 5,
        'biology': 5, 'biological science': 5, 'microbiology': 5,
        'public health': 5, 'health sciences': 5,
        'veterinary': 5, 'vet': 5, 'dvm': 5,
        'dentistry': 5, 'dental': 5, 'dds': 5
    }

    for key, value in major_map.items():
        if key in major_lower:
            return value

    return 0  # Default if no match found

def map_job_level(job_level):
    """Map job level string to numeric value"""
    level_map = {
        'Entry': 1,
        'Mid': 2,
        'Senior': 3,
        'Executive': 4
    }

    return level_map.get(job_level, 1)  # Default to 1 if not found

def calculate_crisis_age(current_age, prediction):
    """Calculate likely age of crisis based on current age and model prediction"""
    if prediction < 5:
        years_until_crisis = 5
    elif prediction < 7:
        years_until_crisis = 10
    else:
        years_until_crisis = 15

    crisis_age = current_age + years_until_crisis
    return min(max(crisis_age, 35), 70)

def calculate_severity(prediction):
    """Calculate severity score (1-10) based on prediction"""
    severity = 10 - prediction
    return min(max(round(severity, 1), 1), 10)

def determine_crisis_type(prediction, user_data, form_data):
    """Determine type of crisis based on model and form data"""
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
    app.run(debug=True, host='0.0.0.0', port=5000)
