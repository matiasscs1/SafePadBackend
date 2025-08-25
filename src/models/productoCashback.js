import mongoose from "mongoose";

const productoCashbackSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del producto es requerido']
  },
  descripcion: {
    type: String
  },
  precio_cashback: {
    type: Number,
    required: [true, 'El precio en cashback es requerido'],
    min: 0
  },
  foto_url: {
    type: String 
  },
  activo: {
    type: Boolean,
    default: true
  },
  fecha_creacion: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('ProductoCashback', productoCashbackSchema);
