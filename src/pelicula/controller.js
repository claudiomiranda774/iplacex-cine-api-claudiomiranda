import { ObjectId } from 'mongodb';
import { client, DB_NAME } from '../common/db.js';

const peliculaCollection = client.db(DB_NAME).collection('peliculas');

export const handleInsertPeliculaRequest = (req, res) => {
    const { nombre, generos, anioEstreno } = req.body;

    if (!nombre || !generos || !anioEstreno) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const nuevaPelicula = {
        nombre,
        generos: Array.isArray(generos) ? generos : [generos],
        anioEstreno: parseInt(anioEstreno)
    };

    peliculaCollection.insertOne(nuevaPelicula)
        .then((result) => {
            res.status(201).json({ _id: result.insertedId, ...nuevaPelicula });
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
};

export const handleGetPeliculasRequest = (req, res) => {
    peliculaCollection.find({}).toArray()
        .then((peliculas) => {
            res.status(200).json(peliculas);
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
};

export const handleGetPeliculaByIdRequest = (req, res) => {
    const { id } = req.params;
    let objectId;

    try {
        objectId = new ObjectId(id);
    } catch (err) {
        return res.status(400).json({ error: "Id mal formado" });
    }

    peliculaCollection.findOne({ _id: objectId })
        .then((pelicula) => {
            if (!pelicula) {
                return res.status(404).json({ error: "Película no encontrada" });
            }
            res.status(200).json(pelicula);
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
};

export const handleUpdatePeliculaByIdRequest = (req, res) => {
    const { id } = req.params;
    let objectId;

    try {
        objectId = new ObjectId(id);
    } catch (err) {
        return res.status(400).json({ error: "Id mal formado" });
    }

    const updateData = {};
    if (req.body.nombre) updateData.nombre = req.body.nombre;
    if (req.body.generos) updateData.generos = req.body.generos;
    if (req.body.anioEstreno) updateData.anioEstreno = parseInt(req.body.anioEstreno);

    peliculaCollection.updateOne({ _id: objectId }, { $set: updateData })
        .then((result) => {
            if (result.matchedCount === 0) {
                return res.status(404).json({ error: "Película no encontrada" });
            }
            res.status(200).json({ message: "Película actualizada correctamente", modifiedCount: result.modifiedCount });
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
};

export const handleDeletePeliculaByIdRequest = (req, res) => {
    const { id } = req.params;
    let objectId;

    try {
        objectId = new ObjectId(id);
    } catch (err) {
        return res.status(400).json({ error: "Id mal formado" });
    }

    peliculaCollection.deleteOne({ _id: objectId })
        .then((result) => {
            if (result.deletedCount === 0) {
                return res.status(404).json({ error: "Película no encontrada" });
            }
            res.status(200).json({ message: "Película eliminada correctamente" });
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
};