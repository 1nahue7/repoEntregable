import mongoose from 'mongoose';

const contratoSchema = new mongoose.Schema({
  numero: {
    type: String,
    required: true,
    unique: true
  },
  entidadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entidad',
    required: true
  },
  activoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activo',
    required: true
  },
  fechaInicio: {
    type: Date,
    required: true
  },
  fechaFin: {
    type: Date,
    required: true
  },
  precioTotal: {
    type: Number,
    required: true
  },
  estado: {
    type: String,
    enum: ['activo', 'finalizado', 'cancelado'],
    default: 'activo'
  },
  observaciones: {
    type: String
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Contrato', contratoSchema);
