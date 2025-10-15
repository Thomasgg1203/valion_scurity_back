# 🏗️ Proyecto Aseguradora API

API backend desarrollada en **NestJS**, siguiendo principios de **arquitectura limpia**, pensada para **escalar** fácilmente y poder ejecutarse tanto en un servidor tradicional como en **AWS Lambda (serverless)**.

---

## 🚀 Tecnologías principales

| Componente | Tecnología | Versión / Detalle |
|-------------|-------------|-------------------|
| Lenguaje | Node.js | >= 20.x |
| Framework backend | NestJS | ^10.x |
| Infraestructura | AWS Lambda + API Gateway | Serverless Framework |
| Base de datos (temporal) | En memoria (mock) | Próximamente DynamoDB / Aurora |
| Estilos de arquitectura | Clean Architecture + Modular Design |
| Librerías clave | `@vendia/serverless-express`, `aws-lambda` |

---

## 🧩 Estructura del proyecto

```
valion_security_back/
├── src/
│ ├── core/ # Lógica de negocio (pura)
│ │ ├── domain/ # Entidades y modelos del dominio
│ │ ├── use-cases/ # Casos de uso (aplican reglas del negocio)
│ │ └── factories/ # Creadoras de entidades o estrategias
│ │
│ ├── infrastructure/ # Capa de datos y adaptadores externos
│ │ ├── database/ # Conexiones a BD (DynamoDB, Aurora, etc)
│ │ ├── repositories/ # Repositorios que implementan interfaces del core
│ │ └── mappers/ # Conversión entre entidades y DTOs
│ │
│ ├── modules/ # Módulos NestJS (controladores, servicios)
│ │ ├── clients/
│ | │   ├── __tests__/                 👈 carpeta exclusiva de tests
│ | │   │   ├── clients.controller.spec.ts
│ | │   │   └── clients.service.spec.ts
│ │ │ ├── clients.controller.ts
│ │ │ ├── clients.service.ts
│ │ │ └── clients.module.ts
│ │ ├── insurers/
│ │ ├── auth/
│ │ └── rules-engine/
│ │
│ ├── common/ # Filtros, interceptores, DTOs y helpers
│ ├── config/ # Variables de entorno, configuración
│ ├── app.module.ts
│ ├── main.ts # Entrypoint local
│ └── lambda.ts # Entrypoint serverless
│
├── serverless.yml # Configuración de despliegue AWS Lambda
└── package.json
```


## ⚙️ Instalación

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/Thomasgg1203/valion_scurity_back.git

cd valion_scurity_back
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Ejecutar en modo desarrollo
```bash
npm run start:dev
```

## ☁️ Despliegue en AWS Lambda

### 1️⃣ Instalar Serverless Framework
```bash
npm install -g serverless
```
### 2️⃣ Desplegar
```bash
serverless deploy
```
Esto creará una función Lambda con tu API NestJS completa, accesible desde un endpoint HTTPS público generado por API Gateway.

## 🧠 Estructura limpia — Guía para entender
| Capa               | Descripción                                                | Ejemplo                                             |
| ------------------ | ---------------------------------------------------------- | --------------------------------------------------- |
| **Core**           | Contiene la lógica de negocio pura (no depende de NestJS). | `core/use-cases/create-client.usecase.ts`           |
| **Infrastructure** | Implementa detalles técnicos como repositorios o mappers.  | `infrastructure/repositories/clients.repository.ts` |
| **Modules**        | Conecta las capas anteriores con el framework NestJS.      | `modules/clients/clients.service.ts`                |
| **Common**         | Utilidades compartidas, DTOs y respuestas estándar.        | `common/response-builder.ts`                        |


### 🧷Base de Scripts
``` bash
{
  "name": "valion_scurity_back",         // Nombre del proyecto
  "version": "0.0.1",                    // Versión actual
  "private": true,                       // Evita publicar el paquete en NPM
  "license": "UNLICENSED",               // Licencia interna

  "scripts": {                                   // ⚙️ Comandos que puedes ejecutar con npm run ...
    "build": "nest build",                       // Compila el proyecto NestJS (usa tsconfig.json)
    "start": "nest start",                       // Inicia el servidor NestJS en modo normal
    "start:dev": "nest start --watch",           // Modo desarrollo con recarga automática
    "start:debug": "nest start --debug --watch", // Modo depuración
    "start:prod": "node dist/main",              // Inicia la versión compilada (producción)

    // 🧹 Calidad y formato
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",       // Revisa errores de estilo
    "lint:fix": "eslint . --ext .ts --fix",                        // Corrige automáticamente errores
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"", // Aplica formato con Prettier

    // 🧪 Pruebas unitarias
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },

```