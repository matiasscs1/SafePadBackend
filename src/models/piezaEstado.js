import mongoose from "mongoose";

const piezaEstadoSchema = new mongoose.Schema({
  id_proceso: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProcesoReparacion',
    required: true
  },
  nombre_pieza: {
    type: String,
    required: [true, 'El nombre de la pieza es requerido']
  },
  estado: {
    type: String,
    enum: ['pendiente', 'recibida'],
    default: 'pendiente'
  },
  fecha_solicitud: {
    type: Date
  },
  fecha_recibida: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model('PiezaEstado', piezaEstadoSchema);
