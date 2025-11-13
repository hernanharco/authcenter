// src/services/SignupService.ts

// Define tu URL base para la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 1. Define la interfaz para los datos que se enviarán (payload)
interface SignupCredentials {
  username: string;
  email: string;
  password: string;
}

// 2. Define la interfaz para la respuesta esperada (ejemplo)
interface SignupResponse {
  message: string;
  userId: string;
  token?: string; // El token de sesión/JWT es común
}

/** POST **
 * Realiza una petición POST al endpoint de registro (/api/signup).
 * @param credentials - Objeto con el nombre, email y contraseña del usuario.
 * @returns Los datos de respuesta de la API (ej: mensaje, userId).
 */
export async function registerUser(
  credentials: SignupCredentials
): Promise<SignupResponse> {
  const url = `${API_BASE_URL}/api/auth`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Convertimos los datos de registro a una cadena JSON
      body: JSON.stringify(credentials),

      // Indicamos que esta no es una petición de Server Component que deba ser cacheada
      cache: "no-store",
    });

    // Verificamos si la respuesta fue exitosa (código 200-299)
    if (!res.ok) {
      // Intentamos obtener el mensaje de error del cuerpo de la respuesta
      const errorDetail = await res.json().catch(() => ({}));

      // Lanzamos un error con la información específica del fallo
      throw new Error(
        errorDetail.message || `Fallo en el registro con estado: ${res.status}`
      );
    }

    // Devolvemos la respuesta parseada
    return res.json() as Promise<SignupResponse>;
  } catch (error) {
    // Registramos el error de bajo nivel (red o excepción no HTTP)
    console.error("Error en registerUser:", error);

    // Relanzamos un error más amigable para la interfaz de usuario
    if (error instanceof Error) {
      throw new Error(`Error al conectar con el servidor: ${error.message}`);
    }
    throw new Error("Ha ocurrido un error inesperado durante el registro.");
  }
}

// ** GET ** Reutilizamos la interfaz User que ya tienes en tus definiciones
import type { User } from "@/features/signup/lib/definitions";

/**
 * Realiza una petición GET al endpoint para obtener la lista de usuarios.
 * @returns Una promesa que resuelve con un array de objetos User.
 */
export async function fetchUsers(): Promise<User[]> {
  const url = `${API_BASE_URL}/api/auth`; // **Ajusta este endpoint si es diferente**

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Si necesitas autenticación (ej: JWT), agrégala aquí:
        // 'Authorization': `Bearer ${sessionToken}`,
      },
      // Desactivamos el cacheo para asegurar datos frescos
      cache: "no-store",
    });

    if (!res.ok) {
      const errorDetail = await res.json().catch(() => ({}));
      throw new Error(
        errorDetail.message ||
          `Fallo al obtener usuarios con estado: ${res.status}`
      );
    }

    // 1. Obtener la respuesta JSON completa (ej: { data: [...] })
    const response = await res.json();

    // 2. 🎯 ARREGLO CLAVE: Verificar y retornar el array anidado en 'data'
    if (response && Array.isArray(response.data)) {
      console.log(
        "fetchUsers: Datos de usuarios cargados y extraídos de .data"
      );
      return response.data as User[]; // Retorna el array anidado
    }

    // 3. Fallback si el formato es inesperado (debería coincidir con el error que manejas arriba)
    console.error(
      "fetchUsers: El formato de la API no contiene la propiedad 'data' como un array."
    );
    return [];
    
  } catch (error) {
    console.error("Error en fetchUsers:", error);
    if (error instanceof Error) {
      // Relanzamos un error más amigable para la interfaz de usuario
      throw new Error(
        `Error al conectar con el servidor para obtener usuarios: ${error.message}`
      );
    }
    throw new Error("Ha ocurrido un error inesperado al obtener los usuarios.");
  }
}
