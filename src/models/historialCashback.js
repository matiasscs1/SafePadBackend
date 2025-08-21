import mongoose from "mongoose";

const historialCashbackSchema = new mongoose.Schema({
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
  nombre_producto: {
    type: String,
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1
  },
  costo: {
    type: Number,
    required: true,
    min: 0
  },
  fecha_compra: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('HistorialCashback', historialCashbackSchema);
