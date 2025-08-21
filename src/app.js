import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import Routes from './routes/routes.js';
import cookieParser from 'cookie-parser';

const app = express();

// Configurar CORS
app.use(cors());

// Middlewares existentes
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser()); 
app.use(express.urlencoded({ extended: true })); 


// Ruta raíz simple
app.get('/', (req, res) => {
  res.json({
    message: 'Microservicio de Actividades API funcionando',
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

// Rutas de la API
app.use(Routes);

export default app;