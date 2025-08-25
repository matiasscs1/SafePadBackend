import Ipad from "../models/ipad.js"; 
import Garantia from "../models/garantia.js";
import ProcesoReparacion from "../models/procesoReparacion.js";
import TecnicoAsignado from "../models/tecnicoAsignado.js";
import  PiezaEstado from "../models/piezaEstado.js";
import ProductoCashback from "../models/productoCashback.js";

import { v2 as cloudinary } from "cloudinary";

import mongoose from "mongoose";

// Registrar un nuevo iPad
export const RegistrarIpad = async (req, res) => {
    try {
        const { serial_ipad, modelo, fecha_compra } = req.body;
        if (!serial_ipad || !modelo || !fecha_compra) {
            return res.status(400).json({ success: false, message: "Todos los campos son requeridos" });
        }
        const ipadExistente = await Ipad.findOne({ serial_ipad });
        if (ipadExistente) return res.status(400).json({ success: false, message: "El iPad ya está registrado" });

        const nuevoIpad = await Ipad.create({ serial_ipad, modelo, fecha_compra });
        res.status(201).json({ success: true, message: "iPad registrado correctamente", data: nuevoIpad });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error del servidor." });
    }
};

// Registrar garantía
export const RegistrarGarantia = async (req, res) => {
    try {
        const { id_ipad, tipo_garantia, fecha_vencimiento } = req.body;
        if (!id_ipad || !tipo_garantia || !fecha_vencimiento) {
            return res.status(400).json({ success: false, message: "Todos los campos son requeridos" });
        }
        const ipadExistente = await Ipad.findById(id_ipad);
        if (!ipadExistente) return res.status(404).json({ success: false, message: "iPad no encontrado" });

        const nuevaGarantia = await Garantia.create({ id_ipad, tipo_garantia, fecha_vencimiento });
        res.status(201).json({ success: true, message: "Garantía registrada correctamente", data: nuevaGarantia });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error del servidor." });
    }
};

// Obtener todos los iPads
export const obtenerTodosLosIpads = async (req, res) => {
  try {
    // Solo traer iPads que tienen un usuario asignado (id_usuario ≠ null)
    const ipads = await Ipad.find({ id_usuario: { $ne: null } })
                            .populate("id_usuario");
    
    res.status(200).json(ipads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los iPads" });
  }
};


// Crear un nuevo proceso de reparación
export const crearProceso = async (req, res) => {
  try {
    const { id_ipad, id_usuario, tipo_servicio, problema_inicial, pasos, id_tecnico } = req.body;

    // Validaciones de IDs
    if (!mongoose.Types.ObjectId.isValid(id_ipad)) 
      return res.status(400).json({ error: "id_ipad no es válido" });
    if (!mongoose.Types.ObjectId.isValid(id_usuario)) 
      return res.status(400).json({ error: "id_usuario no es válido" });
    if (!mongoose.Types.ObjectId.isValid(id_tecnico)) 
      return res.status(400).json({ error: "id_tecnico no es válido" });

    // Crear el proceso
    const nuevoProceso = new ProcesoReparacion({ id_ipad, id_usuario, tipo_servicio, problema_inicial, pasos });
    const procesoGuardado = await nuevoProceso.save();

    // Asignar el proceso al técnico seleccionado
    if (id_tecnico) {
      await TecnicoAsignado.findByIdAndUpdate(
        id_tecnico,
        { $push: { procesos_asignados: procesoGuardado._id } },
        { new: true }
      );
    }

    res.status(201).json({
      message: "Proceso de reparación creado correctamente",
      proceso: procesoGuardado
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el proceso de reparación" });
  }
};

// agregar etapas al proceso
export const agregarEtapasProceso = async (req, res) => {
  try {
    const { id_proceso, nuevo_paso } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id_proceso)) {
      return res.status(400).json({ error: "id_proceso no es válido" });
    }

    const procesoActualizado = await ProcesoReparacion.findByIdAndUpdate(
      id_proceso,
      { $push: { pasos: nuevo_paso } },
      { new: true }
    );

    if (!procesoActualizado) {
      return res.status(404).json({ error: "Proceso no encontrado" });
    }

    res.status(200).json({
      message: "Paso agregado correctamente",
      proceso: procesoActualizado
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar el paso" });
  }
};


/// MODIFICAR PASO 

 export const modificarPaso = async (req, res) => {
  try {
    const { id_proceso, id_paso, titulo, descripcion, estado, detalles } = req.body;

    // Validar IDs
    if (!mongoose.Types.ObjectId.isValid(id_proceso)) 
      return res.status(400).json({ error: "id_proceso no es válido" });
    if (!mongoose.Types.ObjectId.isValid(id_paso)) 
      return res.status(400).json({ error: "id_paso no es válido" });

    // Construir dinámicamente el objeto de actualización
    const updateFields = {};
    if (titulo !== undefined) updateFields["pasos.$.titulo"] = titulo;
    if (descripcion !== undefined) updateFields["pasos.$.descripcion"] = descripcion;
    if (estado !== undefined) updateFields["pasos.$.estado"] = estado;
    if (detalles !== undefined) updateFields["pasos.$.detalles"] = detalles;

    // Actualizar solo los campos enviados
    const procesoActualizado = await ProcesoReparacion.findOneAndUpdate(
      { "_id": id_proceso, "pasos._id": id_paso },
      { $set: updateFields },
      { new: true }
    );

    if (!procesoActualizado) {
      return res.status(404).json({ error: "Proceso o paso no encontrado" });
    }

    res.status(200).json({
      message: "Paso del proceso actualizado correctamente",
      proceso: procesoActualizado
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al modificar el paso del proceso" });
  }
};

// mostrar todos los  procesos
export const mostrarProcesosAdmin = async (req, res) => {
  try {
    const procesos = await ProcesoReparacion.find()
    res.status(200).json({
      message: "Procesos encontrados",
      procesos
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al mostrar los procesos" });
  }
};

// crear tecnicos asignados
export const crearTecnico = async (req, res) => {
  try {
    const {  nombre, apellido } = req.body;
    const id_usuario = req.id;

    // Validar que sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id_usuario)) {
      return res.status(400).json({ error: "id_usuario no es válido" });
    }

    // Crear técnico nuevo (procesos_asignados arranca vacío automáticamente)
    const nuevoTecnico = new TecnicoAsignado({ id_usuario, nombre, apellido });
    const tecnicoGuardado = await nuevoTecnico.save();

    res.status(201).json({
      message: "Técnico creado correctamente",
      tecnico: tecnicoGuardado
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el técnico" });
  }
};

export const mostrarTecnicos = async (req, res) => {
  try {
    const tecnicos = await TecnicoAsignado.find().populate("id_usuario", "nombre apellido correo");
    res.status(200).json({
      success: true,
      data: tecnicos
    });
  } catch (error) {
    console.error("Error en mostrarTecnicos:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor."
    });
  }
};

// agregar tecnico al proceso 

export const agregarTecnicoProceso = async (req, res) => {
  try {
    const { id_proceso, id_tecnico } = req.body;

    // Validar IDs
    if (!mongoose.Types.ObjectId.isValid(id_proceso)) {
      return res.status(400).json({ error: "id_proceso no es válido" });
    }
    if (!mongoose.Types.ObjectId.isValid(id_tecnico)) {
      return res.status(400).json({ error: "id_tecnico no es válido" });
    }

    // Agregar el técnico al proceso
    const procesoActualizado = await TecnicoAsignado.findByIdAndUpdate(
      id_tecnico,
      { $addToSet: { procesos_asignados: id_proceso } },
      { new: true }
    );

    if (!procesoActualizado) {
      return res.status(404).json({ error: "Proceso no encontrado" });
    }

    res.status(200).json({
      message: "Técnico agregado al proceso correctamente",
      proceso: procesoActualizado
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar el técnico al proceso" });
  }
};

// AGREGAR PIEZAS A REPARAR EN EL PROCESO

export const agregarPiezasReparacion = async (req, res) => {
  try {
    const { id_proceso, id_ipad,  nombre_pieza, estado, fecha_solicitud } = req.body;

    // Validar IDs
    if (!mongoose.Types.ObjectId.isValid(id_proceso)) {
      return res.status(400).json({ error: "id_proceso no es válido" });
    }

    const nuevaPieza = new PiezaEstado({
      id_proceso,
      id_ipad,
      nombre_pieza,
      estado,
      fecha_solicitud
    });

    const piezaGuardada = await nuevaPieza.save();

    res.status(201).json({
      message: "Pieza agregada al proceso correctamente",
      pieza: piezaGuardada
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar piezas al proceso" });
  }
};
// cambiar el estado pieza espera a recibida 

export const cambiarEstadoPieza = async (req, res) => {
  try {
    const { id_pieza } = req.params;

    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(id_pieza)) {
      return res.status(400).json({ error: "id_pieza no es válido" });
    }

    // Cambiar estado de la pieza
    const piezaActualizada = await PiezaEstado.findByIdAndUpdate(
      id_pieza,
      { estado: 'recibida', fecha_recibida: new Date() },
      { new: true }
    );

    if (!piezaActualizada) {
      return res.status(404).json({ error: "Pieza no encontrada" });
    }

    res.status(200).json({
      message: "Estado de la pieza cambiado a 'recibida'",
      pieza: piezaActualizada
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cambiar el estado de la pieza" });
  }
};
// enviar fotos del danio
export const enviarFotosDanios = async (req, res) => {
  try {
    const { id_proceso } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id_proceso)) {
      return res.status(400).json({ error: "id_proceso no es válido" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Se deben enviar archivos de evidencia" });
    }

    const urls = [];

    // Subir todas las fotos a Cloudinary
    for (const file of req.files) {
      const { secure_url } = await cloudinary.uploader.upload(file.path, {
        folder: "safepad/evidencias",
      });
      urls.push(secure_url);
    }

    // Guardar TODAS las URLs en un solo documento
    const fotoDanio = new FotoDanio({
      id_proceso,
      foto_url: urls, // Ahora es un array de URLs
    });

    await fotoDanio.save();

    res.status(200).json({
      success: true,
      message: "Evidencias subidas correctamente",
      archivos: urls,
    });

  } catch (error) {
    console.error("❌ Error al subir fotos del dano:", error);
    res.status(500).json({ error: "Error al subir fotos del dano" });
  }
};

// agregar productos para el cashback

export const agregarProductoCashback = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    let precio_cashback = req.body.precio_cashback;

    // Convertir precio a número
    precio_cashback = Number(precio_cashback);

    // Validar campos requeridos
    if (!nombre || isNaN(precio_cashback)) {
      return res.status(400).json({ error: "Nombre y precio_cashback son requeridos y válidos" });
    }

    // Subir foto si existe
    let foto_url = "";
    if (req.file) {
      const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
        folder: "safepad/cashback",
      });
      foto_url = secure_url;
    }

    // Crear producto
    const producto = new ProductoCashback({
      nombre,
      descripcion,
      precio_cashback,
      foto_url
    });

    await producto.save();

    res.status(201).json({
      message: "Producto de cashback agregado correctamente",
      producto
    });

  } catch (error) {
    console.error("Error al agregar producto al cashback:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
};


