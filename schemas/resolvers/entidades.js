import Entidad from '../../models/Entidad.js';
import Contacto from '../../models/Contacto.js';

export const entidadesResolvers = {
  Query: {
    entidades: async () => {
      return await Entidad.find().sort({ fechaCreacion: -1 });
    },

    entidad: async (_, { id }) => {
      return await Entidad.findById(id);
    }
  },

  Mutation: {
    crearEntidad: async (_, { input }, { usuario }) => {
      if (!usuario) {
        throw new Error('No autenticado');
      }

      const { tipo, documento } = input;

      if (tipo === 'empresa' && documento !== 'CUIT') {
        throw new Error('Las empresas solo pueden tener documento CUIT');
      }

      if (tipo === 'persona' && !['CUIL', 'DNI'].includes(documento)) {
        throw new Error('Las personas físicas solo pueden tener documento CUIL o DNI');
      }

      const entidad = new Entidad(input);
      await entidad.save();
      return entidad;
    },

    actualizarEntidad: async (_, { id, input }, { usuario }) => {
      if (!usuario) {
        throw new Error('No autenticado');
      }

      const { tipo, documento } = input;

      if (tipo && documento) {
        if (tipo === 'empresa' && documento !== 'CUIT') {
          throw new Error('Las empresas solo pueden tener documento CUIT');
        }

        if (tipo === 'persona' && !['CUIL', 'DNI'].includes(documento)) {
          throw new Error('Las personas físicas solo pueden tener documento CUIL o DNI');
        }
      }

      const entidad = await Entidad.findByIdAndUpdate(
        id,
        input,
        { new: true, runValidators: true }
      );

      if (!entidad) {
        throw new Error('Entidad no encontrada');
      }

      return entidad;
    },

    eliminarEntidad: async (_, { id }, { usuario }) => {
      if (!usuario) {
        throw new Error('No autenticado');
      }

      const contacto = await Contacto.findOne({ entidadId: id });
      if (contacto) {
        throw new Error('No se puede eliminar: existen contactos asociados');
      }

      const resultado = await Entidad.findByIdAndDelete(id);
      return resultado !== null;
    }
  },

  Entidad: {
    id: (entidad) => entidad._id.toString(),
    contactos: async (entidad) => {
      return await Contacto.find({ entidadId: entidad._id });
    }
  }
};
