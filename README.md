# 🚀 API de Gestión de Tareas - Challenge Puul

API REST desarrollada con NestJS, TypeScript y PostgreSQL (Supabase) para la gestión de tareas y usuarios.

## 📋 Tabla de Contenidos

- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución Local](#ejecución-local)
- [Despliegue en Vercel](#despliegue-en-vercel)
- [Endpoints](#endpoints)
- [Ejemplos de Uso](#ejemplos-de-uso)

## 🛠 Tecnologías

- **Node.js** 18+
- **NestJS** 10
- **TypeScript** 5
- **PostgreSQL** (Supabase)
- **TypeORM** - ORM para manejo de base de datos
- **Class Validator** - Validación de datos

## 📦 Requisitos Previos

1. **Node.js 18 o superior**
   ```bash
   node --version
   ```

2. **Cuenta en Supabase** (gratuita)
   - Crear cuenta en https://supabase.com
   - Crear un nuevo proyecto
   - Obtener la cadena de conexión PostgreSQL

## 🔧 Instalación

### 1. Clonar o descargar el proyecto

```bash
git clone <tu-repositorio>
cd task-management-api
```

### 2. Instalar dependencias

```bash
npm install
```

## ⚙️ Configuración

### 1. Configurar Supabase

1. Ve a tu proyecto en Supabase
2. En el menú lateral, ve a **Settings** → **Database**
3. Encuentra la sección **Connection string**
4. Copia la URI connection string
5. Reemplaza `[YOUR-PASSWORD]` con tu contraseña

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL=postgresql://postgres:TU_PASSWORD@db.xxx.supabase.co:5432/postgres
PORT=3000
NODE_ENV=development
```

**Ejemplo real:**
```env
DATABASE_URL=postgresql://postgres:miPassword123@db.abcdefghijklm.supabase.co:5432/postgres
PORT=3000
NODE_ENV=development
```

## 🚀 Ejecución Local

### Modo desarrollo (con hot-reload)

```bash
npm run start:dev
```

La API estará disponible en: `http://localhost:3000`

### Compilar para producción

```bash
npm run build
npm start
```

## 📤 Despliegue en Vercel

### 1. Preparar el proyecto

Ya está configurado con `vercel.json` y scripts necesarios.

### 2. Instalar Vercel CLI (opcional)

```bash
npm i -g vercel
```

### 3. Desplegar

#### Opción A: Desde GitHub (Recomendado)

1. Sube tu código a GitHub
2. Ve a https://vercel.com
3. Importa tu repositorio
4. Configura las variables de entorno:
   - `DATABASE_URL`: Tu connection string de Supabase
   - `NODE_ENV`: `production`
5. Despliega

#### Opción B: Desde CLI

```bash
vercel
```

### 4. Configurar variables de entorno en Vercel

En tu proyecto de Vercel:
1. Ve a **Settings** → **Environment Variables**
2. Agrega:
   - `DATABASE_URL`
   - `NODE_ENV=production`

**⚠️ Importante para Supabase:**
- Usar la URL de **Connection Pooling** (puerto 6543), no la directa (puerto 5432)
- Formato: `postgresql://user:password@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true`
- Vercel no soporta IPv6, el pooling resuelve esto

## 🚀 Estado del Deployment

### ✅ Desarrollo
- Funcionando correctamente en `localhost:3000`
- Base de datos sincronizada automáticamente

### ❌ Producción (Intento fallido)
Se intentó desplegar en **Vercel** con **Supabase PostgreSQL**, pero se presentaron errores:

#### Error 1: `ENETUNREACH - Network is unreachable`
**Causa:** Vercel no soporta IPv6 nativamente
- **Solución intentada:** Usar connection pooling de Supabase (puerto 6543)
- **Resultado:** Error resuelto parcialmente

#### Error 2: `Tenant or user not found`
**Causa:** Credenciales de base de datos incorrectas
- **Problema:** Usuario `postgres` no coincide o contraseña inválida
- **Estado:** Requiere validación de credenciales

### 🔄 Próximas Acciones
1. **Opción A - Corregir Supabase:**
   - [ ] Resetear contraseña del usuario `postgres` en Supabase
   - [ ] Actualizar `DATABASE_URL` en Vercel con la nueva contraseña
   - [ ] Redeployar desde Vercel

2. **Opción B - Migrar a Railway (Recomendado):**
   - [ ] Railway tiene mejor soporte para PostgreSQL
   - [ ] Configuración más simple para Node.js/NestJS
   - [ ] No requiere configurar pooling manualmente

### 📝 Notas Técnicas
- `synchronize: true` en desarrollo crea tablas automáticamente
- En producción usar `synchronize: false` con migraciones
- CORS está habilitado para desarrollo (`origin: '*'`)

## 📚 Endpoints

### Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/users` | Crear usuario |
| GET | `/users` | Listar usuarios (con filtros) |
| GET | `/users/:id` | Obtener usuario por ID |
| DELETE | `/users/:id` | Eliminar usuario |

### Tareas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/tasks` | Crear tarea |
| GET | `/tasks` | Listar tareas (con filtros) |
| GET | `/tasks/analytics` | Obtener estadísticas |
| GET | `/tasks/:id` | Obtener tarea por ID |
| PUT | `/tasks/:id` | Actualizar tarea |
| DELETE | `/tasks/:id` | Eliminar tarea |

## 🔍 Ejemplos de Uso

### 1. Crear un Usuario

```bash
POST /users
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "rol": "miembro"
}
```

**Respuesta:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "rol": "miembro",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 2. Listar Usuarios con Filtros

```bash
GET /users?rol=administrador&nombre=Juan
```

**Respuesta:**
```json
[
  {
    "id": "123e4567...",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "administrador",
    "cantidadTareasTerminadas": 5,
    "sumaCostoTareasTerminadas": 1500.50,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### 3. Crear una Tarea

```bash
POST /tasks
Content-Type: application/json

{
  "titulo": "Diseñar landing page",
  "descripcion": "Crear el diseño de la página principal",
  "estimacionHoras": 8,
  "fechaVencimiento": "2024-02-01T00:00:00.000Z",
  "estado": "activa",
  "costoMonetario": 500,
  "assignedUserIds": ["123e4567-e89b-12d3-a456-426614174000"]
}
```

### 4. Listar Tareas con Filtros

```bash
GET /tasks?estado=activa&orderBy=desc&nombreUsuario=Juan
```

### 5. Actualizar una Tarea

```bash
PUT /tasks/456e7890-e89b-12d3-a456-426614174000
Content-Type: application/json

{
  "estado": "terminada",
  "estimacionHoras": 10
}
```

### 6. Obtener Analíticas

```bash
GET /tasks/analytics
```

**Respuesta:**
```json
{
  "totalTareas": 25,
  "tareasActivas": 15,
  "tareasTerminadas": 10,
  "costoTotalTerminadas": 5000.00,
  "promedioHorasEstimadas": 6.5,
  "tareasProximasVencer": 3
}
```

## 🧪 Probar la API

### Usando cURL

```bash
# Crear usuario
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan","email":"juan@example.com","rol":"miembro"}'

# Listar usuarios
curl http://localhost:3000/users
```

### Usando Thunder Client / Postman

1. Importa la colección (puedes crear una con los endpoints)
2. Configura la base URL: `http://localhost:3000` o tu URL de Vercel
3. Prueba cada endpoint

## 📂 Estructura del Proyecto

```
task-management-api/
├── src/
│   ├── users/              # Módulo de usuarios
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── entities/       # Modelos de datos
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── tasks/              # Módulo de tareas
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── tasks.controller.ts
│   │   ├── tasks.service.ts
│   │   └── tasks.module.ts
│   ├── database/           # Configuración de BD
│   │   └── database.module.ts
│   ├── app.module.ts       # Módulo principal
│   └── main.ts             # Punto de entrada
├── .env                    # Variables de entorno
├── package.json
├── tsconfig.json
└── vercel.json             # Configuración de Vercel
```

## 🐛 Solución de Problemas

### Error de conexión a Supabase

- Verifica que tu `DATABASE_URL` sea correcta
- Verifica que tu contraseña no contenga caracteres especiales sin codificar
- Verifica que tu proyecto de Supabase esté activo

### Error de puerto en uso

```bash
# Cambiar puerto en .env
PORT=3001
```

### Errores de TypeScript

```bash
# Limpiar y reinstalar
rm -rf node_modules dist
npm install
npm run build
```

## 📝 Notas Importantes

- `synchronize: true` en producción debe ser `false` y usar migraciones
- Las tablas se crean automáticamente al iniciar la app
- Los UUIDs se generan automáticamente
- CORS está habilitado para desarrollo (`origin: '*'`)

## 👨‍💻 Autor

Challenge desarrollado para Puul

## 📄 Licencia

MIT
