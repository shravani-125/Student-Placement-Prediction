# ============================================================
# STUDENT PLACEMENT PREDICTION SYSTEM
# ============================================================

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import glob
import os
import joblib

# Machine Learning
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)


# ============================================================
# 1. LOAD DATASET
# ============================================================

print("=" * 60)
print("STUDENT PLACEMENT PREDICTION SYSTEM")
print("=" * 60)

# Find CSV file inside dataset folder
csv_files = glob.glob("dataset/*.csv")

if len(csv_files) == 0:
    print("ERROR: No CSV file found inside dataset folder.")
    exit()

file_path = csv_files[0]

print("\nDataset file:", file_path)

df = pd.read_csv(file_path)

print("\nDataset loaded successfully!")


# ============================================================
# 2. BASIC DATASET INFORMATION
# ============================================================

print("\n" + "=" * 60)
print("DATASET INFORMATION")
print("=" * 60)

print("\nNumber of students:", len(df))
print("Number of columns:", len(df.columns))

print("\nColumn Names:")
print(df.columns.tolist())


# ============================================================
# 3. FIRST 5 RECORDS
# ============================================================

print("\n" + "=" * 60)
print("FIRST 5 RECORDS")
print("=" * 60)

print(df.head())


# ============================================================
# 4. PLACEMENT DISTRIBUTION
# ============================================================

print("\n" + "=" * 60)
print("PLACEMENT DISTRIBUTION")
print("=" * 60)

print(df["Placement_Status"].value_counts())


# ============================================================
# 5. MISSING VALUES CHECK
# ============================================================

print("\n" + "=" * 60)
print("MISSING VALUES")
print("=" * 60)

print(df.isnull().sum())


# ============================================================
# 6. REMOVE UNNECESSARY COLUMNS
# ============================================================

# Student_ID is only an identification number.
# It should not be used for prediction.

if "Student_ID" in df.columns:
    df = df.drop("Student_ID", axis=1)

print("\nStudent_ID removed from prediction features.")


# ============================================================
# 7. HANDLE MISSING VALUES
# ============================================================

# Numerical columns
numeric_columns = df.select_dtypes(
    include=["int64", "float64"]
).columns

for column in numeric_columns:
    df[column] = df[column].fillna(df[column].median())


# Categorical columns
categorical_columns = df.select_dtypes(
    include=["object"]
).columns

for column in categorical_columns:
    df[column] = df[column].fillna(df[column].mode()[0])


print("\nMissing values handled successfully.")

print("\nMissing values after handling:")
print(df.isnull().sum())


# ============================================================
# 8. CGPA VS PLACEMENT STATUS GRAPH
# ============================================================

print("\nCreating CGPA vs Placement Status graph...")

plt.figure(figsize=(8, 6))

sns.boxplot(
    x="Placement_Status",
    y="CGPA",
    data=df
)

plt.title("CGPA vs Placement Status")
plt.xlabel("Placement Status")
plt.ylabel("CGPA")

plt.tight_layout()
plt.show()

print("Graph completed!")


# ============================================================
# 9. ENCODING CATEGORICAL DATA
# ============================================================

print("\n" + "=" * 60)
print("ENCODING CATEGORICAL DATA")
print("=" * 60)

# Convert categorical columns into numerical values
# Example:
# Male/Female -> 0/1
# Yes/No -> 0/1

for column in df.select_dtypes(include=["object"]).columns:

    # Placement_Status is our target
    # Convert it separately

    if column == "Placement_Status":

        df[column] = df[column].astype(str).str.strip()

        df[column] = df[column].map({
            "Not Placed": 0,
            "Placed": 1
        })

    else:

        # Convert categorical values automatically
        df[column] = pd.factorize(
            df[column].astype(str).str.strip()
        )[0]


# ============================================================
# 10. CHECK ENCODING
# ============================================================

print("\nData after encoding:")
print(df.head())

print("\nMissing values after encoding:")
print(df.isnull().sum())


# Safety check
if df.isnull().sum().sum() > 0:

    print("\nERROR: NaN values are still present.")
    print("Please check your dataset values.")
    exit()


print("\nEncoding completed successfully!")


# ============================================================
# 11. FEATURES AND TARGET
# ============================================================

X = df.drop("Placement_Status", axis=1)

y = df["Placement_Status"]

print("\n" + "=" * 60)
print("FEATURES AND TARGET")
print("=" * 60)

print("\nFeatures:")
print(X.columns.tolist())

print("\nTarget:")
print("Placement_Status")


# ============================================================
# 12. TRAIN TEST SPLIT
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("\n" + "=" * 60)
print("TRAIN TEST SPLIT")
print("=" * 60)

print("\nTraining Data:", X_train.shape)
print("Testing Data:", X_test.shape)


# ============================================================
# 13. CREATE RANDOM FOREST MODEL
# ============================================================

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

print("\nRandom Forest model created.")


# ============================================================
# 14. TRAIN MODEL
# ============================================================

model.fit(X_train, y_train)

print("\nModel Training Completed!")


# ============================================================
# 15. SAVE TRAINED MODEL
# ============================================================

# Create model folder if it does not exist
os.makedirs("model", exist_ok=True)

# Save trained model
model_path = "model/model.pkl"

joblib.dump(model, model_path)

print("\nModel saved successfully!")
print("Model file:", model_path)


# ============================================================
# 16. PREDICTION
# ============================================================

y_pred = model.predict(X_test)

print("\nPrediction completed!")


# ============================================================
# 17. MODEL ACCURACY
# ============================================================

accuracy = accuracy_score(
    y_test,
    y_pred
)

print("\n" + "=" * 60)
print("MODEL ACCURACY")
print("=" * 60)

print(
    "Model Accuracy:",
    round(accuracy * 100, 2),
    "%"
)


# ============================================================
# 18. CLASSIFICATION REPORT
# ============================================================

print("\n" + "=" * 60)
print("CLASSIFICATION REPORT")
print("=" * 60)

print(
    classification_report(
        y_test,
        y_pred
    )
)


# ============================================================
# 19. CONFUSION MATRIX
# ============================================================

cm = confusion_matrix(
    y_test,
    y_pred
)

print("\n" + "=" * 60)
print("CONFUSION MATRIX")
print("=" * 60)

print(cm)

plt.figure(figsize=(6, 5))

sns.heatmap(
    cm,
    annot=True,
    fmt="d",
    cmap="Blues",
    xticklabels=["Not Placed", "Placed"],
    yticklabels=["Not Placed", "Placed"]
)

plt.title("Confusion Matrix")
plt.xlabel("Predicted")
plt.ylabel("Actual")

plt.tight_layout()
plt.show()


# ============================================================
# 20. FEATURE IMPORTANCE
# ============================================================

importance = model.feature_importances_

feature_importance = pd.DataFrame({
    "Feature": X.columns,
    "Importance": importance
})

feature_importance = feature_importance.sort_values(
    by="Importance",
    ascending=False
)

print("\n" + "=" * 60)
print("FEATURE IMPORTANCE")
print("=" * 60)

print(feature_importance)


# ============================================================
# 21. FEATURE IMPORTANCE GRAPH
# ============================================================

plt.figure(figsize=(10, 6))

plt.bar(
    feature_importance["Feature"],
    feature_importance["Importance"]
)

plt.title("Feature Importance for Placement Prediction")
plt.xlabel("Features")
plt.ylabel("Importance")

plt.xticks(
    rotation=45,
    ha="right"
)

plt.tight_layout()
plt.show()


# ============================================================
# 22. SAMPLE STUDENT PREDICTION
# ============================================================

print("\n" + "=" * 60)
print("SAMPLE STUDENT PREDICTION")
print("=" * 60)

# Take one student from test data
sample_student = X_test.iloc[0:1]

sample_prediction = model.predict(
    sample_student
)

if sample_prediction[0] == 1:
    print("\nPrediction: PLACED")
else:
    print("\nPrediction: NOT PLACED")

print("\nSample student data:")
print(sample_student)


# ============================================================
# 23. FINAL MESSAGE
# ============================================================

print("\n" + "=" * 60)
print("STUDENT PLACEMENT PREDICTION COMPLETED!")
print("=" * 60)


# ============================================================
# 24. NEW STUDENT PREDICTION
# ============================================================

print("\n===================================")
print("       NEW STUDENT PREDICTION")
print("===================================")

gender = int(input("Gender (0=Male, 1=Female): "))

percentage_10th = float(
    input("10th Percentage: ")
)

percentage_12th = float(
    input("12th Percentage: ")
)

cgpa = float(
    input("CGPA: ")
)

backlogs = int(
    input("Number of Backlogs: ")
)

internship = int(
    input("Internship (0=No, 1=Yes): ")
)

technical_skills = int(
    input("Technical Skills (0-10): ")
)

communication_skills = int(
    input("Communication Skills (0-10): ")
)

projects = int(
    input("Number of Projects: ")
)

certifications = int(
    input("Number of Certifications: ")
)

aptitude_score = int(
    input("Aptitude Score (0-100): ")
)


# ============================================================
# CREATE NEW STUDENT DATA
# ============================================================

new_student = pd.DataFrame([{
    "Gender": gender,
    "10th_Percentage": percentage_10th,
    "12th_Percentage": percentage_12th,
    "CGPA": cgpa,
    "Backlogs": backlogs,
    "Internship": internship,
    "Technical_Skills": technical_skills,
    "Communication_Skills": communication_skills,
    "Projects": projects,
    "Certifications": certifications,
    "Aptitude_Score": aptitude_score
}])


# Make sure feature order is exactly the same as training
new_student = new_student[X.columns]


# ============================================================
# PREDICTION
# ============================================================

prediction = model.predict(new_student)


print("\n===================================")
print("        PREDICTION RESULT")
print("===================================")

if prediction[0] == 1:
    print("Placement Prediction: PLACED")
else:
    print("Placement Prediction: NOT PLACED")

print("\n===================================")
print("        END OF PROGRAM")
print("===================================")