// src/app/api/auth/route.ts (asumiendo que estás usando Next.js App Router)

import MongoDBConnector from '@/database/MongoDBConnector'; 
import UserService from '@/services/UserService';
import { NextResponse } from 'next/server';

/**
 * Función de utilidad para manejar la conexión a la base de datos.
 */
async function connectToDatabase() {
    try {
        await MongoDBConnector.connect();
    } catch (e) {
        // La conexión falló, devuelve un error 503 Service Unavailable
        return NextResponse.json(
            { error: 'Error de conexión con la base de datos' },
            { status: 503 }
        );
    }
}

// ----------------------------------------------------
// MANEJADORES HTTP
// ----------------------------------------------------

/**
 * [GET] Obtener todos los usuarios.
 * Ruta: /api/auth
 */
export async function GET() {
    // 1. Conexión a la DB
    const dbConnectionError = await connectToDatabase();
    if (dbConnectionError) return dbConnectionError;

    try {
        const users = await UserService.findAllUsers();
        
        if (users.length === 0) {
            return NextResponse.json(
                { message: 'No hay usuarios registrados.' }, 
                { status: 200 }
            );
        }

        // Devolvemos la lista de usuarios (solo datos públicos)
        const safeUsers = users.map(user => ({
            id: user._id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }));

        return NextResponse.json({ data: safeUsers }, { status: 200 });

    } catch (error) {
        console.error('Error al obtener todos los usuarios:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor al obtener usuarios.' },
            { status: 500 }
        );
    }
}


/**
 * [POST] Crear un nuevo usuario (Registro).
 * Ruta: /api/auth
 */
export async function POST(request: Request) {
    // 1. Conexión a la DB
    const dbConnectionError = await connectToDatabase();
    if (dbConnectionError) return dbConnectionError;

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
    
    // 📢 VERIFICACIÓN DE DATOS (PARA CONSOLE.LOG)
    console.log('Datos de Registro recibidos en el Backend:', data);

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
        const passwordHash = `HASH_${password}_PLACEHOLDER`; 

        const newUser = await UserService.createUser(username, email, passwordHash);

        // 4. Respuesta Exitosa
        return NextResponse.json(
            { 
                message: 'Usuario registrado con éxito', 
                user: {
                    id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                    createdAt: newUser.createdAt,
                    updatedAt: newUser.updatedAt,
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


/**
 * [PUT/PATCH] Actualizar completamente/parcialmente un usuario.
 * Ruta: /api/auth?id={userId}
 */
export async function PUT(request: Request) {
    // 1. Conexión a la DB
    const dbConnectionError = await connectToDatabase();
    if (dbConnectionError) return dbConnectionError;

    // 2. Obtener ID de la URL
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
        return NextResponse.json(
            { error: 'Falta el parámetro de consulta "id" para actualizar.' },
            { status: 400 }
        );
    }

    // 3. Obtener datos y actualizar (simplificado: solo actualizamos el username)
    let updateData;
    try {
        updateData = await request.json();
    } catch (e) {
        return NextResponse.json(
            { error: 'Formato de JSON inválido' },
            { status: 400 }
        );
    }

    // En un caso real, la lógica de actualización iría a UserService
    try {
        const updatedUser = await UserService.updateUser(userId, updateData);

        if (!updatedUser) {
            return NextResponse.json(
                { error: 'Usuario no encontrado.' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Usuario actualizado con éxito', user: { id: updatedUser._id, username: updatedUser.username } },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor al actualizar el usuario.' },
            { status: 500 }
        );
    }
}
// NOTA: Para PATCH, generalmente se usa el mismo cuerpo de lógica que PUT para actualizar parcialmente. 
// Por simplicidad, omitiremos la función PATCH aquí y asumiremos que PUT maneja la lógica de "reemplazar".


/**
 * [DELETE] Eliminar un usuario.
 * Ruta: /api/auth?id={userId}
 */
export async function DELETE(request: Request) {
    // 1. Conexión a la DB
    const dbConnectionError = await connectToDatabase();
    if (dbConnectionError) return dbConnectionError;

    // 2. Obtener ID de la URL
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
        return NextResponse.json(
            { error: 'Falta el parámetro de consulta "id" para eliminar.' },
            { status: 400 }
        );
    }

    // 3. Lógica de Eliminación (Llamada al Service)
    try {
        const result = await UserService.deleteUser(userId);

        if (!result) {
            return NextResponse.json(
                { error: 'Usuario no encontrado para eliminar.' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Usuario eliminado con éxito', id: userId },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor al eliminar el usuario.' },
            { status: 500 }
        );
    }
}