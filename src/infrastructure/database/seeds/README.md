# 🌱 Database Seeder — Valion Security Backend

This document explains how to run and understand the **initial database seeding** process for the Valion Security backend.

The seeder initializes the database with:
- All base **permissions** (CRUD actions per module)
- The **SuperAdmin** role
- Full permission assignments to SuperAdmin
- Default **system users** for testing

---

## ⚙️ Environment Configuration

Before running the seeder, make sure your `.env` file is properly configured:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=valion_security
DB_SSL=false
NODE_ENV=development
```

---

## 📁 Seeder Files Structure

```
src/infrastructure/database/seeds/
│
├── seed.initial.ts     # Main logic for inserting permissions, roles, and users
├── index.ts            # Entry point for running the seeder
└── README.md           # (this file)
```

---

## 🚀 What the Seeder Does

### 1️⃣ Insert Base Permissions  
Creates all CRUD permissions for every core module, such as:
- `user`, `role`, `permission`, `guideline`, `partner`, `catalog`, `report`, `audit`, `rule`

Example:
```json
{ "action": "create", "subject": "user", "description": "Create users" }
```

---

### 2️⃣ Create SuperAdmin Role  
If it does not exist, the seeder creates a `SuperAdmin` role with the description:

```
Full system access with all permissions
```

---

### 3️⃣ Assign Permissions to SuperAdmin  
All existing permissions are automatically linked to the `SuperAdmin` role through the `role_permissions` table.

---

### 4️⃣ Create Default Users  

| Email              | Password   | Role        | Description             |
|--------------------|------------|-------------|--------------------------|
| super@valion.com   | super123   | SuperAdmin  | Full system access ✅   |
| manager@valion.com | manager123 | —           | Sample manager user 🧑‍💼 |
| viewer@valion.com  | viewer123  | —           | Sample viewer user 👀   |

All passwords are securely hashed using **bcrypt**.

---

## 🧰 How to Run the Seeder

Make sure dependencies are installed:

```bash
npm install
```

Then run:

```bash
npx ts-node src/infrastructure/database/seeds/index.ts
```

You should see logs similar to:

```
⚙️ Database connection established...
✅ Base permissions inserted.
✅ SuperAdmin role created.
✅ 36 permissions assigned to SuperAdmin.
👤 User created: super@valion.com
👤 User created: manager@valion.com
👤 User created: viewer@valion.com
🌱 Initial seeding completed successfully!
```

---

## 🧠 Technical Notes

- The seeder uses a **transaction** to ensure atomicity (if one step fails, nothing is persisted).
- Passwords are **hashed** using `bcrypt`.
- `TypeORM` repositories are used to manage all inserts.
- You can rerun the seeder safely — it performs **upserts** (skips existing data).

---

## 🧩 Quick Reference (Main Entities)

| Entity | Description |
|---------|--------------|
| `PermissionEntity` | Defines CRUD actions for each module |
| `RoleEntity` | System roles (e.g. SuperAdmin) |
| `RolePermissionEntity` | Links roles to permissions |
| `UserEntity` | System users with assigned roles |

---

## 🧾 Summary

After running this seeder:
- The system has all base permissions populated.  
- The **SuperAdmin** role has every permission assigned.  
- Test users are available for authentication and RBAC validation.  

You can now log in with:

```
Email: super@valion.com
Password: super123
```

to get full access across all modules.

---

> ✅ Use this seeding process only in development or staging environments.  
> In production, run migrations and manually manage roles and permissions.
