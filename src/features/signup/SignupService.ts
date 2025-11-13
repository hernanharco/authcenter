// src/services/SignupService.ts

// Define tu URL base para la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 1. Define la interfaz para los datos que se enviarán (payload)
interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

// 2. Define la interfaz para la respuesta esperada (ejemplo)
interface SignupResponse {
  message: string;
  userId: string;
  token?: string; // El token de sesión/JWT es común
}

/**
 * Realiza una petición POST al endpoint de registro (/api/signup).
 * @param credentials - Objeto con el nombre, email y contraseña del usuario.
 * @returns Los datos de respuesta de la API (ej: mensaje, userId).
 */
export async function registerUser(credentials: SignupCredentials): Promise<SignupResponse> {
  const url = `${API_BASE_URL}/api/signup`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Convertimos los datos de registro a una cadena JSON
      body: JSON.stringify(credentials),
      
      // Indicamos que esta no es una petición de Server Component que deba ser cacheada
      cache: 'no-store' 
    }); 

    // Verificamos si la respuesta fue exitosa (código 200-299)
    if (!res.ok) {
      // Intentamos obtener el mensaje de error del cuerpo de la respuesta
      const errorDetail = await res.json().catch(() => ({}));
      
      // Lanzamos un error con la información específica del fallo
      throw new Error(errorDetail.message || `Fallo en el registro con estado: ${res.status}`);
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
    throw new Error('Ha ocurrido un error inesperado durante el registro.');
  }
}