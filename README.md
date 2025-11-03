# Sistema de Alquileres - MongoDB + GraphQL + Apollo Server

Sistema completo para gestión de alquileres de equipos y vehículos con autenticación JWT.

## 🚀 Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
   - Edita el archivo `.env` con tu configuración de MongoDB y JWT_SECRET

3. **Iniciar MongoDB:**
   - Asegúrate de que MongoDB esté corriendo en tu sistema
   - La base de datos se llamará `baseProyecto` automáticamente

4. **Ejecutar el servidor:**
```bash
# Desarrollo (con reload automático)
npm run dev

# Producción
npm start
```

El servidor estará disponible en: **http://localhost:3000**

## 🔐 Autenticación

### 1. Registrar un usuario:
```graphql
mutation {
  register(input: {
    email: "admin@ejemplo.com"
    password: "password123"
    nombre: "Administrador"
    rol: "admin"
  }) {
    token
    usuario {
      id
      email
      nombre
    }
  }
}
```

### 2. Iniciar sesión:
```graphql
mutation {
  login(input: {
    email: "admin@ejemplo.com"
    password: "password123"
  }) {
    token
    usuario {
      id
      email
      rol
    }
  }
}
```

### 3. Usar el token:
Agrega el header en tus requests:
```json
{
  "Authorization": "Bearer TU_TOKEN_AQUI"
}
```

## 📊 Base de Datos

### Colecciones:
- **usuarios** - Administradores del sistema
- **entidades** - Clientes/empresas
- **contactos** - Personas de contacto (vinculadas a entidades)
- **activos** - Equipos y vehículos
- **contratos** - Acuerdos de alquiler
- **facturas** - Facturación

## 🔍 Queries y Mutations Principales

### Entidades:
```graphql
# Listar entidades
query {
  entidades {
    id
    nombre
    tipo
    email
    telefono
  }
}

# Crear entidad
mutation {
  crearEntidad(input: {
    nombre: "Empresa ABC"
    tipo: "empresa"
    documento: "NIT"
    numeroDocumento: "900123456-1"
    email: "contacto@empresa.com"
    telefono: "3001234567"
    direccion: "Calle 123 #45-67"
    ciudad: "Bogotá"
  }) {
    id
    nombre
  }
}
```

### Activos:
```graphql
# Listar activos
query {
  activos {
    id
    codigo
    nombre
    tipo
    estado
    valorAlquiler
  }
}

# Crear activo
mutation {
  crearActivo(input: {
    codigo: "EQ001"
    tipo: "equipo"
    nombre: "Excavadora CAT"
    descripcion: "Excavadora hidráulica"
    marca: "Caterpillar"
    modelo: "320D"
    anio: 2020
    valorAlquiler: 150000
    estado: "disponible"
  }) {
    id
    nombre
  }
}
```

### Contratos:
```graphql
# Crear contrato
mutation {
  crearContrato(input: {
    numero: "CT001"
    entidadId: "ID_ENTIDAD"
    activoId: "ID_ACTIVO"
    fechaInicio: "2024-01-01"
    fechaFin: "2024-01-31"
    precioTotal: 4500000
    estado: "activo"
    observaciones: "Alquiler por un mes"
  }) {
    id
    numero
    estado
  }
}
```

### Facturas:
```graphql
# Crear factura
mutation {
  crearFactura(input: {
    numero: "FV001"
    contratoId: "ID_CONTRATO"
    entidadId: "ID_ENTIDAD"
    fechaFactura: "2024-01-15"
    subtotal: 3773109
    iva: 716890
    total: 4500000
    estado: "pendiente"
  }) {
    id
    numero
    total
    estado
  }
}
```

## 📝 Estructura del Proyecto

```
proyecto-alquiler/
├── config/
│   └── db.js              # Configuración MongoDB
├── models/
│   ├── Usuario.js
│   ├── Entidad.js
│   ├── Contacto.js
│   ├── Activo.js
│   ├── Contrato.js
│   └── Factura.js
├── schemas/
│   ├── typeDefs.js        # Schemas GraphQL
│   └── resolvers/
│       ├── index.js
│       ├── auth.js
│       ├── entidades.js
│       ├── activos.js
│       ├── contratos.js
│       ├── facturas.js
│       └── contactos.js
├── middleware/
│   └── auth.js            # Autenticación JWT
├── server.js              # Servidor principal
├── package.json
└── .env                   # Variables de entorno
```

## 🎯 Características

✅ Autenticación JWT con bcrypt
✅ Middleware de protección
✅ CRUD completo para todas las entidades
✅ Validación de datos
✅ Relaciones entre colecciones
✅ Estados de activos y contratos
✅ GraphQL Playground integrado

## 📦 Dependencias Principales

- **@apollo/server** - Servidor Apollo
- **graphql** - Query language
- **mongoose** - ODM para MongoDB
- **bcryptjs** - Hash de contraseñas
- **jsonwebtoken** - JWT
- **dotenv** - Variables de entorno
- **nodemon** - Desarrollo

¡Listo para usar! 🎉
