import { gql } from '@apollo/client';

// ================ ENTIDADES ================
export const GET_ENTIDADES = gql`
  query GetEntidades {
    entidades {
      id
      nombre
      tipo
      documento
      numeroDocumento
      email
      telefono
      direccion
      ciudad
    }
  }
`;

export const CREATE_ENTIDAD = gql`
  mutation CrearEntidad($input: EntidadInput!) {
    crearEntidad(input: $input) {
      id
      nombre
      tipo
      documento
      numeroDocumento
      email
      telefono
      direccion
      ciudad
    }
  }
`;

export const UPDATE_ENTIDAD = gql`
  mutation ActualizarEntidad($id: ID!, $input: EntidadInput!) {
    actualizarEntidad(id: $id, input: $input) {
      id
      nombre
      tipo
      documento
      numeroDocumento
      email
      telefono
      direccion
      ciudad
    }
  }
`;

export const DELETE_ENTIDAD = gql`
  mutation EliminarEntidad($id: ID!) {
    eliminarEntidad(id: $id)
  }
`;

// ================ CONTACTOS ================
export const GET_CONTACTOS = gql`
  query GetContactos {
    contactos {
      id
      nombre
      email
      telefono
      cargo
      entidad {
        id
        nombre
      }
    }
  }
`;

export const CREATE_CONTACTO = gql`
  mutation CrearContacto($input: ContactoInput!) {
    crearContacto(input: $input) {
      id
      nombre
      email
      telefono
      cargo
      entidad {
        id
        nombre
      }
    }
  }
`;

export const UPDATE_CONTACTO = gql`
  mutation ActualizarContacto($id: ID!, $input: ContactoInput!) {
    actualizarContacto(id: $id, input: $input) {
      id
      nombre
      email
      telefono
      cargo
      entidad {
        id
        nombre
      }
    }
  }
`;

export const DELETE_CONTACTO = gql`
  mutation EliminarContacto($id: ID!) {
    eliminarContacto(id: $id)
  }
`;

// ================ ACTIVOS ================
export const GET_ACTIVOS = gql`
  query GetActivos {
    activos {
      id
      codigo
      tipo
      nombre
      descripcion
      marca
      modelo
      anio
      valorAlquiler
      estado
    }
  }
`;

export const GET_ACTIVOS_ESTADOS = gql`
  query GetActivosEstados {
    activos {
      id
      estado
    }
  }
`;

export const CREATE_ACTIVO = gql`
  mutation CrearActivo($input: ActivoInput!) {
    crearActivo(input: $input) {
      id
      codigo
      tipo
      nombre
      descripcion
      marca
      modelo
      anio
      valorAlquiler
      estado
    }
  }
`;

export const UPDATE_ACTIVO = gql`
  mutation ActualizarActivo($id: ID!, $input: ActivoInput!) {
    actualizarActivo(id: $id, input: $input) {
      id
      codigo
      tipo
      nombre
      descripcion
      marca
      modelo
      anio
      valorAlquiler
      estado
    }
  }
`;

export const DELETE_ACTIVO = gql`
  mutation EliminarActivo($id: ID!) {
    eliminarActivo(id: $id)
  }
`;

// ================ CONTRATOS ================
export const GET_CONTRATOS = gql`
  query GetContratos {
    contratos {
      id
      numero
      fechaInicio
      fechaFin
      precioTotal
      estado
      observaciones
      entidad {
        id
        nombre
      }
      activo {
        id
        codigo
        nombre
        tipo
      }
    }
  }
`;

export const GET_CONTRATOS_ESTADOS = gql`
  query GetContratosEstados {
    contratos {
      id
      estado
    }
  }
`;

export const CREATE_CONTRATO = gql`
  mutation CrearContrato($input: ContratoInput!) {
    crearContrato(input: $input) {
      id
      numero
      fechaInicio
      fechaFin
      precioTotal
      estado
      observaciones
      entidad {
        id
        nombre
      }
      activo {
        id
        codigo
        nombre
        tipo
      }
    }
  }
`;

export const UPDATE_CONTRATO = gql`
  mutation ActualizarContrato($id: ID!, $input: ContratoInput!) {
    actualizarContrato(id: $id, input: $input) {
      id
      numero
      fechaInicio
      fechaFin
      precioTotal
      estado
      observaciones
      entidad {
        id
        nombre
      }
      activo {
        id
        codigo
        nombre
        tipo
      }
    }
  }
`;

export const DELETE_CONTRATO = gql`
  mutation EliminarContrato($id: ID!) {
    eliminarContrato(id: $id)
  }
`;

// ================ FACTURAS ================
export const GET_FACTURAS = gql`
  query GetFacturas {
    facturas {
      id
      numero
      contratoId
      entidadId
      fechaFactura
      subtotal
      iva
      total
      estado
    }
  }
`;

export const GET_FACTURAS_ESTADOS = gql`
  query GetFacturasEstados {
    facturas {
      id
      estado
    }
  }
`;

export const CREATE_FACTURA = gql`
  mutation CrearFactura($input: FacturaInput!) {
    crearFactura(input: $input) {
      id
      numero
      contratoId
      entidadId
      fechaFactura
      subtotal
      iva
      total
      estado
    }
  }
`;

export const UPDATE_FACTURA = gql`
  mutation ActualizarFactura($id: ID!, $input: FacturaInput!) {
    actualizarFactura(id: $id, input: $input) {
      id
      numero
      contratoId
      entidadId
      fechaFactura
      subtotal
      iva
      total
      estado
    }
  }
`;

export const DELETE_FACTURA = gql`
  mutation EliminarFactura($id: ID!) {
    eliminarFactura(id: $id)
  }
`;
