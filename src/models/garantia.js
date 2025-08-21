import mongoose from "mongoose";

const garantiaSchema = new mongoose.Schema({
  id_ipad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'iPad',
    required: true
  },
  tipo_garantia: {
    type: String,
    required: true,
    enum: ['apple', 'safepad']
  },
  fecha_inicio: {
    type: Date,
    required: true,
    default: Date.now
  },
  fecha_vencimiento: {
    type: Date,
    required: true
  },
  estado: {
    type: String,
    enum: ['activa', 'vencida'],
    default: 'activa'
  }
}, {
  timestamps: true
});

export default mongoose.model('Garantia', garantiaSchema);
