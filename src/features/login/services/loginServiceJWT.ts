// src/features/login/services/loginServiceJWT.ts

// Asegúrate de definir el API_BASE_URL aquí (o importarlo de donde lo tengas)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// =======================================================
// 🎯 1. INTERFACES NECESARIAS (Exportables)
// =======================================================

export interface LoginCredentials {
  email: string;
  password: string;
}

// Interfaz que tu backend debe devolver al hacer login
export interface LoginResponse {
  message: string;
  token: string; // CLAVE: El JWT
  userId: string;
}

export interface AuthStatusResponse {
  isAuthenticated: boolean;
  userId?: string;
}

// =======================================================
// 🎯 2. FUNCIÓN PARA INICIAR SESIÓN (Exportable)
// =======================================================

/** POST **
 * Realiza una petición POST al endpoint de login (/api/auth/login).
 * @param credentials - email y contraseña del usuario.
 */
export async function loginUser(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  // 💡 NOTA: Usa el endpoint exacto de tu Route Handler de POST.
  const url = `${API_BASE_URL}/api/auth/login`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
      cache: "no-store",
    });

    if (!res.ok) {
      const errorDetail = await res.json().catch(() => ({}));
      throw new Error(
        errorDetail.message ||
          `Fallo al iniciar sesión con estado: ${res.status}`
      );
    }

    return res.json() as Promise<LoginResponse>;
  } catch (error) {
    console.error("Error en loginUser:", error);
    // Este mensaje se muestra en el formulario de login.
    throw new Error("Credenciales incorrectas o error de conexión.");
  }
}

// =======================================================
// 3. FUNCIÓN PARA VERIFICAR EL ESTADO (fetchAuthStatus existente)
// =======================================================

export async function fetchAuthStatus(
  token: string | undefined
): Promise<AuthStatusResponse> {
  // 1. Si no hay token, el usuario no está autenticado.
  if (!token) {
    return { isAuthenticated: false };
  }

  // 2. Llama al endpoint de verificación de token en el backend
  const url = `${API_BASE_URL}/api/auth/status`;

  try {
    // ... (El resto del código es el mismo, pero sin la limpieza de cookies) ...
    const res = await fetch(url, {
      // ... headers con Authorization: Bearer ${token} ...
    });

    // 3. Maneja la respuesta del backend
    if (res.ok) {
      // ... (retorna isAuthenticated: true) ...
    } else if (res.status === 401) {
      // 4. Si el token expiró o es inválido, el backend debe devolver 401
      console.log("Token inválido o expirado.");
      // ❌ YA NO LIMPIAMOS LA COOKIE AQUÍ. Lo haremos en el Server Action 'logout'
      return { isAuthenticated: false };
    }
    // ... (manejo de errores) ...
  } catch (error) {
    // ... (manejo de errores) ...
  }
  return { isAuthenticated: false };
}
