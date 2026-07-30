---
title: Student Mindscape AI - Mental Health Predictor
emoji: 🧠
colorFrom: indigo
colorTo: purple
sdk: docker
app_port: 7860
pinned: false
---

# 🧠 Student Mindscape AI - Mental Health Score Predictor

An interactive machine learning web application built with **FastAPI**, **Scikit-Learn**, and a modern **Glassmorphism UI** (HTML/CSS/JS). This application predicts mental health score ranges based on lifestyle factors, study habits, and personal parameters.

---

## 🚀 Features

- **Interactive UI**: Clean, glassmorphism design rendered seamlessly.
- **FastAPI Backend**: Fast, asynchronous REST API with Pydantic request validation.
- **Machine Learning**: Scikit-Learn model trained to evaluate mental health indicators.
- **Dockerized Deployment**: Fully containerized using Docker for instant execution on Hugging Face Spaces.

---

## 🛠️ Tech Stack

- **Backend**: Python, FastAPI, Uvicorn, Pydantic
- **Machine Learning**: Scikit-Learn, Joblib, NumPy, Pandas
- **Frontend**: HTML5, CSS3, JavaScript (Fetch API)
- **Deployment**: Docker, Hugging Face Spaces

---

## 📁 Project Structure

```text
├── Dockerfile                  # Container instructions
├── README.md                  # Space metadata & documentation
├── main.py                    # FastAPI application & model endpoints
├── requirements.txt           # Python dependencies
├── mental_health_model.pkl    # Trained Scikit-Learn ML model
└── index.html                 # Frontend Glassmorphism interface
