/*

La Infiltración en Ciudad Prisma: Un Desafío para los Maestros de Datos
Año 3036

En un rincón remoto del mundo Pokémon, Ciudad Prisma ha permanecido cerrada al acceso de entrenadores y Pokémon durante décadas.
 Se rumorea que en su interior se ocultan secretos ancestrales y un artefacto legendario que podría cambiar el destino de todas las regiones.

Sin embargo, la entrada a la ciudad está protegida por un complejo sistema de seguridad diseñado por 
los guardianes de Prisma, seres de inteligencia superior y maestros en el manejo de datos.
 Para demostrar que posees las habilidades necesarias para adentrarte en la ciudad, deberás superar su desafío definitivo.

El Desafío de los Guardianes
Los guardianes de Ciudad Prisma han recopilado una vasta cantidad de datos sobre todos los Pokémon existentes. 
Para desbloquear el acceso, deberás demostrar tu dominio en la manipulación de datos y tu conocimiento profundo del mundo Pokémon.

Tu Misión:

Calcular la altura promedio de todos los tipos de Pokémon, siguiendo el orden alfabético, y enviar el valor con una precisión de 3 decimales.

Pistas:

Utiliza la PokéAPI para recopilar los datos necesarios.
Demuestra tu habilidad para extraer, transformar y analizar grandes volúmenes de información.
La precisión es crucial: envía tu respuesta en el formato exacto requerido.

*/

const axios = require('axios');



const sendSolution = async (solution) => {
    const headers = {
        'Content-Type': 'application/json',
        'API-KEY': '895aabdb40874bf6becc33284972ba71'
    }
    const response = await axios.post(`${process.env.URL_BASE}/v1/s1/e6/solution`, { solution }, { headers: headers });
    return response.data;
}


const getTypes = async () => {
    const response = await axios.get('https://pokeapi.co/api/v2/type/');


    const types = response.data.results.map(type => {
        return {
            name: type.name,
            url: type.url
        }
    }).sort((a, b) => a.name.localeCompare(b.name));
    return types;
}


const getPokemons = async (url) => {
    const response = await axios.get(url);
    return response.data;
}





const e6 = async () => {
    //const response = await sendSolution('123');
    //return response;
    const types = await getTypes();
    const pokemoneishons = [];
    for (const type of types) {
        console.log('--------------------------------');
        //console.log('El tipo es: ' + type.name);
        let url = type.url;
        if (typeof (url) !== 'undefined') {
            console.log('Obteniendo el tipo: ' + type.name);
            const response = await axios.get(type.url)


            const pokemons = response.data.pokemon

            //console.log(pokemons);
            for (const pokemon of pokemons) {
                if (typeof (pokemon.pokemon.url) !== 'undefined') {

                    const pokemonResponse = await getPokemons(pokemon.pokemon.url).then(response => {

                        pokemoneishons.push({ type: type.name, height: response.height });
                    }).catch(error => {
                        console.log('Error al obtener el pokemon: ' + pokemon.pokemon.name);
                        console.log(error);
                    });
                } else {
                    console.log('No hay pokemon para el tipo: ' + type.name);
                }


            }
        }


        console.log('--------------------------------');
    }
   
    
    // Agrupar por tipo y calcular promedios
    const typeAverages = pokemoneishons.reduce((acc, pokemon) => {
        if (!acc[pokemon.type]) {
            acc[pokemon.type] = {
                sum: 0,
                count: 0
            };
        }
        acc[pokemon.type].sum += pokemon.height;
        acc[pokemon.type].count += 1;
        return acc;
    }, {});

    // Crear el objeto con la estructura requerida
    const result = {
        heights: {
            bug: 0,
            dark: 0,
            dragon: 0,
            electric: 0,
            fairy: 0,
            fighting: 0,
            fire: 0,
            flying: 0,
            ghost: 0,
            grass: 0,
            ground: 0,
            ice: 0,
            normal: 0,
            poison: 0,
            psychic: 0,
            rock: 0,
            steel: 0,
            water: 0
        }
    };

    // Llenar los valores con los promedios calculados
    Object.entries(typeAverages).forEach(([type, data]) => {
        result.heights[type] = Number((data.sum / data.count)).toFixed(3);
    });

    console.log(result);
    return result;
}

module.exports = { e6 };

