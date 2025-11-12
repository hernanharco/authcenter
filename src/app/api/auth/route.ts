// src/app/api/auth/route.ts 

import MongoDBConnector from '@/database/MongoDBConnector'; 
import UserService from '@/services/UserService';
import { NextResponse } from 'next/server';

/**
 * Maneja las solicitudes POST para crear un nuevo usuario (Registro).
 */
export async function POST(request: Request) {
    // 1. Conexión a la DB
    try {
        await MongoDBConnector.connect();
    } catch (e) {
        // La conexión falló, devuelve un error 503 Service Unavailable
        return NextResponse.json(
            { error: 'Error de conexión con la base de datos' },
            { status: 503 }
        );
    }

    // 2. Obtener y validar datos de la solicitud
    let data;
    try {
        data = await request.json();
    } catch (e) {
        return NextResponse.json(
            { error: 'Formato de JSON inválido' },
            { status: 400 }
        );
    }
    
    const { username, email, password } = data;

    if (!username || !email || !password) {
        return NextResponse.json(
            { error: 'Faltan campos requeridos (username, email, password).' },
            { status: 400 }
        );
    }

    // 3. Lógica de Negocio (Llamada al Service)
    try {
        // NOTA: En la vida real, hashearías la contraseña aquí (e.g., con bcrypt)
        // Por ahora, solo usamos la contraseña sin hashear como un placeholder.
        const newUser = await UserService.createUser(username, email, `HASH_${password}_PLACEHOLDER`);

        // 4. Respuesta Exitosa
        return NextResponse.json(
            { 
                message: 'Usuario registrado con éxito', 
                user: {
                    id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                    createdAt: newUser.createdAt,
                }
            },
            { status: 201 } // 201 Created
        );
    } catch (error: any) {
        // Manejo de errores específicos (ej. duplicado)
        if (error.code === 11000) { // Código de error de duplicado en MongoDB
            return NextResponse.json(
                { error: 'El usuario o email ya están registrados.' },
                { status: 409 } // 409 Conflict
            );
        }
        
        console.error('Error al crear usuario:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor al crear el usuario.' },
            { status: 500 }
        );
    }
}