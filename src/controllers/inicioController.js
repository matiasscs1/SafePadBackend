import Ipad from '../models/ipad.js';
import Garantia from '../models/garantia.js';

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

export const obtenerGarantiasPorUsuario = async (req, res) => {
  try {
    const id_usuario = req.user.id; // viene del token

    // 1. Buscar todos los iPads que pertenecen al usuario
    const ipadsDelUsuario = await Ipad.find({ id_usuario }).select('_id');

    const ipadIds = ipadsDelUsuario.map(ipad => ipad._id);

    if (ipadIds.length === 0) {
      return res.status(404).json({
        success: false,
        message: "El usuario no tiene iPads asignados"
      });
    }

    // 2. Buscar garantías que correspondan a esos iPads
    const garantias = await Garantia.find({ id_ipad: { $in: ipadIds } });

    if (!garantias || garantias.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron garantías para este usuario"
      });
    }

    res.status(200).json({
      success: true,
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

