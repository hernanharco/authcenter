// src/database/MongoDBConnector.ts

import mongoose from 'mongoose';

/**
 * Clase estática para manejar la conexión a MongoDB Atlas.
 * Usa un patrón Singleton para asegurar que solo haya una conexión activa.
 */
export default class MongoDBConnector {
    private static isConnected: boolean = false;

    /**
     * @returns {Promise<void>} Una promesa que se resuelve cuando la conexión es exitosa.
     */
    public static async connect(): Promise<void> {
        if (this.isConnected) {
            console.log('✅ MongoDB ya está conectado.');
            return;
        }

        // Obtener variables de entorno (asumiendo que las cargarás en tu entorno Next.js/Node)
        const username = process.env.MONGO_ATLAS_USERNAME;
        const password = process.env.MONGO_ATLAS_PASSWORD;
        const host = process.env.MONGO_ATLAS_HOST;
        const dbName = process.env.MONGO_DATABASE_NAME;

        if (!username || !password || !host || !dbName) {
            console.error('❌ Variables de entorno de MongoDB incompletas.');
            throw new Error('Variables de entorno de MongoDB faltantes.');
        }

        const uri = `mongodb+srv://${username}:${password}@${host}/${dbName}?retryWrites=true&w=majority`;

        try {
            await mongoose.connect(uri);
            this.isConnected = true;
            console.log('🎉 Conexión a MongoDB Atlas exitosa.');
        } catch (error) {
            this.isConnected = false;
            console.error('❌ Error al conectar a MongoDB Atlas:', error);
            // Salir de la aplicación si la conexión inicial falla
            process.exit(1); 
        }
    }

    /**
     * Cierra la conexión a la base de datos (útil para pruebas o cierre de servidor).
     */
    public static async disconnect(): Promise<void> {
        if (this.isConnected) {
            await mongoose.disconnect();
            this.isConnected = false;
            console.log('🔌 Conexión a MongoDB cerrada.');
        }
    }
}