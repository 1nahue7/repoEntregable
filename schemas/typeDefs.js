export const typeDefs = `#graphql
  type Usuario {
    id: ID!
    email: String!
    nombre: String!
    rol: String!
    fechaCreacion: String!
  }

  type Entidad {
    id: ID!
    nombre: String!
    tipo: String!
    documento: String!
    numeroDocumento: String!
    email: String!
    telefono: String!
    direccion: String!
    ciudad: String!
    fechaCreacion: String!
    contactos: [Contacto]
  }

  type Contacto {
    id: ID!
    entidadId: ID!
    nombre: String!
    email: String!
    telefono: String!
    cargo: String!
    fechaCreacion: String!
    entidad: Entidad
  }

  type Activo {
    id: ID!
    codigo: String!
    tipo: String!
    nombre: String!
    descripcion: String!
    marca: String!
    modelo: String!
    anio: Int!
    valorAlquiler: Float!
    estado: String!
    fechaCreacion: String!
  }

  type Contrato {
    id: ID!
    numero: String!
    entidadId: ID!
    activoId: ID!
    fechaInicio: String!
    fechaFin: String!
    precioTotal: Float!
    estado: String!
    observaciones: String
    fechaCreacion: String!
    entidad: Entidad
    activo: Activo
  }

  type Factura {
    id: ID!
    numero: String!
    contratoId: ID!
    entidadId: ID!
    fechaFactura: String!
    subtotal: Float!
    iva: Float!
    total: Float!
    estado: String!
    fechaCreacion: String!
    contrato: Contrato
    entidad: Entidad
  }

  type AuthPayload {
    token: String!
    usuario: Usuario!
  }

  input UsuarioInput {
    email: String!
    password: String!
    nombre: String!
    rol: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input EntidadInput {
    nombre: String!
    tipo: String!
    documento: String!
    numeroDocumento: String!
    email: String!
    telefono: String!
    direccion: String!
    ciudad: String!
  }

  input ContactoInput {
    entidadId: ID!
    nombre: String!
    email: String!
    telefono: String!
    cargo: String!
  }

  input ActivoInput {
    codigo: String!
    tipo: String!
    nombre: String!
    descripcion: String!
    marca: String!
    modelo: String!
    anio: Int!
    valorAlquiler: Float!
    estado: String
  }

  input ContratoInput {
    numero: String!
    entidadId: ID!
    activoId: ID!
    fechaInicio: String!
    fechaFin: String!
    precioTotal: Float!
    estado: String
    observaciones: String
  }

  input FacturaInput {
    numero: String!
    contratoId: ID!
    entidadId: ID!
    fechaFactura: String!
    subtotal: Float!
    iva: Float!
    total: Float!
    estado: String
  }

  type Query {
    login(input: LoginInput!): AuthPayload!
    me: Usuario

    entidades: [Entidad!]!
    entidad(id: ID!): Entidad

    contactos: [Contacto!]!
    contacto(id: ID!): Contacto

    activos: [Activo!]!
    activo(id: ID!): Activo

    contratos: [Contrato!]!
    contrato(id: ID!): Contrato

    facturas: [Factura!]!
    factura(id: ID!): Factura
  }

  type Mutation {
    register(input: UsuarioInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!

    crearEntidad(input: EntidadInput!): Entidad!
    actualizarEntidad(id: ID!, input: EntidadInput!): Entidad!
    eliminarEntidad(id: ID!): Boolean!

    crearContacto(input: ContactoInput!): Contacto!
    actualizarContacto(id: ID!, input: ContactoInput!): Contacto!
    eliminarContacto(id: ID!): Boolean!

    crearActivo(input: ActivoInput!): Activo!
    actualizarActivo(id: ID!, input: ActivoInput!): Activo!
    eliminarActivo(id: ID!): Boolean!

    crearContrato(input: ContratoInput!): Contrato!
    actualizarContrato(id: ID!, input: ContratoInput!): Contrato!
    eliminarContrato(id: ID!): Boolean!

    crearFactura(input: FacturaInput!): Factura!
    actualizarFactura(id: ID!, input: FacturaInput!): Factura!
    eliminarFactura(id: ID!): Boolean!
  }
`;
