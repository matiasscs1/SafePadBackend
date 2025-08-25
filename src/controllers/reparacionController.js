import mongoose from "mongoose";
import PiezaEstado from "../models/piezaEstado.js";
import { v2 as cloudinary } from "cloudinary";
import FotoDanio from "../models/fotoDanio.js";

export const mostrarPiezasProceso = async (req, res) => {
  try {
    const { id_ipad } = req.params;

    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(id_ipad)) {
      return res.status(400).json({ error: "id_ipad no es válido" });
    }

    // Buscar todas las piezas asociadas a ese iPad
    const piezas = await PiezaEstado.find({ id_ipad: new mongoose.Types.ObjectId(id_ipad) });

    if (!piezas || piezas.length === 0) {
      return res.status(404).json({ error: "No se encontraron piezas para este iPad" });
    }

    res.status(200).json({
      success: true,
      piezas
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al mostrar las piezas del proceso" });
  }
};

// mostrar fotos del danio

export const mostrarFotosDanio = async (req, res) => {
  try {
    const { id_proceso } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id_proceso)) {
      return res.status(400).json({ error: "id_proceso no es válido" });
    }

    const fotos = await FotoDanio.find({ id_proceso });

    if (!fotos || fotos.length === 0) {
      return res.status(404).json({ error: "No se encontraron fotos para este proceso" });
    }

    res.status(200).json({
      success: true,
      fotos
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al mostrar las fotos del daño" });
  }
};

