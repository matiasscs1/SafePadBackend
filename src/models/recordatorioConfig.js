import mongoose from "mongoose";

const recordatorioConfigSchema = new mongoose.Schema({
 
  id_usuario: {
    type: String,
    required: true,
    trim: true,
    ref: 'Usuario'
  },
  tipo_recordatorio: {
    type: String,
    required: true,
    enum: ['equipo_listo', 'cita_proxima', 'garantia_vencimiento']
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('RecordatorioConfig', recordatorioConfigSchema);
