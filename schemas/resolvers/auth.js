import bcrypt from 'bcryptjs';
import Usuario from '../../models/Usuario.js';
import { generarToken } from '../../middleware/auth.js';

export const authResolvers = {
  Query: {
    me: async (_, __, { usuario }) => {
      if (!usuario) {
        throw new Error('No autenticado');
      }
      return await Usuario.findById(usuario.id);
    }
  },

  Mutation: {
    register: async (_, { input }) => {
      const { email, password, nombre, rol = 'user' } = input;

      const existeUsuario = await Usuario.findOne({ email });
      if (existeUsuario) {
        throw new Error('El email ya está registrado');
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const usuario = new Usuario({
        email,
        password: passwordHash,
        nombre,
        rol
      });

      await usuario.save();

      const token = generarToken(usuario);

      return { token, usuario };
    },

    login: async (_, { input }) => {
      const { email, password } = input;

      const usuario = await Usuario.findOne({ email });
      if (!usuario) {
        throw new Error('Credenciales inválidas');
      }

      const passwordValido = await bcrypt.compare(password, usuario.password);
      if (!passwordValido) {
        throw new Error('Credenciales inválidas');
      }

      const token = generarToken(usuario);

      return { token, usuario };
    }
  },

  Usuario: {
    id: (usuario) => usuario._id.toString()
  }
};
