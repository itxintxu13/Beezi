from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from phi.agent import Agent
from phi.model.google import Gemini
from phi.model.openai import OpenAIChat
import tempfile
import os

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Agente multimodal (Gemini)
multimodal_agent = Agent(model=Gemini(id="gemini-2.0-flash-thinking-exp-1219"), markdown=True)
# Agente reasoning (GPT-4o)
reasoning_agent = Agent(model=OpenAIChat(id="gpt-4o"), reasoning=True, markdown=True, structured_outputs=True)

@app.get("/predict")
def predict():
    # Aquí puedes poner lógica real de predicción si tienes datos
    return {"predictions": [
        "Pico de floración en Andalucía en 12 días",
        "Riesgo de escasez en Castilla-La Mancha",
        "Migración masiva detectada hacia el norte"
    ]}

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...), task: str = "Detecta floración y estado del ecosistema"):
    with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp_file:
        tmp_file.write(await file.read())
        temp_path = tmp_file.name
    try:
        response = multimodal_agent.run(task, images=[temp_path])
        return {"result": response.content}
    finally:
        if os.path.exists(temp_path):
            os.unlink(temp_path)

@app.post("/ask")
async def ask_ia(question: str):
    response = reasoning_agent.run(question)
    return {"answer": response.content}
