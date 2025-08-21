import mongoose from "mongoose";

const ipadSchema = new mongoose.Schema({
  id_usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: false,
    default: null
  },
  serial_ipad: {
    type: String,
    required: [true, 'El serial del iPad es requerido'],
    unique: true,
    trim: true
  },
  modelo: {
    type: String,
    trim: true
  },
  fecha_compra: {
    type: Date
  },
  fecha_registro: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('iPad', ipadSchema);
