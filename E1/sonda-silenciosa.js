/*

Mision:
    Eres un intrepido explorador estelar en una mision crucial para mapear un sistema solar recien descubierto.
    Tu objetivo es determinar la velocidad orbital instantanea de un planeta potencialmente habitable para evaluar su idoneidad para la vida.

Desafio: La xtraña interferencia cosmica en esta region del espacio dificultas la obtencion de lecturas existosas de tu escaner de largo alcance.

Datos Clave: Cuando el escaner funciona, te proporciona:
*Distance: La distancia recorrida por el planeta en su orbita durante el periodo de observacion (En unidades astronomicas)
*time: El tiempo transcurrido durante la observacion (En horas terrestres)

Objetivo: Calcular la velocidad instantanea del planeta hasta el numero entero mas cercano.

Recursos:
*Api para obtener una lectura del escaner: [GET] /v1/s1/e1/resources/measurement  
(Siempre recibiras un codigo de estado HTTP 200, incluso si el escaneo no es exitoso).
*Envia tu respuesta aquí: [POST] /v1/s1/e1/solution


*/    
require('dotenv').config();

const axios = require('axios');


const getMeasurement = async () => {
    const headers = {
        'Content-Type': 'application/json',
        'API-KEY': '895aabdb40874bf6becc33284972ba71'
    }
    const response = await axios.get(`${process.env.URL_BASE}/v1/s1/e1/resources/measurement`, {headers: headers});
    return response.data;
};

const calculateVelocity = (distance, time) => {
    if(distance !== 'failed to measure, try again') {
        let distanceFormatted = distance.replace('AU', '');
        let timeFormatted = time.replace('hours', '');
        const velocity = distanceFormatted / timeFormatted;
        return Math.round(velocity);
    } else {
        return 0;
    }
};

const sendSolution = async (velocity) => {
    const headers = {
        'Content-Type': 'application/json',
        'API-KEY': '895aabdb40874bf6becc33284972ba71'
    }
    const response = await axios.post(`${process.env.URL_BASE}/v1/s1/e1/solution`, { speed: velocity }, {headers: headers});
    return response.data;
};

const e1 = async () => {
    let measurement = await getMeasurement();
    
    while(measurement.distance === 'failed to measure, try again') {
        measurement = await getMeasurement();
    }

    const velocity = calculateVelocity(measurement.distance, measurement.time);
    const result = await sendSolution(velocity);
    return result;
};

module.exports = { e1 };





