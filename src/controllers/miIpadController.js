import Ipad from '../models/ipad.js';
import Garantia from '../models/garantia.js';
import ProcesoReparacion from '../models/procesoReparacion.js';
import TecnicoAsignado from "../models/tecnicoAsignado.js";
import Usuario from '../models/usuario.js';
import Cashback from '../models/cashback.js';
import mongoose from 'mongoose';


export const mostrarIpadUsuario = async (req, res) => {
  try {
    const id_usuario = req.user.id;

    // Buscar iPads del usuario
    const ipads = await Ipad.find({ id_usuario });

    if (!ipads || ipads.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron iPads para este usuario"
      });
    }

    res.status(200).json({
      success: true,
      data: ipads
    });
  } catch (error) {
    console.error("Error en mostrarIpadUsuario:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor."
    });
  }
};

export const renovarGarantiaSafePad = async (req, res) => {
  try {
    const { id_garantia } = req.params;
    const { fecha_inicio, fecha_vencimiento } = req.body;
    const id_usuario = req.user.id;

    // Validar que la nueva fecha de expiración sea válida
    if (!fecha_inicio || !fecha_vencimiento) {
      return res.status(400).json({
        success: false,
        message: "La nueva fecha de expiración es requerida."
      });
    }

    // Buscar usuario y garantía
    const usuario = await Usuario.findById(id_usuario);
    const garantia = await Garantia.findById(id_garantia);

    if (!usuario || !garantia) {
      return res.status(404).json({
        success: false,
        message: "Usuario o garantía no encontrados."
      });
    }

    // Actualizar fechas y contador de renovaciones
    garantia.fecha_inicio = fecha_inicio;
    garantia.fecha_vencimiento = fecha_vencimiento;
    usuario.renovacionSafePad += 1;

    await garantia.save();
    await usuario.save();

    // Actualizar o crear registro de cashback
    let cashback = await Cashback.findOne({ id_usuario });

    if (!cashback) {
      cashback = new Cashback({
        id_usuario,
        saldo_actual: 100
      });
    } else {
      cashback.saldo_actual += 100;
    }

    await cashback.save();

    res.status(200).json({
      success: true,
      garantia,
      cashback
    });

  } catch (error) {
    console.error("Error en renovarGarantiaSafePad:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor."
    });
  }
};

export const verEstadosReparacionIpad = async (req, res) => {
  try {
    const id_usuario = req.user.id;

    // Buscar todos los procesos de reparación del usuario
    const procesos = await ProcesoReparacion.find({ id_usuario }).populate("id_ipad");

    if (!procesos || procesos.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron procesos de reparación para este usuario"
      });
    }

    res.status(200).json({
      success: true,
      data: procesos
    });
  } catch (error) {
    console.error("Error en verEstadosReparacionIpad:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor."
    });
  }
};

export const verTecnicoPorProceso = async (req, res) => {
  try {
    const { id_proceso } = req.params;

    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(id_proceso)) {
      return res.status(400).json({ error: "id_proceso no es válido" });
    }

    // Buscar el proceso
    const proceso = await ProcesoReparacion.findById(id_proceso)
      .populate("id_ipad", "serial_ipad modelo")
      .populate("id_usuario", "nombre apellido correo");


    if (!proceso) {
      return res.status(404).json({ error: "Proceso no encontrado" });
    }

    // Convertir id_proceso a ObjectId para la búsqueda exacta
    const idProcesoObject = new mongoose.Types.ObjectId(id_proceso);


    // Buscar técnicos asignados a ese proceso
    const tecnicos = await TecnicoAsignado.find({
      procesos_asignados: idProcesoObject
    }).populate("id_usuario", "nombre apellido correo");

    console.log("Técnicos asignados encontrados:", tecnicos);

    res.status(200).json({
      success: true,
      tecnicos_asignados: tecnicos
    });

  } catch (error) {
    console.error("Error en verTecnicoPorProceso:", error);
    res.status(500).json({ success: false, message: "Error del servidor." });
  }
};
