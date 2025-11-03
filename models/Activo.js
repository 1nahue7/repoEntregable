import mongoose from 'mongoose';

const activoSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  tipo: {
    type: String,
    enum: ['equipo', 'vehiculo'],
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  marca: {
    type: String,
    required: true
  },
  modelo: {
    type: String,
    required: true
  },
  anio: {
    type: Number,
    required: true
  },
  valorAlquiler: {
    type: Number,
    required: true
  },
  estado: {
    type: String,
    enum: ['disponible', 'alquilado', 'mantenimiento'],
    default: 'disponible'
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Activo', activoSchema);
