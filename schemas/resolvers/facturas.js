import Factura from '../../models/Factura.js';
import Contrato from '../../models/Contrato.js';
import Entidad from '../../models/Entidad.js';

export const facturasResolvers = {
  Query: {
    facturas: async () => {
      return await Factura.find().sort({ fechaCreacion: -1 });
    },

    factura: async (_, { id }) => {
      return await Factura.findById(id);
    }
  },

  Mutation: {
    crearFactura: async (_, { input }, { usuario }) => {
      if (!usuario) {
        throw new Error('No autenticado');
      }

      const contrato = await Contrato.findById(input.contratoId);
      if (!contrato) {
        throw new Error('Contrato no encontrado');
      }

      const entidad = await Entidad.findById(input.entidadId);
      if (!entidad) {
        throw new Error('Entidad no encontrada');
      }

      const factura = new Factura(input);
      await factura.save();
      return factura;
    },

    actualizarFactura: async (_, { id, input }, { usuario }) => {
      if (!usuario) {
        throw new Error('No autenticado');
      }

      const factura = await Factura.findByIdAndUpdate(
        id,
        input,
        { new: true, runValidators: true }
      );

      if (!factura) {
        throw new Error('Factura no encontrada');
      }

      return factura;
    },

    eliminarFactura: async (_, { id }, { usuario }) => {
      if (!usuario) {
        throw new Error('No autenticado');
      }

      const resultado = await Factura.findByIdAndDelete(id);
      return resultado !== null;
    }
  },

  Factura: {
    id: (factura) => factura._id.toString(),
    contrato: async (factura) => {
      return await Contrato.findById(factura.contratoId);
    },
    entidad: async (factura) => {
      return await Entidad.findById(factura.entidadId);
    }
  }
};
