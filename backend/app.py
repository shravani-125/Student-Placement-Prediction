from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

# ============================================================
# FLASK APP
# ============================================================

app = Flask(__name__)
CORS(app)


# ============================================================
# LOAD TRAINED MODEL
# ============================================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "model",
    "model.pkl"
)

model = joblib.load(MODEL_PATH)

print("===================================")
print("STUDENT PLACEMENT PREDICTION API")
print("===================================")
print("Model loaded successfully!")
print("Model path:", MODEL_PATH)


# ============================================================
# HOME ROUTE
# ============================================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "message": "Student Placement Prediction Backend is Running!",
        "status": "success"
    })


# ============================================================
# PREDICTION ROUTE
# ============================================================

@app.route("/predict", methods=["POST"])
def predict():

    try:

        # Get JSON data from React
        data = request.get_json()

        # ----------------------------------------------------
        # Create student data
        # ----------------------------------------------------

        student_data = {
            "Gender": data["Gender"],
            "10th_Percentage": data["10th_Percentage"],
            "12th_Percentage": data["12th_Percentage"],
            "CGPA": data["CGPA"],
            "Backlogs": data["Backlogs"],
            "Internship": data["Internship"],
            "Technical_Skills": data["Technical_Skills"],
            "Communication_Skills": data["Communication_Skills"],
            "Projects": data["Projects"],
            "Certifications": data["Certifications"],
            "Aptitude_Score": data["Aptitude_Score"]
        }

        # ----------------------------------------------------
        # Convert into DataFrame
        # ----------------------------------------------------

        input_data = pd.DataFrame([student_data])

        # ----------------------------------------------------
        # IMPORTANT:
        # Keep exactly the same feature order
        # used during model training
        # ----------------------------------------------------

        feature_order = [
            "Gender",
            "10th_Percentage",
            "12th_Percentage",
            "CGPA",
            "Backlogs",
            "Internship",
            "Technical_Skills",
            "Communication_Skills",
            "Projects",
            "Certifications",
            "Aptitude_Score"
        ]

        input_data = input_data[feature_order]

        # ----------------------------------------------------
        # Prediction
        # ----------------------------------------------------

        prediction = model.predict(input_data)[0]

        # ----------------------------------------------------
        # Prediction Probability
        # ----------------------------------------------------

        probability = model.predict_proba(input_data)[0]

        placed_probability = probability[1] * 100
        not_placed_probability = probability[0] * 100

        # ----------------------------------------------------
        # Result
        # ----------------------------------------------------

        if prediction == 1:

            result = "Placed"

        else:

            result = "Not Placed"

        # ----------------------------------------------------
        # Send response to React
        # ----------------------------------------------------

        return jsonify({

            "success": True,

            "prediction": result,

            "placement_probability": round(
                placed_probability,
                2
            ),

            "not_placed_probability": round(
                not_placed_probability,
                2
            )

        })


    except Exception as e:

        return jsonify({

            "success": False,

            "error": str(e)

        }), 400


# ============================================================
# RUN SERVER
# ============================================================

if __name__ == "__main__":

    app.run(
        debug=True,
        port=5000
    )