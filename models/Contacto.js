import mongoose from 'mongoose';

const contactoSchema = new mongoose.Schema({
  entidadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entidad',
    required: true
  },
  nombre: {
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
  cargo: {
    type: String,
    required: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Contacto', contactoSchema);
