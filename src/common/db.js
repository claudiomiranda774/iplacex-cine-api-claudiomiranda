import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://claudiomiranda774_db_user:UO4WVEtBAnxLapZM@eva-u3-express.z57mtmw.mongodb.net/?appName=eva-u3-express";

export const DB_NAME = "cine-db";
export const client = new MongoClient(MONGO_URI);

export const connectDB = () => {
    return client.connect()
        .then(() => {
            console.log("Conexión exitosa al clúster MongoDB Atlas (eva-u3-express)");
            return client.db(DB_NAME);
        })
        .catch((error) => {
            console.error("Error al conectar a MongoDB Atlas:", error.message);
            throw error;
        });
};