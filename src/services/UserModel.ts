// src/services/UserModel.ts

import mongoose, { Schema, Document } from 'mongoose';

// 1. Define la interfaz para el documento
export interface IUser extends Document {
    username: string;
    email: string;
    passwordHash: string;
    createdAt: Date; 
    updatedAt: Date;
}

// 2. Define el esquema de Mongoose
const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },    
}, { timestamps: true }); // Agrega campos createdAt y updatedAt automáticamente

// 3. Exporta el modelo
const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default UserModel;