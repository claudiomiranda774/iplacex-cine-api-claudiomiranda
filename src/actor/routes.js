import express from 'express';
import {
    handleInsertActorRequest,
    handleGetActoresRequest,
    handleGetActorByIdRequest,
    handleGetActoresByPeliculaIdRequest,
    handleUpdateActorByIdRequest,
    handleDeleteActorByIdRequest
} from './controller.js';

const actorRoutes = express.Router();

actorRoutes.post('/actor', handleInsertActorRequest);
actorRoutes.get('/actores', handleGetActoresRequest);
actorRoutes.get('/actor/:id', handleGetActorByIdRequest);
actorRoutes.get('/actor/pelicula/:peliculaId', handleGetActoresByPeliculaIdRequest);
actorRoutes.put('/actor/:id', handleUpdateActorByIdRequest);
actorRoutes.delete('/actor/:id', handleDeleteActorByIdRequest);

export default actorRoutes;