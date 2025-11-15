// src/app/api/auth/status/route.ts

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken'; // Asegúrate de instalar esta librería: npm install jsonwebtoken

// ⚠️ Asegúrate de que esta clave secreta sea la misma que usaste para firmar el token en el login.
// Debe ser almacenada de forma segura en tus variables de entorno (.env)
const JWT_SECRET = process.env.JWT_SECRET || 'mi_clave_secreta_fallback_insegura';

// Definimos la función para manejar la petición GET
export async function GET(request: NextRequest) {
    
    // 1. Obtener el Token del Encabezado
    const authHeader = request.headers.get('Authorization');

    // Si no hay encabezado o no comienza con 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // Retorna 401: No autorizado si no hay token
        return NextResponse.json(
            { message: "Token no proporcionado o malformado.", isAuthenticated: false }, 
            { status: 401 }
        );
    }

    // Extrae la parte del token después de 'Bearer '
    const token = authHeader.split(' ')[1];

    try {
        // 2. 🔑 Verificar y Decodificar el Token
        // jwt.verify() revisa la firma y la fecha de expiración.
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

        // 3. Respuesta Exitosa
        // Si la verificación es exitosa, el token es válido y está activo.
        return NextResponse.json(
            { 
                message: "Token válido.", 
                isAuthenticated: true, 
                userId: decoded.userId 
            }, 
            { status: 200 }
        );

    } catch (error) {
        // 4. Manejo de Errores (Token Inválido o Expirado)
        console.error("Error al verificar JWT:", error);
        
        // Retorna 401 para que el frontend (fetchAuthStatus) sepa que debe limpiar la cookie.
        return NextResponse.json(
            { 
                message: "Token inválido o expirado. Inicie sesión de nuevo.", 
                isAuthenticated: false 
            }, 
            { status: 401 }
        );
    }
}