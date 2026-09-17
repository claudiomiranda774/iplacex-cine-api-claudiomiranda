import { ObjectId } from 'mongodb';
import { client, DB_NAME } from '../common/db.js';

const actorCollection = client.db(DB_NAME).collection('actores');
const peliculaCollection = client.db(DB_NAME).collection('peliculas');

export const handleInsertActorRequest = (req, res) => {
    const { idPelicula, nombre, edad, estaRetirado, premios } = req.body;

    if (!idPelicula || !nombre || edad === undefined || estaRetirado === undefined) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    let peliculaObjectId;
    try {
        peliculaObjectId = new ObjectId(idPelicula);
    } catch (err) {
        return res.status(400).json({ error: "idPelicula mal formado" });
    }

    peliculaCollection.findOne({ _id: peliculaObjectId })
        .then((pelicula) => {
            if (!pelicula) {
                return res.status(404).json({ error: "La película indicada no existe" });
            }

            const nuevoActor = {
                idPelicula: String(idPelicula),
                nombre,
                edad: parseInt(edad),
                estaRetirado: Boolean(estaRetirado),
                premios: Array.isArray(premios) ? premios : []
            };

            return actorCollection.insertOne(nuevoActor)
                .then((result) => {
                    res.status(201).json({ _id: result.insertedId, ...nuevoActor });
                });
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
};

export const handleGetActoresRequest = (req, res) => {
    actorCollection.find({}).toArray()
        .then((actores) => {
            res.status(200).json(actores);
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
};

export const handleGetActorByIdRequest = (req, res) => {
    const { id } = req.params;
    let objectId;

    try {
        objectId = new ObjectId(id);
    } catch (err) {
        return res.status(400).json({ error: "Id mal formado" });
    }

    actorCollection.findOne({ _id: objectId })
        .then((actor) => {
            if (!actor) {
                return res.status(404).json({ error: "Actor no encontrado" });
            }
            res.status(200).json(actor);
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
};

export const handleGetActoresByPeliculaIdRequest = (req, res) => {
    const { peliculaId } = req.params;

    actorCollection.find({ idPelicula: String(peliculaId) }).toArray()
        .then((actores) => {
            res.status(200).json(actores);
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
};

export const handleUpdateActorByIdRequest = (req, res) => {
    const { id } = req.params;
    let objectId;

    try {
        objectId = new ObjectId(id);
    } catch (err) {
        return res.status(400).json({ error: "Id mal formado" });
    }

    const updateData = {};
    if (req.body.idPelicula) updateData.idPelicula = String(req.body.idPelicula);
    if (req.body.nombre) updateData.nombre = req.body.nombre;
    if (req.body.edad !== undefined) updateData.edad = parseInt(req.body.edad);
    if (req.body.estaRetirado !== undefined) updateData.estaRetirado = Boolean(req.body.estaRetirado);
    if (req.body.premios) updateData.premios = req.body.premios;

    actorCollection.updateOne({ _id: objectId }, { $set: updateData })
        .then((result) => {
            if (result.matchedCount === 0) {
                return res.status(404).json({ error: "Actor no encontrado" });
            }
            res.status(200).json({ message: "Actor actualizado correctamente", modifiedCount: result.modifiedCount });
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
};

export const handleDeleteActorByIdRequest = (req, res) => {
    const { id } = req.params;
    let objectId;

    try {
        objectId = new ObjectId(id);
    } catch (err) {
        return res.status(400).json({ error: "Id mal formado" });
    }

    actorCollection.deleteOne({ _id: objectId })
        .then((result) => {
            if (result.deletedCount === 0) {
                return res.status(404).json({ error: "Actor no encontrado" });
            }
            res.status(200).json({ message: "Actor eliminado correctamente" });
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
};