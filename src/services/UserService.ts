// src/services/UserService.ts

import UserModel, { IUser } from './UserModel';

/**
 * Clase responsable de la lógica de negocio relacionada con la gestión de Usuarios.
 */
export default class UserService {

    /**
     * Crea un nuevo usuario en la base de datos.
     * @param userData Los datos del usuario (simulando que el password ya está hasheado).
     * @returns {Promise<IUser>} El nuevo documento de usuario creado.
     */
    public static async createUser(username: string, email: string, passwordHash: string): Promise<IUser> {
        // En una aplicación real, harías validación, hasheo de contraseña, etc., aquí.

        const newUser = new UserModel({
            username,
            email,
            passwordHash,
        });

        const savedUser = await newUser.save();
        return savedUser;
    }

    // Aquí irían otros métodos como findUserByEmail, updateUser, etc.
}