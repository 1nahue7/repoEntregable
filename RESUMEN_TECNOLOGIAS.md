# Resumen de Tecnologías - Sistema de Alquileres

## 📋 Arquitectura General

Proyecto full-stack con arquitectura **cliente-servidor** separada:
- **Backend**: API GraphQL con Node.js (puerto 4000)
- **Frontend**: Aplicación SPA con React (puerto 5173)
- **Base de Datos**: MongoDB (puerto 27017)

---

## 🔧 Backend (server.js:1-41)

### Tecnologías Principales
- **Node.js** - Entorno de ejecución JavaScript
- **Apollo Server 4** - Servidor GraphQL (`@apollo/server@4.9.5`)
- **GraphQL** - Query language (`graphql@16.8.1`)
- **MongoDB** - Base de datos NoSQL con **Mongoose** ODM (`mongoose@8.0.3`)

### Autenticación y Seguridad
- **JSON Web Token (JWT)** - Autenticación (`jsonwebtoken@9.0.2`)
- **bcryptjs** - Hash de contraseñas (`bcryptjs@2.4.3`)
- **dotenv** - Variables de entorno (`dotenv@16.3.1`)

### Herramientas de Desarrollo
- **nodemon** - Recarga automática en desarrollo (`nodemon@3.0.2`)

### Estructura del Backend
```
📁 Backend
├── config/db.js          # Conexión MongoDB
├── models/               # Modelos Mongoose
│   ├── Usuario.js
│   ├── Entidad.js
│   ├── Contacto.js
│   ├── Activo.js
│   ├── Contrato.js
│   └── Factura.js
├── schemas/
│   ├── typeDefs.js       # Schemas GraphQL
│   └── resolvers/        # Resolvers GraphQL
├── middleware/
│   └── auth.js           # JWT Middleware
└── server.js             # Servidor principal
```

---

## 🎨 Frontend (frontend-alquiler/)

### Tecnologías Principales
- **React 19** - Framework UI (`react@19.1.1`)
- **Vite** - Build tool y dev server (`vite@7.1.7`)
- **Material UI v7** - Librería de componentes UI (`@mui/material@7.3.4`)
- **Emotion** - CSS-in-JS (`@emotion/react@11.14.0`, `@emotion/styled@11.14.1`)

### Gestión de Estado y Datos
- **Apollo Client** - Cliente GraphQL (`@apollo/client@4.0.9`)
- **GraphQL** - Comunicación con API (`graphql@16.12.0`)

### Navegación y UI
- **React Router** - Navegación SPA (`react-router-dom@7.9.5`)
- **Material Icons** - Iconografía (`@mui/icons-material@7.3.4`)

### Visualización de Datos
- **Recharts** - Gráficos y visualizaciones (`recharts@3.3.0`)

### Herramientas de Desarrollo
- **ESLint** - Linting (`eslint@9.36.0`)
- **@vitejs/plugin-react** - Plugin React para Vite
- **@types/react** - Tipos TypeScript

### Estructura del Frontend
```
📁 Frontend
├── src/
│   ├── components/       # Componentes React
│   ├── lib/              # Configuraciones
│   │   ├── apollo.js     # Apollo Client
│   │   └── auth.js       # Auth utils
│   ├── context/          # Context providers
│   └── App.jsx           # Router principal
└── package.json
```

---

## 🔗 Conexiones y Flujo de Datos

### 1. Conexión Backend-Base de Datos
```javascript
// config/db.js:1-14
Mongoose → MongoDB (mongodb://localhost:27017/baseProyecto)
```

### 2. Conexión Frontend-Backend
```javascript
// frontend-alquiler/src/lib/apollo.js:1-23
Apollo Client (Puerto 5173) → GraphQL API (Puerto 4000)
- Headers: Authorization: Bearer {token}
- Cache: InMemoryCache
```

### 3. Autenticación JWT
```javascript
// middleware/auth.js:1-34
1. Frontend: Guarda token en localStorage
2. Frontend: Envía token en headers GraphQL
3. Backend: Verifica token en middleware
4. Context: Usuario autenticado disponible en resolvers
```

### 4. Flujo de Datos Típico
```
Usuario → Frontend (React) → Apollo Client → GraphQL Query/Mutation
                                      ↓
                                  JWT Token
                                      ↓
                                 Apollo Server
                                      ↓
                                Mongoose Models
                                      ↓
                                 MongoDB
```

---

## 📊 Modelos de Datos

### Esquemas MongoDB (Mongoose)
1. **Usuario** - Administradores del sistema
   - email, password, nombre, rol
2. **Entidad** - Clientes/empresas
   - nombre, tipo, documento, contacto
3. **Contacto** - Personas vinculadas a entidades
   - nombre, email, teléfono, cargo
4. **Activo** - Equipos y vehículos
   - código, tipo, nombre, valorAlquiler, estado
5. **Contrato** - Acuerdos de alquiler
   - entidad, activo, fechas, precio
6. **Factura** - Facturación
   - número, contrato, fechas, totales

---

## 🌐 Puertos y URLs

| Servicio | Puerto | URL |
|----------|--------|-----|
| MongoDB | 27017 | mongodb://localhost:27017 |
| GraphQL API | 4000 | http://localhost:4000 |
| React App | 5173 | http://localhost:5173 |

---

## 🔐 Seguridad

- **bcryptjs**: Hash de contraseñas en base de datos
- **JWT_SECRET**: Variable de entorno para firmar tokens
- **Tokens**: Expires in 24h
- **Rutas protegidas**: Frontend verifica autenticación
- **Headers**: Authorization Bearer token en cada request

---

## 📦 Dependencias Críticas

### Backend (package.json:11-17)
```
@apollo/server@4.9.5     → Servidor GraphQL
graphql@16.8.1           → Query language
mongoose@8.0.3           → ODM MongoDB
bcryptjs@2.4.3           → Hash passwords
jsonwebtoken@9.0.2       → JWT tokens
dotenv@16.3.1            → Variables entorno
```

### Frontend (frontend-alquiler/package.json:12-22)
```
@apollo/client@4.0.9     → Cliente GraphQL
@mui/material@7.3.4      → UI Components
react@19.1.1             → Framework UI
react-router-dom@7.9.5   → Navegación
recharts@3.3.0           → Gráficos
```

---

## ⚙️ Configuración de Entorno

```bash
# .env
MONGODB_URI=mongodb://localhost:27017/baseProyecto
JWT_SECRET=jz23
PORT=4000
```

---

## 🚀 Comandos de Ejecución

### Backend
```bash
npm run dev    # Desarrollo (nodemon)
npm start      # Producción
```

### Frontend
```bash
npm run dev    # Vite dev server
npm run build  # Build producción
```

---

## 📝 Conclusión

Arquitectura **JAMstack** moderna con:
- ✅ GraphQL para APIs eficientes
- ✅ React para UI reactiva
- ✅ MongoDB para flexibilidad de datos
- ✅ JWT para autenticación stateless
- ✅ Material UI para diseño consistente
- ✅ Apollo Client para manejo de estado servidor

**Separación clara** de responsabilidades entre frontend y backend, con comunicación via GraphQL y autenticación basada en tokens JWT.