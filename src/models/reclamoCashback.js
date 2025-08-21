import mongoose from "mongoose";

const reclamoCashbackSchema = new mongoose.Schema({
  id_usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  id_producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductoCashback',
    required: true
  },
  cantidad: {
    type: Number,
    default: 1,
    min: 1
  },
  costo_total: {
    type: Number,
    required: true,
    min: 0
  },
  estado: {
    type: String,
    enum: ['pendiente', 'contactado', 'entregado'],
    default: 'pendiente'
  },
  telefono_contacto: {
    type: String
  },
  fecha_reclamo: {
    type: Date,
    default: Date.now
  },
  notas_admin: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('ReclamoCashback', reclamoCashbackSchema);
