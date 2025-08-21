import mongoose from "mongoose";

const procesoReparacionSchema = new mongoose.Schema({
  id_ipad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'iPad',
    required: true
  },
  id_usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  tipo_servicio: {
    type: String,
    required: true,
    enum: ['reparacion', 'mantenimiento', 'revision_general', 'reclamo_garantia']
  },
  fecha_inicio: {
    type: Date,
    default: Date.now
  },
  estado_general: {
    type: String,
    enum: ['en_proceso', 'finalizado'],
    default: 'en_proceso'
  },
  problema_inicial: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('ProcesoReparacion', procesoReparacionSchema);
