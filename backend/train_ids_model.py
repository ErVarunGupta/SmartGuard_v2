import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler

# Load dataset
df = pd.read_csv("data/ids_dataset.csv")

X = df.drop("label", axis=1)
y = df["label"]

# Scaling
scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X)

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42
)

# Train
model = RandomForestClassifier(n_estimators=50)
model.fit(X_train, y_train)

print("Train Accuracy:", model.score(X_train, y_train))
print("Test Accuracy:", model.score(X_test, y_test))

# Save
joblib.dump(model, "models/ids_model.pkl")
joblib.dump(scaler, "models/ids_scaler.pkl")

print("✅ IDS Model Saved")