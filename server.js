const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint para crear un render
app.post('/api/renders', async (req, res) => {
  const { apiKey, payload } = req.body;

  if (!apiKey) {
    return res.status(400).json({ error: 'API Key es requerida' });
  }

  try {
    const response = await fetch('https://api.plainlyvideos.com/api/v2/renders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(apiKey + ':').toString('base64')
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok) {
      res.json(data);
    } else {
      res.status(response.status).json(data);
    }
  } catch (error) {
    console.error('Error al crear render:', error);
    res.status(500).json({ error: 'Error al conectar con la API de Plainly Videos' });
  }
});

// Endpoint para verificar el estado de un render
app.get('/api/renders/:id', async (req, res) => {
  const { id } = req.params;
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(400).json({ error: 'API Key es requerida en el header x-api-key' });
  }

  try {
    const response = await fetch(`https://api.plainlyvideos.com/api/v2/renders/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(apiKey + ':').toString('base64')
      }
    });

    const data = await response.json();

    if (response.ok) {
      res.json(data);
    } else {
      res.status(response.status).json(data);
    }
  } catch (error) {
    console.error('Error al verificar render:', error);
    res.status(500).json({ error: 'Error al conectar con la API de Plainly Videos' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
