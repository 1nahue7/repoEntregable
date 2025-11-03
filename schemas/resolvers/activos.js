import Activo from '../../models/Activo.js';

export const activosResolvers = {
  Query: {
    activos: async () => {
      return await Activo.find().sort({ fechaCreacion: -1 });
    },

    activo: async (_, { id }) => {
      return await Activo.findById(id);
    }
  },

  Mutation: {
    crearActivo: async (_, { input }, { usuario }) => {
      if (!usuario) {
        throw new Error('No autenticado');
      }

      const activo = new Activo(input);
      await activo.save();
      return activo;
    },

    actualizarActivo: async (_, { id, input }, { usuario }) => {
      if (!usuario) {
        throw new Error('No autenticado');
      }

      const activo = await Activo.findByIdAndUpdate(
        id,
        input,
        { new: true, runValidators: true }
      );

      if (!activo) {
        throw new Error('Activo no encontrado');
      }

      return activo;
    },

    eliminarActivo: async (_, { id }, { usuario }) => {
      if (!usuario) {
        throw new Error('No autenticado');
      }

      const resultado = await Activo.findByIdAndDelete(id);
      return resultado !== null;
    }
  },

  Activo: {
    id: (activo) => activo._id.toString()
  }
};
