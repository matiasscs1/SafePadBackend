import mongoose from "mongoose";
const estadoProcesoSchema = new mongoose.Schema({
  id_proceso: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProcesoReparacion',
    required: true
  },
  id_proceso_base: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProcesoBase',
    required: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'en_proceso', 'completado'],
    default: 'pendiente'
  },
  descripcion_personalizada: {
    type: String
  },
  fecha_actualizacion: {
    type: Date,
    default: Date.now
  },
  actualizado_por: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  }
}, {
  timestamps: true
});

export default mongoose.model('EstadoProceso', estadoProcesoSchema);
