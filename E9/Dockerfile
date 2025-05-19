# Usar Node.js como base
FROM node:18-slim

# Crear directorio de la aplicación
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Compilar TypeScript
RUN npm run build

# Exponer el puerto que Cloud Run espera
EXPOSE 8080

# Comando para ejecutar la aplicación
CMD ["node", "dist/nave-a-la-deriva-2.js"] 