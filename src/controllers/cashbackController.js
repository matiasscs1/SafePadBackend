import Usuario from "../models/usuario.js";
import ProductoCashback from "../models/productoCashback.js";
import HistorialCashback from "../models/historialCashback.js";
import Cashback from "../models/cashback.js";

export const verCashbackUsuario = async (req, res) => {
  try {
    const id_usuario = req.user.id;

    // Buscar el usuario por ID
    const usuario = await Usuario.findOne({ _id: id_usuario });

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado."
      });
    }

    const cashback = usuario.renovacionSafePad;

    const totalCashback = cashback * 50;

    res.status(200).json({
      success: true,
      data: {
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        cashback: totalCashback
      }
    });
  } catch (error) {
    console.error("Error en verCashbackUsuario:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor."
    });
  }
};

export const verProductosCashback = async (req, res) => {
    try {
        const productos = await ProductoCashback.find();

        res.status(200).json({
            success: true,
            data: productos
        });
    } catch (error) {
        console.error("Error en verProductosCashback:", error);
        res.status(500).json({
            success: false,
            message: "Error del servidor."
        });
    }
};


export const reclamarCashback = async (req, res) => {
  try {
    const id_usuario = req.user.id;
    const { id_producto } = req.body;

    // Buscar usuario y producto
    const usuario = await Usuario.findById(id_usuario);
    if (!usuario) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado." });
    }

    const producto = await ProductoCashback.findById(id_producto);
    if (!producto) {
      return res.status(404).json({ success: false, message: "Producto no encontrado." });
    }
    // Actualizar saldo_actual de la entidad Cashback
    let cashback = await Cashback.findOne({ id_usuario });
    if (!cashback) {
      return res.status(404).json({
        success: false,
        message: "No se encontró el registro de cashback del usuario."
      });
    }

    // Calcular total de cashback disponible
    const cashbackDisponible = cashback.saldo_actual;
    

    if (cashbackDisponible < producto.precio_cashback) {
      return res.status(400).json({
        success: false,
        message: `No tienes suficiente cashback. Necesitas ${producto.precio_cashback}, pero tienes ${cashbackDisponible}.`
      });
    }


    cashback.saldo_actual -= producto.precio_cashback;
    if (cashback.saldo_actual < 0) cashback.saldo_actual = 0; // evitar saldo negativo
    await cashback.save();

    // Crear historial
    const historial = new HistorialCashback({
      id_usuario,
      id_producto,
      nombre_producto: producto.nombre,
      cantidad: 1,
      costo: producto.precio_cashback
    });
    await historial.save();

    res.status(200).json({
      success: true,
      message: "Cashback reclamado con éxito.",
      historial,
      saldo_actual: cashback.saldo_actual
    });

  } catch (error) {
    console.error("Error en reclamarCashback:", error);
    res.status(500).json({ success: false, message: "Error del servidor." });
  }
};

export const historialCashback = async (req, res) => {
  try {
    const id_usuario = req.user.id;

    // Buscar historial de cashback del usuario
    const historial = await HistorialCashback.find({ id_usuario });

    res.status(200).json({
      success: true,
      data: historial
    });
  } catch (error) {
    console.error("Error en historialCashback:", error);
    res.status(500).json({ success: false, message: "Error del servidor." });
  }
};
