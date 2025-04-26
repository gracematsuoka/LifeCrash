import pickle
import pandas as pd
from flask import Flask, request, render_template

# Load your trained model
with open('random_forest_model.pkl', 'rb') as f:
    model = pickle.load(f)

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def predict():
    if request.method == 'POST':
        # Get user input from form
        gpa = float(request.form['University_GPA'])
        soft_skills = float(request.form['Soft_Skills_Score'])
        networking = float(request.form['Networking_Score'])
        career_satisfaction = float(request.form['Career_Satisfaction'])
        work_life_balance = float(request.form['Work_Life_Balance'])

        # Put into a DataFrame (columns must match training)
        user_data = pd.DataFrame([{
            'University_GPA': gpa,
            'Soft_Skills_Score': soft_skills,
            'Networking_Score': networking,
            'Career_Satisfaction': career_satisfaction,
            'Work_Life_Balance': work_life_balance
        }])

        # Predict
        prediction = model.predict(user_data)[0]

        return render_template('result.html', prediction=prediction)

    return render_template('form.html')

if __name__ == "__main__":
    app.run(debug=True)


