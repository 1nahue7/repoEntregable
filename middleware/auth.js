import jwt from 'jsonwebtoken';

export const generarToken = (usuario) => {
  return jwt.sign(
    {
      id: usuario._id,
      email: usuario.email,
      rol: usuario.rol
    },
    process.env.JWT_SECRET || 'secreto temporal',
    { expiresIn: '24h' }
  );
};

export const verificarToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'secreto temporal');
  } catch (error) {
    return null;
  }
};

export const contextoAuth = ({ req }) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (token) {
    const usuario = verificarToken(token);
    if (usuario) {
      return { usuario };
    }
  }

  return { usuario: null };
};
