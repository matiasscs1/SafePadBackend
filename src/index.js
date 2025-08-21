import app from './app.js';
import { connectDB } from './db.js';

import 'dotenv/config';

// Conectar a la base de datos
connectDB();



const port = process.env.PORT || 4003;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});