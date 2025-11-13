// src/services/UserService.ts

import UserModel, { IUser } from './UserModel';
import { UpdateQuery } from 'mongoose'; 

/**
 * Clase responsable de la lógica de negocio relacionada con la gestión de Usuarios.
 * Contiene métodos estáticos para interactuar con el modelo de Usuario.
 */
export default class UserService {

    /**
     * Crea un nuevo usuario en la base de datos.
     * @param username Nombre de usuario.
     * @param email Correo electrónico.
     * @param passwordHash Contraseña ya hasheada.
     * @returns El nuevo documento de usuario creado (Promesa de IUser).
     */
    public static async createUser(username: string, email: string, passwordHash: string): Promise<IUser> {
        // En una aplicación real, se realizaría validación adicional, hasheo de contraseña, etc.
        const newUser = new UserModel({
            username,
            email,
            passwordHash,
        });

        const savedUser = await newUser.save();
        return savedUser;
    }

    /**
     * Busca un usuario por su ID de MongoDB.
     * @param id El ID del documento de MongoDB.
     * @returns El documento de usuario, o null si no se encuentra.
     */
    public static async findUserById(id: string): Promise<IUser | null> {
        return UserModel.findById(id).exec();
    }

    /**
     * Busca un usuario por su dirección de correo electrónico.
     * @param email La dirección de correo electrónico a buscar.
     * @returns El documento de usuario, o null si no se encuentra.
     */
    public static async findUserByEmail(email: string): Promise<IUser | null> {
        return UserModel.findOne({ email }).exec();
    }

    /**
     * Retorna una lista de todos los usuarios.
     * @returns Un array de documentos de usuario.
     */
    public static async findAllUsers(): Promise<IUser[]> {
        // En producción, limitarías y paginarías esta lista.
        return UserModel.find({}).exec();
    }

    /**
     * Actualiza un usuario existente por su ID.
     * @param id El ID del documento de MongoDB.
     * @param updateData Los campos a actualizar (parcial o totalmente).
     * @returns El documento de usuario actualizado, o null si no se encuentra.
     */
    public static async updateUser(id: string, updateData: UpdateQuery<IUser>): Promise<IUser | null> {
        return UserModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true } // {new: true} retorna el documento actualizado
        ).exec();
    }

    /**
     * Elimina un usuario por su ID.
     * @param id El ID del documento de MongoDB a eliminar.
     * @returns True si se eliminó, False si no se encontró.
     */
    public static async deleteUser(id: string): Promise<boolean> {
        const result = await UserModel.findByIdAndDelete(id).exec();
        // Mongoose findByIdAndDelete retorna el documento eliminado o null si no lo encuentra.
        return !!result; 
    }
}