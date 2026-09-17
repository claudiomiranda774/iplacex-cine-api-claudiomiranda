import express from 'express';
import cors from 'cors';
import { connectDB } from './src/common/db.js';
import peliculaRoutes from './src/pelicula/routes.js';
import actorRoutes from './src/actor/routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', peliculaRoutes);
app.use('/api', actorRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ message: "Bienvenido al cine Iplacex" });
});

app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error al iniciar el servidor:", error.message);
    });