/*

Año Galáctico 34 DBY

La Resistencia ha interceptado un fragmento de un antiguo holocrón Sith que contiene la clave para localizar un templo Sith perdido, el cual se rumorea que guarda secretos poderosos.

Sin embargo, el fragmento está codificado con un complejo acertijo que solo un verdadero maestro de la Fuerza y los datos puede descifrar.

El futuro de la galaxia depende de tu habilidad para descifrar el mensaje y encontrar el templo antes que la Primera Orden.

El Desafío
El fragmento del holocrón, el cual se encuentra fuera de nuestra galaxia, contiene datos sobre varios lugares y personajes clave. Tu misión es analizar la forma de realizar la conexión con el holocrón y encontrar el único planeta con equilibrio en la Fuerza.

Investigando la librería del templo Jedi en Coruscant, un antiguo pasaje menciona:

...el "Índice de Balance de la Fuerza" (IBF) para un planeta específico, es una medida de la
influencia del Lado Luminoso y del Lado Oscuro de la Fuerza en ese planeta se calcula como:

IBF = ((Número de Personajes del Lado Luminoso) - (Número de Personajes del Lado Oscuro)) /
       (Total de Personajes en el Planeta)

El IBF te dará un valor entre -1 y 1, donde -1 significa dominio total del Lado Oscuro, 0 significa equilibrio, y
1 significa dominio total del Lado Luminoso.
*/

const axios = require('axios');

const https = require('https');

const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false // <--- ignora certificados inválidos
  })
});


function decodificarBase64(base64Str) {
    try {
      // Decodifica y devuelve el texto
      const decoded = atob(base64Str);
      return decodeURIComponent(escape(decoded)); // para manejar caracteres UTF-8
    } catch (e) {
      console.error('No se pudo decodificar. ¿Es una cadena válida Base64?');
      return null;
    }
  }
  

const getPlanets = async () => {
    let allPlanets = [];
    let nextPage = 'https://swapi.dev/api/planets';
    
    while (nextPage) {
        const response = await instance.get(nextPage);
        const data = response.data;
        
        const mappedPlanets = data.results.map(planet => ({
            nombre: planet.name,
            poblacion: planet.population,
            residentes: planet.residents
        }));
        
        allPlanets = [...allPlanets, ...mappedPlanets];
        nextPage = data.next;
    }

    return allPlanets;
}


const getResidentes = async (planets) => {
    const residentes = [];
    
    for (const planet of planets) {
        const promesasResidentes = planet.residentes.map(async (url) => {
            const resi = await instance.get(url);
            return {
                nombre: resi.data.name,
                planeta: planet.nombre
            };
        });
        
        const residentesPlaneta = await Promise.all(promesasResidentes);
        residentes.push(...residentesPlaneta);
    }
    
    return residentes;
}


const send_solution = async (planeta) => {
    const headers = {
        'Content-Type': 'application/json',
        'API-KEY': '895aabdb40874bf6becc33284972ba71'
    }
    const response = await instance.post(`${process.env.URL_BASE}/v1/s1/e3/solution`, {
        planet: planeta
    }, {headers: headers});
    return response.data;
}


const e3 = async () => {
    const headers = {
        'Content-Type': 'application/json',
        'API-KEY': '895aabdb40874bf6becc33284972ba71'
    }


    const planets = await getPlanets();
    
    const residentes = await getResidentes(planets);
    let planetas_balance = {};

    const planeta_equilibrio = residentes.map(async(residente) => {
        const planeta_residente = await instance.get(`${process.env.URL_BASE}/v1/s1/e3/resources/oracle-rolodex?name=${residente.nombre}`, {headers: headers});
        const planeta_residente_decodificado = decodificarBase64(planeta_residente.data.oracle_notes);
        const planeta = residente.planeta;

        if (!planetas_balance[planeta]) {
            planetas_balance[planeta] = {
                light_side: 0,
                dark_side: 0,
                total_residentes: 0
            };
        }

        planetas_balance[planeta].total_residentes++;

        if(planeta_residente_decodificado.includes('belongs to the Light Side of the Force')){
            planetas_balance[planeta].light_side++;
        }
        if(planeta_residente_decodificado.includes('belongs to the Dark Side of the Force')){
            planetas_balance[planeta].dark_side++;
        }
    });

    await Promise.all(planeta_equilibrio);

    // Calcular el IBF (Índice de Balance de la Fuerza) para cada planeta
    const planetas_IBF = Object.entries(planetas_balance).map(([planeta, datos]) => {
        const IBF = (datos.light_side - datos.dark_side) / datos.total_residentes;
        return {
            planeta,
            IBF,
            light_side: datos.light_side,
            dark_side: datos.dark_side,
            total_residentes: datos.total_residentes
        };
    });

    // Encontrar el planeta con IBF más cercano a 0 (equilibrio)
    const planeta_equilibrio_final = planetas_IBF.reduce((closest, current) => {
        return Math.abs(current.IBF) < Math.abs(closest.IBF) ? current : closest;
    });

    console.log('Planeta en equilibrio:', planeta_equilibrio_final);
    
    const response = await send_solution(planeta_equilibrio_final.planeta);
    return response;
};

module.exports = { e3 };
