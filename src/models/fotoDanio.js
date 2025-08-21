import mongoose from "mongoose";

const fotoDanioSchema = new mongoose.Schema({
 
  id_proceso: {
    type: String,
    required: true,
    trim: true,
    ref: 'ProcesoReparacion'
  },
  foto_url: {
    type: String,
    required: [true, 'La URL de la foto es requerida']
  }
}, {
  timestamps: true
});

export default mongoose.model('FotoDanio', fotoDanioSchema);
