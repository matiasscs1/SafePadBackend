import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  apellido: {
    type: String,
    required: [true, 'El apellido es requerido'],
    trim: true
  },
  correo: {
    type: String,
    required: [true, 'El correo es requerido'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  contrasena: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  fecha_nacimiento: {
    type: Date
  },
  celular: {
    type: String,
    trim: true
  },
  rol: {
    type: String,
    enum: ['usuario', 'admin'],
    default: 'usuario'
  },
  fecha_registro: {
    type: Date,
    default: Date.now
  },
  series_dispositivos: [{
    type: [],
    default: []
  }],
  foto_perfil: {
    type: String,
    trim: true
  },
  preguntas_seguridad: {
    type: String,
    required: [true, 'Las preguntas de seguridad son requeridas']
  },
  renovacionSafePad: {
    type: Number,
    default: 1
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo'],
    default: 'activo'
  },
}, {
  timestamps: true
});

export default mongoose.model('Usuario', usuarioSchema);