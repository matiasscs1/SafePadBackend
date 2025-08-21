import mongoose from "mongoose";

const citaSchema = new mongoose.Schema({
 
  id_usuario: {
    type: String,
    required: true,
    trim: true,
    ref: 'Usuario'
  },
  id_ipad: {
    type: String,
    required: true,
    trim: true,
    ref: 'iPad'
  },
  fecha_cita: {
    type: Date,
    required: [true, 'La fecha de la cita es requerida']
  },
  hora_cita: {
    type: String,
    required: [true, 'La hora de la cita es requerida']
  },
  motivo: {
    type: String,
    required: true,
    enum: ['reparacion', 'mantenimiento', 'revision_general', 'reclamo_garantia']
  },
  detalle: {
    type: String
  },
  estado: {
    type: String,
    enum: ['programada', 'completada', 'cancelada'],
    default: 'programada'
  },
  fecha_creacion: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('Cita', citaSchema);
