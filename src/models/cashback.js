import mongoose from "mongoose";
const cashbackSchema = new mongoose.Schema({
  id_usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
    unique: true
  },
  saldo_actual: {
    type: Number,
    default: 0,
    min: 0
  },
  fecha_ultima_renovacion: {
    type: Date
  }
}, {
  timestamps: true
});

export default mongoose.model('Cashback', cashbackSchema);
