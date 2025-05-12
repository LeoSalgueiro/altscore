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

const axios = require('axios');

const getMeasurement = async () => {
    const response = await axios.get('ruta/v1/s1/e1/resources/measurement');
    return response.data;
};

const calculateVelocity = (distance, time) => {
    const velocity = distance / time;
    return Math.round(velocity);
};

const sendSolution = async (velocity) => {
    const response = await axios.post('ruta/v1/s1/e1/solution', { velocity });
    return response.data;
};

const main = async () => {
    const measurement = await getMeasurement();
    const velocity = calculateVelocity(measurement.distance, measurement.time);

    console.log(measurement);
    console.log(velocity);


    //const result = await sendSolution(velocity);
    console.log(result);
};

main();



