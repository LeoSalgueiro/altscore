/*

El Hechizo de la Puerta Mágica 🚪
Contexto:

En la vasta biblioteca de Altwarts, los antiguos fundadores escondieron un conocimiento arcano, protegido por un hechizo poderoso conocido como "El Encantamiento de la Puerta Mágica".
 Para desentrañar este conocimiento, debes resolver el acertijo que dejaron atrás.
  Cada pista te llevará más cerca de la solución final, pero ten cuidado, pues solo los magos más astutos serán capaces de encontrar el camino.

Primera pista: El Reloj de los Segundos

En la Torre del Reloj de Altwarts, el tiempo es tu mayor aliado y tu peor enemigo. Cada segundo marca el paso de una clave que abre una puerta.
 Elige el momento correcto, y la llave será tuya. Pero recuerda, solo en el primer segundo puedes encontrar la llave de la primera puerta.

Segunda pista: Acción y reacción, las puertas traen revelación

En el aula de Encantamientos, el profesor Flitwick guarda un pergamino antiguo que habla de palabras ocultas, no en los hechizos mismos, sino en las consecuencias de su lanzamiento.
 Cada acción mágica genera una reacción, y en esa reacción yacen los secretos que buscan los magos astutos. Solo aquellos que observan más allá de lo evidente, que desentrañan 
 los hilos invisibles que conectan causa y efecto, podrán descifrar el verdadero mensaje.

Tercera pista:

En el Gran Comedor, N puertas mágicas están alineadas, cada una desbloqueada solo por una palabra.
 Un hechizo pronunciado mal te perderá, pero el correcto te guiará. Solo avanzando en orden y en el momento adecuado, alcanzarás tu objetivo.

Cuarta pista:

Cada puerta te llevará a la siguiente, pero la respuesta no se encuentra al final, sino que el camino mismo es la clave. Recuerda usar el hechizo Revelio para ver lo que está oculto.

*/


const axios = require('axios');



const puertaMagica = async () => {
    const headers = {
        'Content-Type': 'application/json',
        'API-KEY': '895aabdb40874bf6becc33284972ba71'
    }   
    
    const puerta = await axios.post(`${process.env.URL_BASE}v1/s1/e8/actions/door`, 
        {"Hechizo": "Revelio"} 
    , {headers: headers}).then(response => {
        const now = new Date();
        const timestamp = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
        return {
            ...response.data,
            timestamp
        };
    }).catch(error => {
        return error;
    });
 

    return puerta;
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const e8 = async () => {
    const respuestas = [];
    const contador = 50;

    for (let i = 0; i < contador; i++) {
        console.log(`Consultando puerta mágica ${i + 1} de ${contador}`);
        const response = await puertaMagica();
        respuestas.push(response);
        await delay(1000); 
    }

    // Convertir el array de respuestas en un objeto
    const respuestasObjeto = respuestas.reduce((obj, respuesta, index) => {
        if(respuesta.status !== 403 ){
            obj[index] = respuesta;
        }
        return obj;
    }, {});

    return respuestasObjeto;
}

module.exports = { e8 };

