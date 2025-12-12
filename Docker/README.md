# 🐳 Docker Deployment Guide — Valion Backend API

This document explains how to run the **NestJS backend** using Docker.  
Includes backend container setup, PostgreSQL configuration, and local execution via Docker Compose.

---

## 📦 Docker Files Included

The repository contains all necessary Docker files:

```
/docker
   ├── Dockerfile
   └── docker-compose.yml
.dockerignore
.env.example
```

- **Dockerfile** → Builds the backend image (Node.js 22)
- **docker-compose.yml** → Orchestrates Backend + PostgreSQL + pgAdmin
- **.dockerignore** → Prevents unnecessary files from being copied into the container
- **.env.example** → Template for environment variables

---

## 🚀 Quick Start

### 1. Set Up Environment Variables

Copy the example file and configure your environment:

```bash
cp .env.example .env
```

Then edit `.env` with your actual values. **Important settings for Docker:**

```env
NODE_ENV=production
PORT=3000

# Database host MUST be 'postgres' (the container name)
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_secure_password
DB_NAME=valion
DB_SSL=false

# Generate a secure JWT secret (min 32 characters)
JWT_SECRET=your_jwt_secret_min_32_chars

# Set your production domain
CORS_ORIGINS_PRODUCTION=https://yourdomain.com

# Timezone configuration
TZ=America/Bogota
```

### 2. Build and Start All Services

From the **project root**, run:

```bash
docker compose -f docker/docker-compose.yml up -d
```

This will start:
- ✅ Backend API (NestJS)
- ✅ PostgreSQL database
- ✅ pgAdmin (database management UI)

### 3. Stop All Services

```bash
docker compose -f docker/docker-compose.yml down
```

To remove volumes (deletes database data):

```bash
docker compose -f docker/docker-compose.yml down -v
```

---

## 🌐 Services and Endpoints

### **Backend API (NestJS)**
- **URL:** `http://localhost:3000`
- **Health check:** `http://localhost:3000/health`
- **Port:** Configurable via `PORT` in `.env` (default: 3000)

### **PostgreSQL Database**
- **Container name:** `valion-postgres`
- **Host (inside Docker):** `postgres`
- **Port:** `5432` (configurable via `DB_PORT`)
- **Credentials:** Set in `.env`

### **pgAdmin (Database UI)**
- **URL:** `http://localhost:5050`
- **Default credentials:**
  - Email: `admin@admin.com`
  - Password: `admin123`
- **Port:** Configurable via `PGADMIN_PORT` in `.env`

---

## ⚙️ Key Features Implemented

### ✅ Node.js 22
Updated from Node 18 to Node 22 for better performance and latest features.

### ✅ Health Checks
Both backend and PostgreSQL have health checks configured:
- Backend checks every 30 seconds
- PostgreSQL checks every 10 seconds
- Services wait for dependencies to be healthy before starting

### ✅ Timezone Configuration
Server timezone is configurable via `TZ` environment variable (default: `America/Bogota`).

### ✅ Dynamic Port Configuration
All ports are configurable through environment variables:
- `PORT` - Backend API port
- `DB_PORT` - PostgreSQL port
- `PGADMIN_PORT` - pgAdmin port

### ✅ Production-Ready Setup
- Uses `npm ci` for faster, more reliable installs
- Implements proper dependency management
- Includes restart policies
- Network isolation with custom bridge network

---

## 🔧 Useful Commands

### View Logs

```bash
# All services
docker compose -f docker/docker-compose.yml logs -f

# Specific service
docker logs -f valion-backend
docker logs -f valion-postgres
```

### Access Container Shell

```bash
# Backend container
docker exec -it valion-backend sh

# PostgreSQL container
docker exec -it valion-postgres psql -U postgres -d valion
```

### Rebuild Without Cache

```bash
docker compose -f docker/docker-compose.yml build --no-cache
docker compose -f docker/docker-compose.yml up -d
```

### Check Service Health

```bash
docker compose -f docker/docker-compose.yml ps
```

---

## 🏗️ Building for Production

### Build Backend Image

```bash
docker build -t valion-backend:latest -f docker/Dockerfile .
```

### Tag and Push to Registry

```bash
# Tag the image
docker tag valion-backend:latest your-registry/valion-backend:latest

# Push to Docker Hub
docker push your-registry/valion-backend:latest

# Or push to private registry
docker tag valion-backend:latest registry.yourcompany.com/valion-backend:latest
docker push registry.yourcompany.com/valion-backend:latest
```

---

## 🚀 Deployment to Hostinger (or other providers)

### Pre-deployment Checklist

- [ ] Update `.env` with production values
- [ ] Set `NODE_ENV=production`
- [ ] Change `DB_HOST` to actual database host (if using external DB)
- [ ] Update `CORS_ORIGINS_PRODUCTION` with your domain
- [ ] Generate secure `JWT_SECRET` (use: `openssl rand -base64 32`)
- [ ] Use strong passwords for `DB_PASS` and `PGADMIN_PASSWORD`
- [ ] Consider enabling `DB_SSL=true` for production databases
- [ ] Update timezone if needed

### Deployment Options

#### Option 1: Docker Compose (Simple)
Upload your code and `.env` file, then run:
```bash
docker compose -f docker/docker-compose.yml up -d
```

#### Option 2: Pre-built Image (Recommended for production)
```bash
# Pull from registry
docker pull your-registry/valion-backend:latest

# Run with production .env
docker run -d \
  --name valion-backend \
  --env-file .env \
  -p 3000:3000 \
  your-registry/valion-backend:latest
```

#### Option 3: Kubernetes/Docker Swarm
Use the provided Dockerfile as a base for orchestration manifests.

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** - Use `.env.example` as template
2. **Use strong passwords** - Especially for production databases
3. **Rotate JWT secrets** - Generate new secrets periodically
4. **Enable SSL for databases** - Set `DB_SSL=true` in production
5. **Restrict CORS origins** - Only allow trusted domains
6. **Keep images updated** - Regularly update base images and dependencies
7. **Use secrets management** - Consider Docker secrets or cloud provider solutions for production

---

## 📊 Monitoring and Logs

### View Application Logs
```bash
docker logs -f valion-backend
```

### View Database Logs
```bash
docker logs -f valion-postgres
```

### Monitor Resource Usage
```bash
docker stats valion-backend valion-postgres
```

---

## 🐛 Troubleshooting

### Backend can't connect to database
- Ensure `DB_HOST=postgres` in your `.env` (not `localhost`)
- Check if PostgreSQL container is healthy: `docker compose ps`
- View PostgreSQL logs: `docker logs valion-postgres`

### Port already in use
- Change the port in `.env` (e.g., `PORT=3001`)
- Make sure no other service is using the port
- Check with: `lsof -i :3000` (macOS/Linux) or `netstat -ano | findstr :3000` (Windows)

### Health check failing
- Ensure your NestJS app has a `/health` endpoint
- Check backend logs: `docker logs valion-backend`
- Temporarily disable health check to debug

### Permission issues with volumes
```bash
docker compose -f docker/docker-compose.yml down -v
docker volume prune
docker compose -f docker/docker-compose.yml up -d
```

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [NestJS Docker Documentation](https://docs.nestjs.com/recipes/docker)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)

---

## 🏁 Summary

This Docker setup provides:
- ✅ Production-ready backend container (Node.js 22)
- ✅ Fully configured PostgreSQL database
- ✅ Health checks for all services
- ✅ Timezone configuration
- ✅ Dynamic port management
- ✅ Easy deployment workflow
- ✅ Comprehensive documentation

The environment is ready for both development and production deployment.