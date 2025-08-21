
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Usuario from '../models/usuario.js';
import Ipad from '../models/ipad.js';
import Garantia from '../models/garantia.js';
import ProcesoReparacion from '../models/procesoReparacion.js';
import EstadoProceso from '../models/estadoProceso.js';
import PiezaEstado from '../models/piezaEstado.js';
import FotoDanio from '../models/fotoDanio.js';
import HistorialCashback from '../models/historialCashback.js';
import ReclamoCashback from '../models/reclamoCashback.js';
import Cita from '../models/cita.js';
import Notificacion from '../models/notificacion.js';
import RecordatorioConfig from '../models/recordatorioConfig.js';
import mongoose from 'mongoose';
import { createAccessToken } from '../libs/jwt.js';


// POST /api/usuarios/registro

export const registrarUsuario = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      correo,
      contrasena,
      fecha_nacimiento,
      celular,
      preguntas_seguridad,
      rol,
      series_dispositivos, // array de seriales de ipads
      foto_perfil,
      estado
    } = req.body;

    // Validaciones obligatorias
    if (
      !nombre ||
      !apellido ||
      !correo ||
      !contrasena ||
      !preguntas_seguridad ||
      !series_dispositivos ||
      !Array.isArray(series_dispositivos) ||
      series_dispositivos.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Nombre, apellido, correo, contraseña, preguntas de seguridad y al menos un serial de dispositivo son requeridos"
      });
    }

    // Verificar si ya existe usuario con ese correo
    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        message: "El usuario ya existe con este correo"
      });
    }

    // Buscar iPads que coincidan con los seriales enviados
    const ipads = await Ipad.find({
      serial_ipad: { $in: series_dispositivos }
    });

    // Validar si todos los seriales existen en BD
    if (ipads.length !== series_dispositivos.length) {
      const encontrados = ipads.map(ipad => ipad.serial_ipad);
      const noEncontrados = series_dispositivos.filter(
        s => !encontrados.includes(s)
      );
      return res.status(400).json({
        success: false,
        message: `Los siguientes seriales no existen: ${noEncontrados.join(
          ", "
        )}. Verifique con el seguro.`
      });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Crear usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      correo,
      contrasena: hashedPassword,
      fecha_nacimiento,
      celular,
      preguntas_seguridad,
      rol: 'usuario',
      series_dispositivos,
      foto_perfil,
      estado
    });

    // Vincular usuario a los iPads encontrados
    await Promise.all(
      ipads.map(ipad =>
        Ipad.findByIdAndUpdate(ipad._id, { $set: { id_usuario: nuevoUsuario._id } })
      )
    );

    // Quitar contraseña de la respuesta
    const { contrasena: _, ...usuarioSinPassword } = nuevoUsuario.toObject();

    res.status(201).json({
      success: true,
      message: "Usuario registrado correctamente y vinculado a sus dispositivos",
      data: usuarioSinPassword
    });
  } catch (error) {
    console.error("Error en registrarUsuario:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({
      success: false,
      message: "Error del servidor."
    });
  }
};




// POST /api/usuarios/login
export const loginUsuario = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    
    if (!correo || !contrasena) {
      return res.status(400).json({
        success: false,
        message: 'Correo y contraseña son requeridos'
      });
    }
    
    // Buscar usuario
    const usuario = await Usuario.findOne({ correo });

    if(usuario.rol !== 'usuario') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado'
      });
    }

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // Verificar contraseña
    const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!passwordValida) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // Generar token usando createAccessToken
    const token = await createAccessToken({
      id: usuario._id, 
      correo: usuario.correo, 
      rol: usuario.rol 
    });
    
    // Remover contraseña
    const { contrasena: _, ...usuarioSinPassword } = usuario.toObject();
    
    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        usuario: usuarioSinPassword,
        token
      }
    });
    
  } catch (error) {
    console.error("Error en loginUsuario:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor."
    });
  }
};

// POST /login/admin

export const loginAdmin = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({
        success: false,
        message: 'Correo y contraseña son requeridos'
      });
    }

    // Buscar usuario
    const usuario = await Usuario.findOne({ correo });

    if(usuario.rol !== 'administrador') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado'
      });
    }

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!passwordValida) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar token usando createAccessToken
    const token = await createAccessToken({
      id: usuario._id,
      correo: usuario.correo,
      rol: usuario.rol
    });

    // Remover contraseña
    const { contrasena: _, ...usuarioSinPassword } = usuario.toObject();

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        usuario: usuarioSinPassword,
        token
      }
    });

  } catch (error) {
    console.error("Error en loginAdmin:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor."
    });
  }
};

// PUT /api/usuarios/cambiar-contrasena 
export const cambiarContrasena = async (req, res) => {
  try {
    const { correo, nueva_contrasena, pregunta_seguridad } = req.body;

    if (!correo || !nueva_contrasena || !pregunta_seguridad) {
      return res.status(400).json({
        success: false,
        message: "Correo, nueva contraseña y pregunta de seguridad son requeridos"
      });
    }

    const email = String(correo).trim().toLowerCase();
    const usuario = await Usuario.findOne({ correo: email });
    if (!usuario) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    // Normalizar textos para comparar
    const normalize = s => String(s).trim().toLowerCase().replace(/\s+/g, " ");
    const inputSeg = normalize(pregunta_seguridad);
    const storedSeg = normalize(usuario.preguntas_seguridad || usuario.pregunta_seguridad);

    if (inputSeg !== storedSeg) {
      return res.status(400).json({ success: false, message: "La respuesta de seguridad es incorrecta" });
    }

    if (nueva_contrasena.length < 6) {
      return res.status(400).json({ success: false, message: "La nueva contraseña debe tener al menos 6 caracteres" });
    }

    usuario.contrasena = await bcrypt.hash(nueva_contrasena, 10);
    await usuario.save();

    return res.json({ success: true, message: "Contraseña actualizada correctamente" });

  } catch (error) {
    console.error("Error en cambiarContrasena:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
};
// PUT /api/ipads/asignar
export const ingresarSerial = async (req, res) => {
  try {
    const { serial_ipad } = req.body;
    const id_usuario = req.user.id; // <-- viene del token

    if (!serial_ipad) {
      return res.status(400).json({
        success: false,
        message: "El serial de iPad es requerido"
      });
    }

    // Buscar iPad por serial
    const ipad = await Ipad.findOne({ serial_ipad });
    if (!ipad) {
      return res.status(404).json({
        success: false,
        message: "iPad no encontrado"
      });
    }

    // Asignar iPad al usuario
    ipad.id_usuario = id_usuario; // Mongoose convertirá automáticamente a ObjectId
    await ipad.save();

    // Agregar serial al usuario (evita duplicados)
    await Usuario.findByIdAndUpdate(
      id_usuario,
      { $addToSet: { series_dispositivos: serial_ipad } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "iPad asignado correctamente al usuario",
      data: ipad
    });

  } catch (error) {
    console.error("Error en ingresarSerial:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor."
    });
  }
};



// DELETE /api/usuarios/:id (solo admin) - ELIMINAR TODO EN CASCADA
export const eliminarUsuario = async (req, res) => {
  try {
    if (req.user.rol !== 'administrador') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos'
      });
    }
    
    const { id } = req.params;
    
    // Verificar que el usuario existe
    const usuario = await Usuario.findOne({ _id: id });
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    // ===== ELIMINAR TODO EN CASCADA =====
    
    // 1. Obtener todos los iPads del usuario
    const ipadsDelUsuario = await iPad.find({ _id: id });
    const ipadIds = ipadsDelUsuario.map(ipad => ipad._id);
    
    // 2. Eliminar todas las garantías de sus iPads
    if (ipadIds.length > 0) {
      await Garantia.deleteMany({ _id: { $in: ipadIds } });
      console.log(`Eliminadas garantías de ${ipadIds.length} iPads`);
    }
    
    // 3. Eliminar todos los procesos de reparación y sus datos relacionados
    const procesosDelUsuario = await ProcesoReparacion.find({ _id: id });
    const procesoIds = procesosDelUsuario.map(proceso => proceso._id);

    if (procesoIds.length > 0) {
      // Eliminar estados de procesos
      await EstadoProceso.deleteMany({ _id: { $in: procesoIds } });
      
      // Eliminar piezas de los procesos
      await PiezaEstado.deleteMany({ _id: { $in: procesoIds } });
      
      // Eliminar fotos de daños
      await FotoDanio.deleteMany({ _id: { $in: procesoIds } });
      
      // Eliminar los procesos principales
      await ProcesoReparacion.deleteMany({ _id: id });
      
      console.log(`Eliminados ${procesoIds.length} procesos y sus datos relacionados`);
    }
    
    // 4. Eliminar cashback y transacciones
    const cashbackUsuario = await Cashback.findOne({ _id: id });
    if (cashbackUsuario) {
      // Eliminar historial de cashback
      await HistorialCashback.deleteMany({ _id: id });
      
      // Eliminar reclamos de cashback
      await ReclamoCashback.deleteMany({ _id: id });
      
      // Eliminar cashback principal
      await Cashback.deleteMany({ _id: id });
      
      console.log('Eliminados datos de cashback');
    }
    
    // 5. Eliminar todas las citas
    await Cita.deleteMany({ _id: id });
    console.log('Eliminadas citas del usuario');
    
    // 6. Eliminar todas las notificaciones
    await Notificacion.deleteMany({ _id: id });
    console.log('Eliminadas notificaciones del usuario');
    
    // 7. Eliminar configuraciones de recordatorios
    await RecordatorioConfig.deleteMany({ _id: id });
    console.log('Eliminadas configuraciones de recordatorios');
    
    // 8. Eliminar los iPads del usuario
    if (ipadIds.length > 0) {
      await iPad.deleteMany({ _id: id });
      console.log(`Eliminados ${ipadIds.length} iPads`);
    }
    
    // 9. FINALMENTE eliminar el usuario principal
    await Usuario.findOneAndDelete({ _id: id });
    
    res.json({
      success: true,
      message: 'Usuario y todos sus datos eliminados completamente',
      data: {
        usuario_eliminado: usuario.nombre + ' ' + usuario.apellido,
        ipads_eliminados: ipadIds.length,
        procesos_eliminados: procesoIds.length,
        eliminacion_completa: true
      }
    });
    
  } catch (error) {
    console.error("Error en eliminarUsuario:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor al eliminar usuario."
    });
  }
};

