import mongoose from "mongoose";

const procesoBaseSchema = new mongoose.Schema({
  nombre_proceso: {
    type: String,
    required: [true, 'El nombre del proceso es requerido'],
    unique: true
  },
  orden: {
    type: Number,
    required: [true, 'El orden es requerido']
  },
  tipo: {
    type: String,
    required: true,
    enum: ['reparacion', 'mantenimiento', 'revision', 'reclamo_garantia']
  },
  descripcion_default: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('ProcesoBase', procesoBaseSchema);
