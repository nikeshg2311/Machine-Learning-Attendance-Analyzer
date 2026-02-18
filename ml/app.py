from fastapi import FastAPI
import joblib

app = FastAPI()

model = joblib.load("model.pkl")

@app.get("/predict")
def predict(total:int, present:int):

    prediction = model.predict([[total,present]])[0]
    probability = model.predict_proba([[total,present]])[0][1]

    return {
        "risk": int(prediction),
        "probability": float(probability)
    }
