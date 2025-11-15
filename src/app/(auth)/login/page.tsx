//src/app/(auth)/login/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { fetchAuthStatus } from '@/features/login/services/loginServiceJWT'
import { LoginForm } from '@/features/login/components/login-form';
// Asumo que estos son componentes de shadcn/ui o similares
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// La función del componente DEBE ser asíncrona para usar 'await'
export default async function LoginPage() {
    
    // 🎯 PASO A: OBTENER EL TOKEN DIRECTAMENTE AQUÍ
    const token = (await cookies()).get('sessionToken')?.value;

    let authData = null;

    try {
        // 🎯 PASO B: PASAR EL TOKEN AL SERVICIO
        // Modificamos fetchAuthStatus para que reciba el token.
        authData = await fetchAuthStatus(token); 
        
        console.log("Datos de autenticación recibidos:", authData);
        // ...
    } catch (error) {
        // ...
    }
    
    // 1. Lógica de Redirección Condicional
    if (authData && authData.isAuthenticated) {
        console.log("Usuario ya autenticado. Redirigiendo a /dashboard.");
        redirect('/dashboard');
    }

  // 2. Renderizado del Formulario de Login
  // Si la verificación falla o el usuario no está autenticado, mostramos el formulario.
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-sm shadow-2xl shadow-primary/10">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl">Bienvenido de Vuelta</CardTitle>
          <CardDescription>Ingresa tus credenciales para acceder a tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Aquí se renderiza el formulario de inicio de sesión real */}
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}