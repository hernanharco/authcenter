import { redirect } from 'next/navigation';
import { fetchAuthStatus } from '@/services/AuthService';
import { LoginForm } from '@/components/auth/login-form';
// Asumo que estos son componentes de shadcn/ui o similares
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// La función del componente DEBE ser asíncrona para usar 'await'
export default async function LoginPage() {
  let authData = null;

  try {
    // Intenta obtener el estado de autenticación del usuario.
    authData = await fetchAuthStatus(); 
    
    // **Log en la terminal del servidor**
    console.log("Datos de autenticación recibidos app>(auth)>login>page.tsx:", authData);

  } catch (error) {
    // Si la API falla (ej: error 500, o servicio caído), registramos el error
    console.error("Error al verificar el estado de autenticación:", (error as Error).message);
    
    // Si hay un error de conexión, asumimos que no podemos verificar el estado
    // y permitimos que el usuario intente iniciar sesión, 
    // pero podríamos mostrar un mensaje de alerta en un entorno real.
  }
  
  // 1. Lógica de Redirección Condicional
  // Si los datos existen Y la propiedad 'isAuthenticated' es verdadera, 
  // redirigimos al usuario al dashboard (o a la ruta principal).
  // Ajusta 'authData.isAuthenticated' según la estructura real de tu respuesta API.
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