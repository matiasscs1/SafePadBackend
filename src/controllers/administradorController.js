import Ipad from "../models/ipad.js"; 
import Garantia from "../models/garantia.js";


export const RegistrarIpad = async (req, res) => {
    try {
        const { serial_ipad, modelo, fecha_compra } = req.body;

        // Validar campos requeridos
        if (!serial_ipad || !modelo || !fecha_compra) {
            return res.status(400).json({
                success: false,
                message: "Todos los campos son requeridos"
            });
        }

        // Verificar si el iPad ya existe
        const ipadExistente = await Ipad.findOne({ serial_ipad });
        if (ipadExistente) {
            return res.status(400).json({
                success: false,
                message: "El iPad ya está registrado"
            });
        }

        // Registrar nuevo iPad
        const nuevoIpad = await Ipad.create({
            serial_ipad,
            modelo,
            fecha_compra
        });

        res.status(201).json({
            success: true,
            message: "iPad registrado correctamente",
            data: nuevoIpad
        });
    } catch (error) {
        console.error("Error en RegistrarIpad:", error);
        res.status(500).json({
            success: false,
            message: "Error del servidor."
        });
    }
};

export const RegistrarGarantia = async (req, res) => {
    try {
        const { id_ipad, tipo_garantia, fecha_vencimiento } = req.body;

        // Validar campos requeridos
        if (!id_ipad || !tipo_garantia || !fecha_vencimiento) {
            return res.status(400).json({
                success: false,
                message: "Todos los campos son requeridos"
            });
        }

        // Verificar si el iPad existe
        const ipadExistente = await Ipad.findById(id_ipad);
        if (!ipadExistente) {
            return res.status(404).json({
                success: false,
                message: "iPad no encontrado"
            });
        }

        // Registrar nueva garantía
        const nuevaGarantia = await Garantia.create({
            id_ipad,
            tipo_garantia,
            fecha_vencimiento
        });

        res.status(201).json({
            success: true,
            message: "Garantía registrada correctamente",
            data: nuevaGarantia
        });
    } catch (error) {
        console.error("Error en RegistrarGarantia:", error);
        res.status(500).json({
            success: false,
            message: "Error del servidor."
        });
    }
};