import pandas as pd
from sklearn.linear_model import LogisticRegression
import joblib


data = {
    "total_classes": [10,20,30,40,50,60,70,80],
    "present_classes": [8,12,15,20,30,40,55,70],
    "risk": [0,1,1,1,0,0,0,0]  # 1 = At Risk
}

df = pd.DataFrame(data)

X = df[["total_classes","present_classes"]]
y = df["risk"]

model = LogisticRegression()
model.fit(X,y)

joblib.dump(model,"model.pkl")

print("Model Trained & Saved")
