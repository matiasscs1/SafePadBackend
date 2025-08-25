import Ipad from '../models/ipad.js';
import Garantia from '../models/garantia.js';
import mongoose from 'mongoose';

export const obtenerIpadsPorUsuario = async (req, res) => {
  try {
    const id_usuario = req.user.id;

    // Buscar todos los iPads del usuario
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
    console.error("Error en obtenerIpadsPorUsuario:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor."
    });
  }
};

export const obtenerIpadPorId = async (req, res) => {
  try {
    const id_usuario = req.user.id;
    const { id_ipad } = req.params;

    // Validar id_ipad
    if (!mongoose.Types.ObjectId.isValid(id_ipad)) {
      return res.status(400).json({
        success: false,
        message: "id_ipad no es válido"
      });
    }

    // Buscar el iPad por ID y verificar que pertenezca al usuario
    const ipad = await Ipad.findOne({ _id: id_ipad, id_usuario });
    if (!ipad) {
      return res.status(404).json({
        success: false,
        message: "El iPad no pertenece a este usuario o no existe"
      });
    }

    res.status(200).json({
      success: true,
      data: ipad
    });
  } catch (error) {
    console.error("Error en obtenerIpadPorId:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor."
    });
  }
};

export const obtenerGarantiasPorUsuario = async (req, res) => {
  try {
    const id_usuario = req.user.id; // viene del token
    const { id_ipad } = req.params; // recibimos el id del iPad por params

    // Validar id_ipad
    if (!mongoose.Types.ObjectId.isValid(id_ipad)) {
      return res.status(400).json({
        success: false,
        message: "id_ipad no es válido"
      });
    }

    // Verificar que el iPad pertenezca al usuario
    const ipad = await Ipad.findOne({ _id: id_ipad, id_usuario });
    if (!ipad) {
      return res.status(404).json({
        success: false,
        message: "El iPad no pertenece a este usuario o no existe"
      });
    }

    // Buscar garantías que coincidan con id_ipad y pertenecientes al usuario
    // Como ya validamos que el iPad es del usuario, basta filtrar por id_ipad
    const garantias = await Garantia.find({ id_ipad });

    if (!garantias || garantias.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron garantías para este iPad y usuario"
      });
    }

    res.status(200).json({
      success: true,
      id_usuario,
      id_ipad,
      data: garantias
    });
  } catch (error) {
    console.error("Error en obtenerGarantiasPorUsuario:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor."
    });
  }
};



