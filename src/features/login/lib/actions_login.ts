//src/features/login/lib/actions_login.ts
"use server";

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
// Importa la nueva función y las interfaces
import { loginUser, LoginResponse } from '@/features/login/services/loginServiceJWT'


// 1. Define el Schema de Validación
const LoginSchema = z.object({
  email: z.string().email({ message: "Ingrese un email válido." }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
});

// 2. Define el Tipo de Estado del Formulario
type LoginState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string | null;
} | undefined;

/**
 * Server Action para manejar el inicio de sesión.
 * @param prevState - El estado anterior del formulario (usado por useActionState).
 * @param formData - Los datos del formulario enviados.
 * @returns Un objeto con errores o un mensaje, o redirige si es exitoso.
 */
export async function login(prevState: LoginState, formData: FormData): Promise<LoginState> {
  // 1. Validar los datos del formulario
  const validatedFields = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // Si la validación falla, retorna los errores al formulario
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan campos o los datos son inválidos.',
    };
  }
  
  const { email, password } = validatedFields.data;
  
  try {
    // 2. Llamar a la función del servicio para iniciar sesión
    const result: LoginResponse = await loginUser({ email, password });
    
    // 3. Establecer la Sesión (Cookies)
    // Usamos el token devuelto por el backend para crear una cookie segura.
    if (result.token) {
      (await cookies()).set('sessionToken', result.token, {
        httpOnly: true, // No accesible por JavaScript en el navegador
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 semana (ajusta la duración)
        path: '/',
      });
      console.log('Token de sesión establecido. Redirigiendo...');
    } else {
        // En caso de que el login sea exitoso pero no devuelva un token
        return { message: 'Inicio de sesión exitoso, pero faltó el token de sesión.' };
    }
    
    // 4. Redirigir al usuario al dashboard (rutas protegidas)
    redirect('/dashboard');
    
  } catch (error) {
    // 5. Manejar errores de la API (ej: Credenciales inválidas)
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al iniciar sesión.';
    
    console.error("Fallo en la acción de login:", errorMessage);
    
    return {
      message: errorMessage,
    };
  }
}

export async function loginWithGoogle() {
  console.log("➡️ Iniciando flujo OAuth de Google...");
  // In a real app, you'd initiate the OAuth flow with Google.
  redirect("/dashboard");
}

// **Nota:** La acción `loginWithGoogle` requerirá la configuración de autenticación OAuth.
// ... (mantenemos la función loginWithGoogle sin implementar por ahora)