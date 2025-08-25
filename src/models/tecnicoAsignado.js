import mongoose from "mongoose";

const tecnicoAsignadoSchema = new mongoose.Schema({
  id_usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  apellido: {
    type: String,
    required: true
  },
  procesos_asignados: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProcesoReparacion",
      default: []
    }
  ]
}, {
  timestamps: true
});

export default mongoose.model("TecnicoAsignado", tecnicoAsignadoSchema);
