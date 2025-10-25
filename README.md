# 🏗️ Insurance API Project

Backend API developed in **NestJS**, following **clean architecture**, principles, designed to **scale** easily and run on a traditional server.

---

## 🚀 Main Technologies

| Component         | Technology | Version / Details |
| ----------------- | ---------- | ----------------- |
| Lenguaje          | Node.js    | >= 20.x           |
| Framework backend | NestJS     | ^10.x             |

---

## 🧩 Estructura del proyecto

```
valion_security_back/
├── src/
│ ├── core/ # Pure business logic
│ │ ├── domain/ # Domain entities and models
│ │ │ ├── filters/
│ │ │ ├── interceptors/
│ │ │ ├── dto/
│ │ │ ├── helpers/
│ │ │ └── utils/
│ │ ├── use-cases/ # Use cases (apply business rules)
│ │ └── factories/ # Entity or strategy creators
│ │
│ ├── infrastructure/ # Data layer and external adapters
│ │ ├── database/ # DB connections
│ │ ├── repositories/ # Repositories implementing core interfaces
│ │ └── mappers/ # Conversion between entities and DTOs
│ │
│ ├── modules/ # NestJS modules (controllers, services)
│ │ ├── clients/
│ | │   ├── __tests__/
│ | │   │   ├── clients.controller.spec.ts
│ | │   │   └── clients.service.spec.ts
│ │ │ ├── clients.controller.ts
│ │ │ ├── clients.service.ts
│ │ │ └── clients.module.ts
│ │ ├── insurers/
│ │ ├── auth/
│ │ └── rules-engine/
│ │
│ ├── common/ # Filters, interceptors, DTOs, and helpers
│ ├── config/ # Environment variables, configuration
│ ├── app.module.ts
│ ├── main.ts # Local entry point
│
└── package.json
```

## ⚙️ Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Thomasgg1203/valion_scurity_back.git

cd valion_scurity_back
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Run in development mode

```bash
npm run start:dev
```

## 🧠 Clean Structure — Guide to Understand

| Layer              | Descripción                                                | Ejemplo                                             |
| ------------------ | ---------------------------------------------------------- | --------------------------------------------------- |
| **Core**           | Contains pure business logic (does not depend on NestJS).  | `core/use-cases/create-client.usecase.ts`           |
| **Infrastructure** | Implements technical details like repositories or mappers. | `infrastructure/repositories/clients.repository.ts` |
| **Modules**        | Connects previous layers with the NestJS framework.        | `modules/clients/clients.service.ts`                |
| **Common**         | Shared utilities, DTOs, and standard responses.            | `common/response-builder.ts`                        |

### 🧷Base de Scripts

```bash
{
  "name": "valion_scurity_back",         // Project name
  "version": "0.0.1",                    // Current version
  "private": true,                       // Prevents publishing to NPM
  "license": "UNLICENSED",               // Internal license

  "scripts": {                                   // ⚙️ Commands you can run with npm run ...
    "build": "nest build",                       // Compile the NestJS project (uses tsconfig.json)
    "start": "nest start",                       // Start NestJS server in normal mode
    "start:dev": "nest start --watch",           // Development mode with auto-reload
    "start:debug": "nest start --debug --watch", // Debug mode
    "start:prod": "node dist/main",              // Run compiled version (production)

    // 🧹 Quality and formatting
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",       // Check style errors
    "lint:fix": "eslint . --ext .ts --fix",                        // Auto-fix errors
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"", // Apply formatting with Prettier

    // 🧪 Unit tests
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
```
