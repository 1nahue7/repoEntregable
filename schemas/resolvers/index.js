import { authResolvers } from './auth.js';
import { entidadesResolvers } from './entidades.js';
import { contactosResolvers } from './contactos.js';
import { activosResolvers } from './activos.js';
import { contratosResolvers } from './contratos.js';
import { facturasResolvers } from './facturas.js';

export const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...entidadesResolvers.Query,
    ...contactosResolvers.Query,
    ...activosResolvers.Query,
    ...contratosResolvers.Query,
    ...facturasResolvers.Query
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...entidadesResolvers.Mutation,
    ...contactosResolvers.Mutation,
    ...activosResolvers.Mutation,
    ...contratosResolvers.Mutation,
    ...facturasResolvers.Mutation
  },
  Usuario: authResolvers.Usuario,
  Entidad: entidadesResolvers.Entidad,
  Contacto: contactosResolvers.Contacto,
  Activo: activosResolvers.Activo,
  Contrato: contratosResolvers.Contrato,
  Factura: facturasResolvers.Factura
};
