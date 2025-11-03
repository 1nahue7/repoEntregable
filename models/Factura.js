import mongoose from 'mongoose';

const facturaSchema = new mongoose.Schema({
  numero: {
    type: String,
    required: true,
    unique: true
  },
  contratoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contrato',
    required: true
  },
  entidadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entidad',
    required: true
  },
  fechaFactura: {
    type: Date,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  },
  iva: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'pagada', 'vencida'],
    default: 'pendiente'
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Factura', facturaSchema);
