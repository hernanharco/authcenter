'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'

const signupSchema = z.object({
  username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
  email: z.string().email('Dirección de correo electrónico no válida'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export async function signup(prevState: any, formData: FormData) {
  const validatedFields = signupSchema.safeParse(
    Object.fromEntries(formData.entries())
  )

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
  
  // In a real app, you'd create the user in the database here.
  
  redirect('/dashboard')
}


const loginSchema = z.object({
  email: z.string().email('Dirección de correo electrónico no válida'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

export async function login(prevState: { message: string } | undefined, formData: FormData) {
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  )

  if (!validatedFields.success) {
    return {
      // @ts-ignore
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields. Failed to login.',
    }
  }

  // In a real app, you'd verify credentials and create a session.
  const { email, password } = validatedFields.data
  if (email === 'admin@example.com' && password === 'password') {
    redirect('/dashboard')
  }

  return {
    message: 'Correo electrónico o contraseña no válidos',
  }
}

export async function loginWithGoogle() {
  // In a real app, you'd initiate the OAuth flow with Google.
  redirect('/dashboard');
}


const profileSchema = z.object({
  username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres').optional(),
  email: z.string().email('Dirección de correo electrónico no válida').optional(),
});

export async function updateProfile(prevState: any, formData: FormData) {
  const validatedFields = profileSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      type: 'error',
      message: 'Datos proporcionados no válidos.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // In a real app, you'd update the user's profile in the database.
  
  return {
    type: 'success',
    message: '¡Perfil actualizado con éxito!',
  };
}

export async function logout() {
  // In a real app, you'd destroy the user's session.
  redirect('/login');
}
