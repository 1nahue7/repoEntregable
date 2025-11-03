import mongoose from 'mongoose';

const entidadSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    enum: ['empresa', 'persona'],
    required: true
  },
  documento: {
    type: String,
    enum: ['CUIT', 'CUIL', 'DNI'],
    required: true
  },
  numeroDocumento: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  telefono: {
    type: String,
    required: true
  },
  direccion: {
    type: String,
    required: true
  },
  ciudad: {
    type: String,
    required: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Entidad', entidadSchema);
