from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Literal
import joblib
import pandas as pd

# Load ML Pipeline Model (.pkl)
model = joblib.load("mental_health_model.pkl")

app = FastAPI(title="Mental Health Score API")

# Setup CORS middleware for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schema for Validation
class StudentData(BaseModel):
    age: int = Field(..., ge=10, le=100)
    gender: Literal["Male", "Female"]
    country: str
    academic_level: Literal["Undergraduate", "Graduate", "High School"]
    most_used_platform: str
    purpose_of_use: Literal["Entertainment", "Education", "Networking", "News"]
    avg_daily_usage_hours: float = Field(..., ge=0.0, le=24.0)
    daily_unlocks: int = Field(..., ge=0)
    study_hours: float = Field(..., ge=0.0, le=24.0)
    physical_activity_hours: float = Field(..., ge=0.0, le=24.0)
    sleep_hours_per_night: float = Field(..., ge=0.0, le=24.0)
    stress_level: Literal["Low", "Medium", "High", "Very High"]

class PredictionResponse(BaseModel):
    predicted_mental_health_score: float

@app.get("/")
def home():
    return {"message": "Mental Health API Active"}

@app.post("/predict", response_model=PredictionResponse)
def predict(data: StudentData):
    # Top 10 Countries logic used in video
    top_countries = ['India', 'United States', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Brazil', 'Japan', 'China']
    grouped_country = data.country if data.country in top_countries else 'Other'

    # Convert request payload to Pandas DataFrame
    # Note: Keys updated with underscores to match the ML Model's expected columns!
    input_df = pd.DataFrame([{
        'Age': data.age,
        'Gender': data.gender,
        'Country': data.country,
        'Academic_Level': data.academic_level,
        'Most_Used_Platform': data.most_used_platform,
        'Purpose_Of_Use': data.purpose_of_use,
        'Avg_Daily_Usage_Hours': data.avg_daily_usage_hours,
        'Daily_Unlocks': data.daily_unlocks,
        'Study_Hours': data.study_hours,
        'Physical_Activity_Hours': data.physical_activity_hours,
        'Sleep_Hours_Per_Night': data.sleep_hours_per_night,
        'Stress_Level': data.stress_level,
        'Grouped_Country': grouped_country
    }])

    # Model prediction
    prediction = model.predict(input_df)[0]

    return PredictionResponse(
        predicted_mental_health_score=round(float(prediction), 2)
    )