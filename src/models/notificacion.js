import mongoose from "mongoose";

const notificacionSchema = new mongoose.Schema({
 
  id_usuario: {
    type: String,
    required: true,
    trim: true,
    ref: 'Usuario'
  },
  tipo: {
    type: String,
    required: true,
    enum: ['proceso_actualizado', 'equipo_listo', 'recordatorio', 'admin_manual']
  },
  titulo: {
    type: String,
    required: [true, 'El título es requerido']
  },
  mensaje: {
    type: String,
    required: [true, 'El mensaje es requerido']
  },
  leida: {
    type: Boolean,
    default: false
  },
  fecha_envio: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('Notificacion', notificacionSchema);
