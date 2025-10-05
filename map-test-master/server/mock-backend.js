// Mock backend para desarrollo/demo
// Ejecutar: node server/mock-backend.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const upload = multer();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/predict', (req, res) => {
  res.json({
    predictions: [
      'Pico de floración en Andalucía en 12 días',
      'Riesgo de escasez en Castilla-La Mancha',
      'Migración masiva detectada hacia el norte'
    ]
  });
});

app.post('/analyze-image', upload.single('file'), (req, res) => {
  // En el mock, respondemos con un resultado fijo
  res.json({ result: 'Imagen analizada (demo): flores detectadas' });
});

app.post('/ask', (req, res) => {
  const question = req.body?.question || '';
  // Respuesta simple simulada
  res.json({ answer: `Respuesta demo a: ${question}` });
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Mock backend escuchando en http://localhost:${port}`));
