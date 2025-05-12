require('dotenv').config();
const http = require('node:http');
const express = require('express');
const app = express();
const port = 3000;
const axios = require('axios');

const { e1 } = require('./E1/sonda-silenciosa');


// Middleware para parsing de JSON
app.use(express.json());

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Middleware para debugging de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message
  });
});

// Ruta GET
app.get('/', (req, res) => {
  res.send('¡Hola mundo!');
});

// Registry
app.post('/register', async (req, res) => {
  try {
    const headers = {
      'Content-Type': 'application/json'
    }

    const response = await axios.post(`${process.env.URL_BASE}v1/register`, {
      alias: 'leo_husky',
      country: 'ARG',
      email: 'leednavarro@gmail.com',
      apply_role: 'engineering'
    }, {headers: headers});

    res.json(response.data);
  } catch (error) {
    console.error('Error en /register:', error);
    res.status(error.response?.status || 500).json({
      error: 'Error en el registro',
      message: error.message
    });
  }
});

app.get('/E1', async (req, res) => {
  const response = await e1();
  res.json('Lito');
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
  console.log(`URL_BASE: ${process.env.URL_BASE}`);
});