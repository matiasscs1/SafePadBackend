
import express, { Router } from 'express';
import { upload } from "../cloudinary.js"; 
import { 
  registrarUsuario,
  loginUsuario,
  loginAdmin,
  cambiarContrasena,
  eliminarUsuario,
  ingresarSerial
} from '../controllers/loginController.js';
import {
  obtenerIpadsPorUsuario,
  obtenerGarantiasPorUsuario,
  obtenerIpadPorId
} from '../controllers/inicioController.js';
import {
  renovarGarantiaSafePad,
  verEstadosReparacionIpad,
  verTecnicoPorProceso,
  mostrarIpadUsuario

} from '../controllers/miIpadController.js';

import {
  mostrarPiezasProceso,
  mostrarFotosDanio
} from '../controllers/reparacionController.js';
import {
  verCashbackUsuario,
  verProductosCashback,
  reclamarCashback,
  historialCashback

} from '../controllers/cashbackController.js';
import{
  RegistrarIpad,
  RegistrarGarantia,
  crearProceso,
  obtenerTodosLosIpads,
  modificarPaso,
  crearTecnico,
  agregarEtapasProceso,
  mostrarTecnicos,
  agregarTecnicoProceso,
  mostrarProcesosAdmin,
  agregarPiezasReparacion,
  cambiarEstadoPieza,
  enviarFotosDanios,
  agregarProductoCashback

} from '../controllers/administradorController.js';
import { authRequired } from '../middlewares/validateToken.js';
const router = express.Router();
router.get("/ping", (req, res) => {
  res.status(200).send("pong");
});
// administrador
router.post('/registrar-ipad', authRequired, RegistrarIpad);
router.post('/registrar-garantia', authRequired, RegistrarGarantia);
router.post('/crear-proceso', authRequired, crearProceso);
router.get('/obtener-ipads', authRequired, obtenerTodosLosIpads);
router.put('/modificar-paso', authRequired, modificarPaso);
router.post('/crear-tecnico', authRequired, crearTecnico);
router.put('/agregar-etapas-proceso', authRequired, agregarEtapasProceso);
router.get('/mostrar-tecnicos', authRequired, mostrarTecnicos);
router.post('/agregar-tecnico-proceso', authRequired, agregarTecnicoProceso);
router.get('/mostrar-procesos', authRequired, mostrarProcesosAdmin);
router.post('/agregar-pieza-reparacion', authRequired, agregarPiezasReparacion);
router.put('/cambiar-estado-pieza/:id_pieza', authRequired, cambiarEstadoPieza);
router.post(
  "/procesos/fotos/:id_proceso",
  upload.array("fotos", 5), 
  enviarFotosDanios
);
router.post('/agregar-producto-cashback',upload.single("fotos"), authRequired, agregarProductoCashback);
// Login
router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario);
router.post('/login/admin', loginAdmin);
router.put('/cambiar-contrasena', cambiarContrasena);
router.delete('/usuario/:id', authRequired, eliminarUsuario);
router.put('/ipad/asignar', authRequired, ingresarSerial);

//Inicio
router.get('/ipad/usuario', authRequired, obtenerIpadsPorUsuario);
router.get('/garantia/usuario/:id_ipad', authRequired, obtenerGarantiasPorUsuario);
router.get('/ipad/usuario/:id_ipad', authRequired, obtenerIpadPorId);

// Mi Ipad
router.put('/garantia/renovar/:id_garantia', authRequired, renovarGarantiaSafePad);
router.get('/reparacion/estados', authRequired, verEstadosReparacionIpad);
router.get('/reparacion/tecnico/:id_proceso', authRequired, verTecnicoPorProceso);
router.get('/ipad/usuario', authRequired, mostrarIpadUsuario);

// Reparación
router.get('/reparacion/piezas/:id_ipad', authRequired, mostrarPiezasProceso);
router.get('/reparacion/fotos/:id_proceso', authRequired, mostrarFotosDanio);

// cashback
router.get('/cashback/usuario', authRequired, verCashbackUsuario);
router.get('/cashback/productos', authRequired, verProductosCashback);
router.post('/cashback/reclamar', authRequired, reclamarCashback);
router.get('/cashback/historial', authRequired, historialCashback);

export default router;
