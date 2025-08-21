
import express from 'express';
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
  obtenerGarantiasPorUsuario
} from '../controllers/inicioController.js';
import{
  RegistrarIpad,
  RegistrarGarantia
} from '../controllers/administradorController.js';
import { authRequired } from '../middlewares/validateToken.js';
const router = express.Router();
router.get("/ping", (req, res) => {
  res.status(200).send("pong");
});
// administrador
router.post('/registrar-ipad', authRequired, RegistrarIpad);
router.post('/registrar-garantia', authRequired, RegistrarGarantia);

// Login
router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario);
router.post('/login/admin', loginAdmin);
router.put('/cambiar-contrasena', cambiarContrasena);
router.delete('/usuario/:id', authRequired, eliminarUsuario);
router.put('/ipad/asignar', authRequired, ingresarSerial);

//Inicio
router.get('/ipad/usuario', authRequired, obtenerIpadsPorUsuario);
router.get('/garantia/usuario', authRequired, obtenerGarantiasPorUsuario);

export default router;
