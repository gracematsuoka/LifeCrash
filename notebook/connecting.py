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

if __name__ == "__main__":
    app.run(debug=True)