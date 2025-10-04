from fastapi import FastAPI, UploadFile, File

from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import BaseModel
import tempfile
import os


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuración del cliente OpenAI para LM Studio local
client = OpenAI(base_url="http://localhost:1234/v1", api_key="lm-studio")




@app.get("/predict")
def predict():
    # Ejemplo de predicción estática
    return {"predictions": [
        "Pico de floración en Andalucía en 12 días",
        "Riesgo de escasez en Castilla-La Mancha",
        "Migración masiva detectada hacia el norte"
    ]}


# Endpoint de análisis de imagen (placeholder, requiere integración con modelo multimodal si se desea)
@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...), task: str = "Detecta floración y estado del ecosistema"):
    return {"result": "Funcionalidad de análisis de imagen no implementada en el clon local."}



# Modelo para la petición /ask
class AskRequest(BaseModel):
    question: str

@app.post("/ask")
async def ask_ia(req: AskRequest):
    # Usar el modelo local para responder preguntas
    messages = [
        {"role": "user", "content": req.question}
    ]
    response = client.chat.completions.create(
        model="lmstudio-community/Meta-Llama-3-8B-Instruct-GGUF",
        messages=messages,
        temperature=0.7
    )
    return {"answer": response.choices[0].message.content}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
