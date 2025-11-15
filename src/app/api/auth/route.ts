import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
// ⚠️ Usando tus imports:
import MongoDBConnector from '@/database/MongoDBConnector'; 
import UserService from '@/services/UserService';
import { UserDocument } from '@/features/login/models/User'

// Clave secreta para firmar el JWT. Debe ser la misma en 'status/route.ts'
const JWT_SECRET = process.env.JWT_SECRET || 'mi_clave_secreta_fallback_insegura'; 

/**
 * Función de utilidad para manejar la conexión a la base de datos.
 */
async function connectToDatabase() {
    try {
        await MongoDBConnector.connect();
        return null; // Conexión exitosa
    } catch (e) {
        // La conexión falló, devuelve un error 503 Service Unavailable
        return NextResponse.json(
            { error: 'Error de conexión con la base de datos' },
            { status: 503 }
        );
    }
}

/**
 * [POST] Maneja el inicio de sesión y la generación del JWT.
 * Ruta: /api/auth/login
 */
export async function POST(request: NextRequest) {
    // 1. Conexión a la DB
    const dbConnectionError = await connectToDatabase();
    if (dbConnectionError) return dbConnectionError;

    let email: string, password: string;
    try {
        const data = await request.json();
        email = data.email;
        password = data.password;
    } catch (e) {
        return NextResponse.json(
            { error: 'Formato de JSON inválido' },
            { status: 400 }
        );
    }

    if (!email || !password) {
        return NextResponse.json(
            { message: "Credenciales incompletas (email o password)." },
            { status: 400 }
        );
    }

    try {
        // 2. 🔎 Buscar el Usuario (necesita obtener el hash de la contraseña)
        // Asumo que UserService.findUserByEmail acepta una opción para incluir la password
        const user = await UserService.findUserByEmail(email, { includePassword: true }) as UserDocument; 

        if (!user || !user.password) {
            throw new Error("Credenciales inválidas."); 
        }

        // 3. 🔑 Comparar la Contraseña Haseada con el texto plano ingresado
        const isMatch = await bcrypt.compare(password, user.password); 

        if (!isMatch) {
            throw new Error("Credenciales inválidas.");
        }

        // 4. 🪙 Generar el JWT
        const token = jwt.sign(
            { userId: user._id.toString() }, // Payload: el ID del usuario
            JWT_SECRET,
            { expiresIn: '7d' } // El token expira en 7 días
        );

        // 5. 200 OK: Respuesta Exitosa
        return NextResponse.json(
            {
                message: "Inicio de sesión exitoso.",
                token,
                userId: user._id.toString(),
            },
            { status: 200 }
        );

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error interno del servidor.";
        console.error("Fallo de login:", error);

        // Retorna 401 para cualquier fallo de autenticación o credenciales
        return NextResponse.json(
            { 
                message: errorMessage.includes("Credenciales") ? errorMessage : "Credenciales inválidas." 
            },
            { status: 401 }
        );
    }
}