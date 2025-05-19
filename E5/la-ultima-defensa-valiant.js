/*

La Última Defensa de la "Valiant" - ¡Cuenta Regresiva!
Situación:

La nave insignia "Valiant", orgullo de la flota estelar, está bajo asedio. Una nave enemiga, veloz y letal, se aproxima con una intención clara: interceptar y destruir a la nave de suministros "Hope",
 que se encuentra en una posición vulnerable. El puesto de defensa de la "Valiant", crucial para repeler la amenaza,
  ha sufrido daños críticos en el ataque. La pantalla del radar, que normalmente mostraría la posición de la nave enemiga, es una maraña de estática y distorsiones. 
  Sin embargo, el puerto de comunicaciones de la consola aún funciona, transmitiendo datos en texto sin formato. 
  Afortunadamente, se ha encontrado un manual de instrucciones parcialmente legible que describe el formato de estos datos. 
  Además, tienes acceso a la bitácora del operador anterior, donde encuentras la última lectura de la batalla anterior junto a una captura de pantalla del radar,
   proporcionando información valiosa sobre la situación inicial.

Misión:

Tu misión es crucial: detener a la nave enemiga antes de que alcance su objetivo. 
Dispones de un solo disparo, una descarga de energía concentrada capaz de aniquilar cualquier nave en un instante.
 El disparo debe ser preciso, dirigido a las coordenadas exactas (x, y) donde se encontrará la nave enemiga en el momento del impacto.

El Desafío:

La nave enemiga se mueve con una agilidad sorprendente, cambiando de dirección y velocidad de forma inesperada. Su objetivo es interceptar a la "Hope" 
lo antes posible, por lo que elegirá la ruta más directa y eficiente, evitando los obstáculos que se encuentran en el espacio de batalla.
 El espacio de acción de la torre de defensa es limitado y plagado de estos obstáculos. Tienes un total de 4 turnos para completar tu misión. En cada turno, puedes elegir entre dos acciones:

Leer el radar: Acceder al puerto de comunicaciones y obtener una lectura textual de la posición actual de la nave enemiga, en el formato descrito en el manual.
Atacar: Disparar tu arma a las coordenadas especificadas (x, y), teniendo en cuenta que la nave enemiga se habrá movido desde la última lectura del radar. Recuerda que solo tienes un disparo.
Cuenta Regresiva:

¡El tiempo es esencial! Desde el momento en que inicies la batalla llamando a la API de "start", tendrás solo 10 minutos para analizar los datos, predecir el movimiento de la nave enemiga considerando 
los obstáculos, y ejecutar el ataque.

Objetivo:

Escribe un programa que, bajo la presión del tiempo, analice los datos del puerto de comunicaciones en el formato especificado,
 utilice la información de la bitácora para comprender
  la situación inicial, prediga el movimiento de la nave enemiga considerando los obstáculos, y determine el momento y 
  las coordenadas precisas para lanzar el ataque. ¡El destino de la "Hope" y de la "Valiant" está en tus manos!

Pistas:

El espacio de acción es una cuadrícula de 8x8, identificada desde "a1" hasta "h8".
La nave enemiga se representa con el carácter "^".
La nave amiga "Hope" se representa con el carácter "#".
Los obstáculos se representan con el carácter "$".
El espacio no ocupado se representa con el carácter "0".
Un salto de línea en los datos del radar se indica con el carácter "|".
La nave enemiga se mueve con un patrón peculiar, pero predecible si lo observas con atención.
Tienes 4 turnos.
Puedes "leer" o "atacar" en cada turno.
Solo tienes un disparo.
La nave enemiga busca la intercepción más rápida, evitando obstáculos.
Tienes 10 minutos para hacer tu disparo, luego de esto no podrás volver a intentar.
Tienes acceso a la última lectura del radar y una captura de pantalla de la batalla anterior en la bitácora.


¡Que la estrategia, la precisión y la velocidad guíen tu código, defensor de la "Valiant"! ¡El tiempo corre!
Bitacora
última lectura del radar:
a01b01c01d01e01f01g01h01|a02b02c02d02e$2f02g02h02|a03b03c03d03e03f03g03h$3|a04b04c04d04e04f04g04h04|a05b05c05d05e$5f05g^5h05|a06b06c06d06e$6f06g06h06|a07b07c07d07e07f07g07h07|a08b08c08d08e08f#8g08h08|

captura de pantalla del radar:

0 0 0 0 0 # 0 0
0 0 0 0 0 0 0 0
0 0 0 0 $ 0 0 0
0 0 0 0 $ 0 ^ 0
0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 $
0 0 0 0 $ 0 0 0
0 0 0 0 0 0 0 0




*/

const axios = require('axios');







// Función para convertir la lectura del radar en una matriz
const parseRadarReading = (radarString) => {
    const rows = radarString.split('|').filter(row => row.length > 0);
    const grid = [];

    for (let i = 0; i < 8; i++) {
        grid[i] = [];
        const row = rows[i];
        for (let j = 0; j < 8; j++) {
            const cellIndex = j * 3;

            const colLetter = row.charAt(cellIndex);       // Ej: 'f'
            const value = row.charAt(cellIndex + 1);       // Ej: '#'
            const rowNumber = row.charAt(cellIndex + 2);   // Ej: '8'

            const position = `${colLetter}${rowNumber}`;

            grid[i][j] = {
                value,     // carácter del medio
                position,  // coordenada tipo ajedrez
                x: j,      // índice de columna
                y: i       // índice de fila
            };
        }
    }

    return grid;
};



/**
 * Busca una celda dentro de la matriz 8x8 según criterios dados.
 * @param {Array} grid - Matriz de 8x8 con objetos { value, position, x, y }
 * @param {Object} criteria - Criterios de búsqueda: { value }, { position }, { x, y }, etc.
 * @returns {Object|null} - Celda encontrada o null si no se encuentra
 */
const findPositionInGrid = (grid, criteria) => {
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            const cell = grid[y][x];
            const matches = Object.entries(criteria).every(
                ([key, val]) => cell[key] === val
            );
            if (matches) {
                return cell;
            }
        }
    }
    return null;
};



/**
 * Encuentra todas las celdas en la matriz 8x8 que cumplan con los criterios.
 * @param {Array} grid - Matriz de 8x8 con objetos { value, position, x, y }
 * @param {Object} criteria - Criterios de búsqueda: { value }, { x }, etc.
 * @returns {Array} - Lista de celdas que coinciden
 */
const findObstaclesInGrid = (grid, criteria) => {
    const results = [];
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            const cell = grid[y][x];
            const matches = Object.entries(criteria).every(
                ([key, val]) => cell[key] === val
            );
            if (matches) {
                results.push(cell);
            }
        }
    }
    return results;
};



// Función para predecir el siguiente movimiento
const predictNextMove = (currentPos, targetPos, obstacles) => {
    if (!currentPos || !targetPos) {
        throw new Error('Posiciones inválidas para la predicción');
    }

    // Implementación simple: moverse hacia el objetivo evitando obstáculos
    const dx = targetPos.x - currentPos.x;
    const dy = targetPos.y - currentPos.y;

    let nextX = currentPos.x;
    let nextY = currentPos.y;

    if (Math.abs(dx) > Math.abs(dy)) {
        nextX += Math.sign(dx);
    } else {
        nextY += Math.sign(dy);
    }

    // Verificar si la nueva posición es un obstáculo
    if (obstacles.some(obs => obs.x === nextX && obs.y === nextY)) {
        // Si hay obstáculo, intentar moverse en la otra dirección
        if (Math.abs(dx) > Math.abs(dy)) {
            nextY += Math.sign(dy);
        } else {
            nextX += Math.sign(dx);
        }
    }

    return { x: nextX, y: nextY };
};

const convertToPosition = ({ x, y }) => {
    const letter = String.fromCharCode('A'.charCodeAt(0) + x); // 0 → 'A', 1 → 'B', ...
    const number = y + 1; // 0 → 1, 1 → 2, ...
    return { x: letter, y: number };
};

// 5. Imprimir solo objetos visibles
const printVisibleMatrix = (grid) => {
    const symbols = ['^', '#', '$', 'X'];
    for (let i = 7; i >= 0; i--) {
        const row = grid[i].map(cell => symbols.includes(cell.value) ? cell.value : '.').join(' ');
        console.log(row);
    }
    console.log('\n');
};

const simulateRadar = (grid) => {
    const enemy = findPositionInGrid(grid, { value: '^' });
    const hope = findPositionInGrid(grid, { value: '#' });
    const obstacles = findObstaclesInGrid(grid, { value: '$' }).map(cell => ({ x: cell.x, y: cell.y }));

    const radarReadings = [];
    let currentEnemyPos = { x: enemy.x, y: enemy.y };

    for (let turn = 1; turn <= 3; turn++) {
        const nextPos = predictNextMove(currentEnemyPos, hope, obstacles);
        updateGridEnemyPosition(grid, currentEnemyPos, nextPos, '^');
        currentEnemyPos = nextPos;
        radarReadings.push(generateRadarString(grid));
        console.log(`🔄 Radar turno ${turn}:`)
        printVisibleMatrix(grid);
    }

    // Turno final: ataque (marcar con 'X')
    
    const attackPos = predictNextMove(currentEnemyPos, hope, obstacles);
    updateGridEnemyPosition(grid, currentEnemyPos, attackPos, 'X');
    const finalRadar = generateRadarString(grid);
    console.log(`🔄 Radar final:`)
    printVisibleMatrix(grid);
    return {
        radarReadings,
        finalRadar,
        attack_position: attackPos
    };
};


const generateRadarString = (grid) => {
    let radarString = '';

    for (let i = grid.length - 1; i >= 0; i--) { // invertir para que fila 8 esté arriba
        let rowString = '';
        for (let j = 0; j < 8; j++) {
            const cell = grid[i][j];
            rowString += cell.position + cell.value;
        }
        radarString += rowString + '|';
    }

    return radarString;
};

const updateGridEnemyPosition = (grid, oldPos, newPos, symbol = '^') => {
    // Limpiar posición anterior
    grid[oldPos.y][oldPos.x].value = '.';

    // Poner símbolo en nueva posición
    grid[newPos.y][newPos.x].value = symbol;
};



const simulateGame = async () => {
    // Lectura inicial del radar
    const initialRadar = "a01b01c01d01e01f01g01h01|a02b02c02d02e$2f02g02h02|a03b03c03d03e03f03g03h$3|a04b04c04d04e04f04g04h04|a05b05c05d05e$5f05g^5h05|a06b06c06d06e$6f06g06h06|a07b07c07d07e07f07g07h07|a08b08c08d08e08f#8g08h08|";

    // Convertir la lectura inicial en una matriz
    const initialGrid = parseRadarReading(initialRadar);

    
   // console.log('Celdas con valor $:', allDollarCells);
/*

    initialGrid.forEach(row => {
        console.log(row.map(cell => `[${cell.position}:${cell.value} @${cell.x},${cell.y}]`).join(' '));
    });
*/
    console.log("--------------------------------");


      



    // Encontrar posiciones iniciales
    const enemyPos = findPositionInGrid(initialGrid, { value: '^' });
    const hopePos = findPositionInGrid(initialGrid, { value: '#' });
    const obstacles = findObstaclesInGrid(initialGrid, { value: '$' }).map(cell => ({ x: cell.x, y: cell.y }));

    console.log("--------------------------------");     
    
    console.log("Matriz del radar:");
        // Imprimir del revés: fila 8 arriba (y = 7 primero)
        initialGrid.slice().reverse().forEach(row => {
            console.log(row.map(cell => `[${cell.position}:${cell.value} @${cell.x},${cell.y}]`).join(' '));
        });
        console.log("--------------------------------");     
        console.log("--------------------------------");     

        console.log('Primera Lectura...')
let radar1 = 'a01b^1c01d01e01f01g01h01|a02b02c02d$2e02f02g02h02|a03b03c$3d03e03f03g03h03|a04b04c$4d04e04f04g04h04|a05b05c05d05e05f05g05h05|a06b06c06d$6e06f06g06h06|a07b07c07d07e07f07g07h07|a08b08c08d08e#8f08g08h08|'
        const firstGrid = parseRadarReading(radar1);
        printVisibleMatrix(firstGrid);
        let enemyPos1 = findPositionInGrid(firstGrid, { value: '^' });
        let hopePos1 = findPositionInGrid(firstGrid, { value: '#' });
        let obstacles1 = findObstaclesInGrid(firstGrid, { value: '$' }).map(cell => ({ x: cell.x, y: cell.y }));
        console.log('Posición del enemigo:', enemyPos1);
        console.log('Posición de la nave amiga:', hopePos1);
        console.log('Obstáculos:', obstacles1);



        console.log("--------------------------------");     
        console.log("--------------------------------");     

        console.log('Segunda Lectura...')
        let radar2 = 'a01b01c01d01e01f01g01h01|a02b02c02d$2e02f02g02h02|a^3b03c$3d03e03f03g03h03|a04b04c$4d04e04f04g04h04|a05b05c05d05e05f05g05h05|a06b06c06d$6e06f06g06h06|a07b07c07d07e07f07g07h07|a08b08c08d08e#8f08g08h08|'
        const secondGrid = parseRadarReading(radar2);
        printVisibleMatrix(secondGrid);
        let enemyPos2 = findPositionInGrid(secondGrid, { value: '^' }); 
        let hopePos2 = findPositionInGrid(secondGrid, { value: '#' });
        let obstacles2 = findObstaclesInGrid(secondGrid, { value: '$' }).map(cell => ({ x: cell.x, y: cell.y }));
        console.log('Posición del enemigo:', enemyPos2);
        console.log('Posición de la nave amiga:', hopePos2);
        console.log('Obstáculos:', obstacles2);

        console.log("--------------------------------");     
        console.log("--------------------------------");    

        console.log('Tercera Lectura...')
        let radar3 = 'a01b01c01d01e01f01g01h01|a02b02c02d$2e02f02g02h02|a03b03c$3d03e03f03g03h03|a04b04c$4d04e04f04g04h04|a05b^5c05d05e05f05g05h05|a06b06c06d$6e06f06g06h06|a07b07c07d07e07f07g07h07|a08b08c08d08e#8f08g08h08|'
        const thirdGrid = parseRadarReading(radar3);
        printVisibleMatrix(thirdGrid);
        let enemyPos3 = findPositionInGrid(thirdGrid, { value: '^' }); 
        let hopePos3 = findPositionInGrid(thirdGrid, { value: '#' });
        let obstacles3 = findObstaclesInGrid(thirdGrid, { value: '$' }).map(cell => ({ x: cell.x, y: cell.y }));
        console.log('Posición del enemigo:', enemyPos3);
        console.log('Posición de la nave amiga:', hopePos3);
        console.log('Obstáculos:', obstacles3);






       // const attackPos = convertToPosition(result.attack_position);
        
        //console.log("🎯 Radar final con ataque:\n", result.finalRadar);
        //console.log("📍 Posición de ataque:", attackPos);
};



const realGame = async () => {
    const empieza = await start();
    const radar = await readRadar();
    const { attack_position } = await turn("attack", { x: 0, y: 0 });
    return { game_id, radar, attack_position };
}

const e5 = async () => {
    //const { game_id } = await start();
    // const radar = await readRadar();
    // const { attack_position } = await turn("attack", { x: 0, y: 0 });
    //return { game_id, radar, attack_position };

    // Ejecutar la simulación
    simulateGame().then(result => {
        console.log("Resultado final del ataque:", result);
    });


}


module.exports = { e5 };


