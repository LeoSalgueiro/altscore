require('dotenv').config();
const http = require('node:http');
const express = require('express');
const app = express();
const port = 3000;
const axios = require('axios');

const { e1 } = require('./E1/sonda-silenciosa');
const { e2 } = require('./E2/kepler-452b');
const { e3 } = require('./E3/busqueda-templo-sith');
const { e4 } = require('./E4/forja-elfica-olvidada');
const { e5 } = require('./E5/la-ultima-defensa-valiant');
const { e6 } = require('./E6/ciudad-prisma');
const { e8 } = require('./E8/hechizo-puerta-magica');

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

//EJERCICIOS


// E1
app.get('/E1', async (req, res) => {
  const response = await e1();
  res.json('Lito');
});

// E2
app.get('/E2', async (req, res) => {
  const response = await e2();
  res.json('Lito');
});

// E3
app.get('/E3', async (req, res) => {
  const response = await e3();
  res.json(response);
  return response;
});

// E4
app.get('/E4', async (req, res) => {
  const response = await e4();
  res.json(response);
  return response;
});

// E5
app.get('/E5', async (req, res) => {
  const response = await e5();
  res.json(response);

});

app.get('/e5start', async (req, res) => {
  const headers = {
    'Content-Type': 'application/json',
    'API-KEY': '895aabdb40874bf6becc33284972ba71'
} 
  const response = await axios.post(`${process.env.URL_BASE}/v1/s1/e5/actions/start`,{}, { headers: headers }).then(response => {
    res.json(response.data);
  }).catch(error => {
    res.status(error.response?.status || 500).json({
      error: 'Error en el registro',
      message: error.message
    });
  });
});


app.get('/e5radar', async (req, res) => {
  const headers = {
    'Content-Type': 'application/json',
    'API-KEY': '895aabdb40874bf6becc33284972ba71'
  }
  const body = {
    "action": 'radar',
    "attack_position": null
  }
  const response = await axios.post(`${process.env.URL_BASE}/v1/s1/e5/actions/perform-turn`, body, { headers: headers }).then(response => {
    res.json(response.data);
  }).catch(error => {
    res.status(error.response?.status || 500).json({
      error: 'Error al obtener radar',
      message: error.message
    });
  });
  

}); 


app.get('/e5attack', async (req, res) => {
  const headers = {
    'Content-Type': 'application/json',
    'API-KEY': '895aabdb40874bf6becc33284972ba71'
  }
  const body = {
    "action": 'attack',
    "attack_position": {
      "x": 'a',
      "y": 7
    }
  }
  const response = await axios.post(`${process.env.URL_BASE}/v1/s1/e5/actions/perform-turn`, body, { headers: headers }).then(response => {
    res.json(response.data);
  }).catch(error => {
    res.status(error.response?.status || 500).json({
      error: 'Error al obtener radar',
      message: error.message
    });
  });

});




// E6
app.get('/E6', async (req, res) => {
  const response = await e6();
  res.json(response.data);
  
});


//e8
app.get('/E8', async (req, res) => {
  const response = await e8();
  res.json(response);
});


// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
  console.log(`URL_BASE: ${process.env.URL_BASE}`);
});