# 1. Especificar la imagen base
FROM node:18-alpine

# 2. Crear carpeta dentro del contenedor
WORKDIR /app

# 3. Copiar package.json y package-lock first (mejor para cache)
COPY package*.json ./

# 4. Instalar dependencias
RUN npm install

# 5. Copiar todo el proyecto a /app
COPY . .

# 6. Construir TypeScript (genera /dist)
RUN npm run build

# 7. Exponer puerto del backend
EXPOSE 3000

# 8. Comando para ejecutar la app
CMD ["npm", "run", "start:prod"]
