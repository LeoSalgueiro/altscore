/*
Año 3042: Eres un intrépido navegante a bordo del CSS Hawking, embarcado en una misión de vital importancia: contactar al legendario Oráculo de Kepler-452b. 
Se rumorea que este ser enigmático posee el conocimiento para guiar a la humanidad hacia una era dorada. Pero el Oráculo no se revela a cualquiera;
 solo aquellos que demuestren su ingenio resolviendo un acertijo cósmico serán dignos de su sabiduría.

La Prueba: El Oráculo te presenta una interfaz holográfica que muestra una nebulosa estelar ondulante llamada " Lyra". 
La interfaz te permite acceder a los datos de las estrellas en la nebulosa. Para cada estrella, obtienes su " resonancia" y sus coordenadas. 
El Oráculo te desafía a calcular la "resonancia promedio" de las estrellas en la nebulosa.

Pistas:

La interfaz te permite navegar por la nebulosa en "saltos estelares", mostrando datos de 3 estrellas por salto.
Un mensaje críptico aparece en la pantalla: "El cosmos vibra en una sinfonía matemática. La resonancia de cada estrella se construye sobre 
la anterior, pero el Oráculo te presenta las estrellas en un orden cósmico propio.".
"Los secretos del cosmos no solo están en los datos visibles, sino también en los susurros ocultos en los encabezados de las respuestas."
"La paciencia es una virtud, pero la documentación es una herramienta. ¡Úsala sabiamente y el Oráculo te recompensará!"

*/
const axios = require('axios');
require('dotenv').config();

const getStars = async () => {
    const headers = {
        'Content-Type': 'application/json',
        'API-KEY': '895aabdb40874bf6becc33284972ba71'
    }
    console.log('Obteniendo estrellas...')
    const response = await axios.get(`${process.env.URL_BASE}/v1/s1/e2/resources/stars?page=1&sort-by=resonance&sort-direction=asc`, {headers: headers});
    return response.data;
};


const getPage1Stars = async () => {
    const headers = {
        'Content-Type': 'application/json',
        'API-KEY': '895aabdb40874bf6becc33284972ba71'
    }
    const stars = await axios.get(`${process.env.URL_BASE}/v1/s1/e2/resources/stars?page=1&sort-by=resonance&sort-direction=asc`, {headers: headers});
    const page1StarsResonance = stars.data[0].resonance
    console.log('la resonance de la primera estrella es: ')
    console.log(page1StarsResonance)
    return page1StarsResonance;
};

const getLastPageStars = async () => {
    const headers = {
        'Content-Type': 'application/json',
        'API-KEY': '895aabdb40874bf6becc33284972ba71'
    }
    const stars = await axios.get(`${process.env.URL_BASE}/v1/s1/e2/resources/stars?page=1&sort-by=resonance&sort-direction=desc`, {headers: headers});
    const lastPageStarsResonance = stars.data[0].resonance
    console.log('la resonance de la ultima estrella es: ')
    console.log(lastPageStarsResonance)
    return lastPageStarsResonance;
};






const sendSolution = async (resonance) => {
    const headers = {
        'Content-Type': 'application/json',
        'API-KEY': '895aabdb40874bf6becc33284972ba71'
    }
    const response = await axios.post(`${process.env.URL_BASE}/v1/s1/e2/solution`, {average_resonance: resonance}, {headers: headers})
    console.log(response.data)
     return response.data;
 
};

const e2 = async () => {
    const menorResonancia = await getPage1Stars();
    const mayorResonancia = await getLastPageStars();
    const promedio = (menorResonancia + mayorResonancia) / 2;
    console.log('el promedio de las resonancias es: ')
    console.log(promedio)
    const solution = await sendSolution(Math.floor(promedio));
    console.log(solution);
    return solution;
};

module.exports = { e2 };

