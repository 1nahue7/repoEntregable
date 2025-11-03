import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import dotenv from 'dotenv';
import conectarDB from './config/db.js';
import { typeDefs } from './schemas/typeDefs.js';
import { resolvers } from './schemas/resolvers/index.js';
import { contextoAuth } from './middleware/auth.js';

dotenv.config();

const server = new ApolloServer({
  typeDefs,
  resolvers
});

const puerto = parseInt(process.env.PORT) || 4000;

const { url } = await startStandaloneServer(server, {
  listen: { port: puerto },
  context: async ({ req }) => {
    return contextoAuth({ req });
  }
});

const iniciar = async () => {
  try {
    await conectarDB();
    console.log(`🚀 Servidor listo en: ${url}`);
    console.log(`📊 GraphQL Playground: ${url}`);
    console.log('');
    console.log('💡 Para usar la API:');
    console.log('   1. Regístrate con register(email, password, nombre)');
    console.log('   2. Obtén el token con login(email, password)');
    console.log('   3. Usa el token en los headers: { "Authorization": "Bearer TU_TOKEN" }');
  } catch (error) {
    console.error('Error iniciando el servidor:', error);
    process.exit(1);
  }
};

iniciar();
