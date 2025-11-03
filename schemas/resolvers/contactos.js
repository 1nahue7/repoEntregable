import Contacto from '../../models/Contacto.js';
import Entidad from '../../models/Entidad.js';

export const contactosResolvers = {
  Query: {
    contactos: async () => {
      return await Contacto.find().sort({ fechaCreacion: -1 });
    },

    contacto: async (_, { id }) => {
      return await Contacto.findById(id);
    }
  },

  Mutation: {
    crearContacto: async (_, { input }, { usuario }) => {
      if (!usuario) {
        throw new Error('No autenticado');
      }

      const entidad = await Entidad.findById(input.entidadId);
      if (!entidad) {
        throw new Error('Entidad no encontrada');
      }

      const contacto = new Contacto(input);
      await contacto.save();
      return contacto;
    },

    actualizarContacto: async (_, { id, input }, { usuario }) => {
      if (!usuario) {
        throw new Error('No autenticado');
      }

      const contacto = await Contacto.findByIdAndUpdate(
        id,
        input,
        { new: true, runValidators: true }
      );

      if (!contacto) {
        throw new Error('Contacto no encontrado');
      }

      return contacto;
    },

    eliminarContacto: async (_, { id }, { usuario }) => {
      if (!usuario) {
        throw new Error('No autenticado');
      }

      const resultado = await Contacto.findByIdAndDelete(id);
      return resultado !== null;
    }
  },

  Contacto: {
    id: (contacto) => contacto._id.toString(),
    entidad: async (contacto) => {
      return await Entidad.findById(contacto.entidadId);
    }
  }
};
