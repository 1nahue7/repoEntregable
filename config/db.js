import mongoose from 'mongoose';

const conectarDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/baseProyecto';
    await mongoose.connect(uri);
    console.log('✅ MongoDB conectado correctamente');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

export default conectarDB;
