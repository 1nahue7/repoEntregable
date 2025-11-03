import Contrato from '../../models/Contrato.js';
import Entidad from '../../models/Entidad.js';
import Activo from '../../models/Activo.js';

export const contratosResolvers = {
  Query: {
    contratos: async () => {
      return await Contrato.find().sort({ fechaCreacion: -1 });
    },

    contrato: async (_, { id }) => {
      return await Contrato.findById(id);
    }
  },

  Mutation: {
    crearContrato: async (_, { input }, { usuario }) => {
      if (!usuario) {
        throw new Error('No autenticado');
      }

      const entidad = await Entidad.findById(input.entidadId);
      if (!entidad) {
        throw new Error('Entidad no encontrada');
      }

      const activo = await Activo.findById(input.activoId);
      if (!activo) {
        throw new Error('Activo no encontrado');
      }

      if (activo.estado === 'alquilado') {
        throw new Error('El activo no está disponible');
      }

      const contrato = new Contrato(input);
      await contrato.save();

      await Activo.findByIdAndUpdate(input.activoId, { estado: 'alquilado' });

      return contrato;
    },

    actualizarContrato: async (_, { id, input }, { usuario }) => {
      if (!usuario) {
        throw new Error('No autenticado');
      }

      const contrato = await Contrato.findByIdAndUpdate(
        id,
        input,
        { new: true, runValidators: true }
      );

      if (!contrato) {
        throw new Error('Contrato no encontrado');
      }

      return contrato;
    },

    eliminarContrato: async (_, { id }, { usuario }) => {
      if (!usuario) {
        throw new Error('No autenticado');
      }

      const contrato = await Contrato.findById(id);
      if (!contrato) {
        throw new Error('Contrato no encontrado');
      }

      await Activo.findByIdAndUpdate(contrato.activoId, { estado: 'disponible' });

      const resultado = await Contrato.findByIdAndDelete(id);
      return resultado !== null;
    }
  },

  Contrato: {
    id: (contrato) => contrato._id.toString(),
    entidad: async (contrato) => {
      return await Entidad.findById(contrato.entidadId);
    },
    activo: async (contrato) => {
      return await Activo.findById(contrato.activoId);
    }
  }
};
