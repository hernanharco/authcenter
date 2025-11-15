"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { registerUser } from "@/features/signup/services/SignupService";

// --- MOCK DATABASE FUNCTION ---

interface UserData {
  username: string;
  email: string;
  // La contraseña en producción debería ser hasheada, aquí solo la guardamos para el mock
  password: string;
}

// --- SCHEMAS ---

const signupSchema = z.object({
  username: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  email: z.string().email("Dirección de correo electrónico no válida"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const loginSchema = z.object({
  email: z.string().email("Dirección de correo electrónico no válida"),
  password: z.string().min(1, "La contraseña es requerida"),
});

const profileSchema = z.object({
  username: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .optional(),
  email: z
    .string()
    .email("Dirección de correo electrónico no válida")
    .optional(),
});

// --- SERVER ACTIONS ---

export async function signup(prevState: any, formData: FormData) {
  // Convertimos FormData a objeto normal
  const data = Object.fromEntries(formData.entries());

  // Validamos con Zod
  const validated = signupSchema.safeParse(data);
  if (!validated.success) {
    console.log(
      "❌ Errores de validación:",
      validated.error.flatten().fieldErrors
    );
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { username, email, password } = validated.data;
  console.log("✅ Usuario validado:", { username, email, password });
  try {
    // Llamamos a tu API usando SignupService
    const response = await registerUser({
      username,
      email,
      password,
    });

    console.log(`✅ Registro exitoso. Nuevo Usuario ID: ${response}`);

    // Redirige al dashboard
    redirect("/dashboard");
  } catch (error: any) {
    if (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof error.message === "string" &&
      error.message.includes("NEXT_REDIRECT")
    ) {
      throw error; // ¡Relanzar la excepción de redirección!
    }
    // Si es cualquier otro error (el de tu API, de red, etc.)
    console.error("Error al registrar el usuario:", error.message);
    return {
      errors: {},
      message: error.message || "Fallo interno del servidor.",
    };
  }
}

export async function loginWithGoogle() {
  console.log("➡️ Iniciando flujo OAuth de Google...");
  // In a real app, you'd initiate the OAuth flow with Google.
  redirect("/dashboard");
}

export async function updateProfile(prevState: any, formData: FormData) {
  const validatedFields = profileSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      type: "error",
      message: "Datos proporcionados no válidos.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Lógica mock de actualización
  const dataToUpdate = validatedFields.data;
  console.log("🔄 Actualizando perfil en Mock DB con datos:", dataToUpdate);
  await new Promise((resolve) => setTimeout(resolve, 400));

  return {
    type: "success",
    message: "¡Perfil actualizado con éxito!",
  };
}

export async function logout() {
  console.log("🚪 Sesión cerrada. Redirigiendo a /login...");
  // In a real app, you'd destroy the user's session.
  redirect("/login");
}
