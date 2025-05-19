FROM node:18-slim as builder

WORKDIR /app

# Instalar TypeScript globalmente
RUN npm install -g typescript

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig.json ./

# Instalar todas las dependencias (incluyendo devDependencies)
RUN npm install

# Copiar el código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM node:18-slim

WORKDIR /app

# Copiar solo los archivos necesarios desde la etapa de construcción
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Instalar solo las dependencias de producción
RUN npm install --only=production

# Exponer el puerto
EXPOSE 8080

# Comando para ejecutar la aplicación
CMD ["node", "dist/nave-a-la-deriva.js"] 