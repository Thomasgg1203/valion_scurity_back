# 🐳 Guía de Docker — Backend API de Seguros

Este documento explica cómo ejecutar el **backend de NestJS** usando Docker.  
Incluye la creación del contenedor del backend, configuración de PostgreSQL y ejecución local mediante Docker Compose.

---

## 📦 Archivos Docker incluidos

El repositorio ya contiene todos los archivos necesarios:

```
/docker
   ├── Dockerfile
   └── docker-compose.yml
.dockerignore
```

- **Dockerfile** → Construye la imagen del backend  
- **docker-compose.yml** → Ejecuta Backend + PostgreSQL + pgAdmin  
- **.dockerignore** → Evita copiar archivos innecesarios dentro del contenedor  

El entorno está listo para que el ingeniero DevOps trabaje.

---

# 🚀 1. Construir la imagen del backend

Ejecutar desde la **raíz del proyecto**:

```bash
docker build -t valion-backend -f docker/Dockerfile .
```

Esto genera una imagen lista para producción.

---

# ▶️ 2. Levantar todo el stack (Backend + DB + pgAdmin)

Usar Docker Compose:

```bash
docker compose -f docker/docker-compose.yml up -d
```

Para detener los servicios:

```bash
docker compose -f docker/docker-compose.yml down
```

---

# 🗄️ 3. Servicios incluidos

### **API (NestJS)**
- URL: `http://localhost:3000`

### **PostgreSQL**
- Nombre del host dentro de Docker: `db`
- Puerto local: `5432`

### **pgAdmin**
- URL: `http://localhost:5050`
- Credenciales:
  - **Email:** admin@admin.com  
  - **Contraseña:** admin

---

# ⚙️ 4. Variables de entorno requeridas

Crear un archivo `.env` (Docker no lo incluye):

```
NODE_ENV=production
PORT=3000

DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASS=admin
DB_NAME=valion
DB_SSL=false

JWT_SECRET=admin123
```

> **Importante:** Dentro de Docker, el host de la base de datos debe ser **db**, que coincide con el nombre del servicio en docker-compose.

---

# 📁 5. Resumen del Dockerfile

Ubicado en `/docker/Dockerfile`:

```Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

---

# 🧹 6. Archivo .dockerignore

Evita copiar archivos que no deben ir dentro del contenedor:

```
node_modules
dist
.env
.git
.gitignore
logs
npm-debug.log
Dockerfile
docker-compose.yml
```

---

# 🔧 7. Comandos útiles

### Ver logs del contenedor
```bash
docker logs -f valion-backend
```

### Entrar a la terminal del contenedor
```bash
docker exec -it valion-backend sh
```

### Reconstruir imagen sin caché
```bash
docker build --no-cache -t valion-backend -f docker/Dockerfile .
```

---

# 📤 8. Subir la imagen a Docker Hub (para despliegue)

```bash
docker tag valion-backend USERNAME/valion-backend:latest
docker push USERNAME/valion-backend:latest
```

Luego puede ser desplegada en Hostinger, AWS, Azure, Render, etc.

---

# 🏁 9. Notas finales

- El proyecto ya está completamente preparado para Docker.
- El ingeniero DevOps puede construir, ejecutar y desplegar sin modificar el código.
- Para despliegue solo se necesitan las variables de entorno y la imagen.

---

