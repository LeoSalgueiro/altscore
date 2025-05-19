/*

Año 3018 de la Tercera Edad

La Tierra Media está al borde de la guerra. Las fuerzas de Sauron reúnen fuerza, y el Anillo Único ha sido encontrado. Sin embargo, en lo más profundo de las historias olvidadas de los Elfos, hay un secreto que podría inclinar la balanza del poder: una forja oculta, utilizada una vez para fabricar armas capaces de resistir el poder del Señor Oscuro.

Los antiguos escritos hablan de un acertijo, uno que solo un verdadero maestro de las letras puede resolver, revelando la entrada a la forja. Tu misión es descifrar las pistas y descubrir las credenciales ocultas que te permitirán pasar por la puerta élfica y entrar en la forja.

Al llegar a la entrada del templo, encuentras una puerta de piedra tallada con runas élficas. En el centro de la puerta, un poema está grabado en una lengua antigua, y debajo de él, un campo en el que puedes ingresar un usuario y una contraseña.

El poema, escrito en un idioma perdido, reza así:

The Keeper of Secrets, Elven Lore,
Guards the door to ancient war.
A name in whispers, subtly veiled,
The key to forge the fading light.

A password cloaked in shadows deep,
Where truth and trust in darkness sleep.
Reveal the word, but tread with care,
For only those who dare to stare.

Through webs of spells and runes that guard,
The path to wisdom, worn and hard.
The quest is yours, the way is paved,
By username in light engraved.

Password bound by hidden might,
Shift the veil, and find the light.



*/

const axios = require('axios');




const e4 = async () => {
    const headers = {
        'Content-Type': 'application/json',
        'API-KEY': '895aabdb40874bf6becc33284972ba71'
    }
    //El username y la pass estaban escondidas en las herramientas de desarrollo del navegador
    const body = {
        username: 'Not all those who wander',
        password: 'are lost'
    }
    const response = await axios.post(`${process.env.URL_BASE}/v1/s1/e4/solution`, body, {headers: headers});
    return response.data;
}

module.exports = { e4 };
