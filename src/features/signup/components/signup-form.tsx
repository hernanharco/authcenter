import React, { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { User, Mail, Lock, Loader2 } from 'lucide-react';

// Carga de Tailwind CSS
// Importante: En un entorno de Canvas, Tailwind está disponible.

// --- MOCK ACTION (Simulación del "signup" con logging) ---
/**
 * Captura los datos del formulario (username, email, password) y los registra en la consola.
 * @param {object} prevState - El estado anterior de la acción.
 * @param {FormData} formData - Los datos del formulario.
 * @returns {object} Un nuevo estado con un mensaje de éxito.
 */
function mockSignup(prevState, formData) {
  const username = formData.get('username');
  const email = formData.get('email');
  const password = formData.get('password');

  // **********************************************
  // ** LÓGICA DE CONSOLE.LOG SOLICITADA **
  // **********************************************
  console.log('---------------------------------');
  console.log('--- Form Submission Data Logged ---');
  console.log(`Username: ${username}`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log('---------------------------------');
  // **********************************************

  // Retorna un estado mock para mostrar un mensaje en la UI
  return {
    success: true,
    message: '¡Datos de cuenta registrados en la consola! Revisa los logs para ver la información.',
    errors: {},
  };
}

// Mock function for Google Login (just logs a message)
function mockLoginWithGoogle(formData) {
    console.log('--- Google Login Attempted ---');
    console.log('Simulando redirección para autenticación de Google...');
    return { success: true, message: 'Simulando inicio de sesión con Google.' };
}

// --- MOCK COMPONENTS (Minimal Styling with Tailwind) ---

// Mock Component: Button
const Button = ({ children, className = "", variant = "default", ...props }) => {
    let baseStyle = "px-4 py-2 font-semibold text-sm rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2";
    let colorStyle = "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500";
    if (variant === "outline") {
        colorStyle = "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 focus:ring-gray-300 shadow-sm";
    }
    return <button className={`${baseStyle} ${colorStyle} ${className}`} {...props}>{children}</button>;
};

// Mock Component: Input
const Input = ({ className = "", type = "text", ...props }) => (
    <input type={type} className={`w-full border border-gray-300 bg-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow ${className}`} {...props} />
);

// Mock Component: Label
const Label = ({ children, ...props }) => <label className="text-sm font-medium text-gray-700 block mb-1" {...props}>{children}</label>;

// Mock Component: Separator
const Separator = () => <div className="bg-gray-200 h-px w-full" />;

// Mock Component: GoogleIcon (Simple inline SVG)
const GoogleIcon = ({ className = "" }) => (
    <svg className={`h-4 w-4 ${className}`} viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.333-6.14 7.5-11.303 7.5c-6.6 0-11.983-5.383-11.983-11.983s5.383-11.983 11.983-11.983c3.048 0 5.765 1.139 7.915 3.332l5.58-5.27C34.246 3.65 29.467 1 24 1C12.955 1 4 9.955 4 20.983s8.955 19.983 19.983 19.983c12.24 0 20.306-8.601 20.306-19.383c0-1.125-.138-2.203-.385-3.237z" />
        <path fill="#FF3D00" d="M6.306 17.521L1.693 22.25c-1.396-2.91-2.091-6.198-2.091-9.486c0-3.288.695-6.576 2.091-9.486l4.743 4.729c-.832 2.023-1.29 4.225-1.29 6.543c0 2.318.458 4.52 1.29 6.543z" />
        <path fill="#4CAF50" d="M43.611 20.083h-2.126c-.237-1.034-.385-2.112-.385-3.237c0-2.318-.458-4.52-1.29-6.543l4.743-4.729c1.396 2.91 2.091 6.198 2.091 9.486s-.695 6.576-2.091 9.486l-4.743-4.729c.832-2.023 1.29-4.225 1.29-6.543z" />
        <path fill="#1976D2" d="M24.017 40.966c-5.383 0-10.424-2.179-14.076-5.832l-5.58 5.27c4.498 4.757 10.74 7.498 19.656 7.498c11.028 0 19.983-8.955 19.983-19.983c0-1.125-.138-2.203-.385-3.237H24.017v8h11.303c-1.649 4.333-6.14 7.5-11.303 7.5z" />
    </svg>
);


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full mt-6" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Crear Cuenta
    </Button>
  );
}

function GoogleButton() {
  const { pending } = useFormStatus();
  return (
    // Usa la acción mockLoginWithGoogle para simular el inicio de sesión con Google
    <Button variant="outline" className="w-full" type="submit" formAction={mockLoginWithGoogle} disabled={pending}>
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <GoogleIcon className="mr-2" />
      )}
      Continuar con Google
    </Button>
  );
}

function SignupForm() {
  // Se usa mockSignup para capturar y loguear los datos del formulario
  const [state, formAction] = useActionState(mockSignup, {});

  return (
    <div className="max-w-md mx-auto p-8 bg-white shadow-2xl rounded-xl border border-gray-100 w-full">
      <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-900 tracking-tight">Regístrate</h2>

      {/* Muestra el mensaje de éxito del mockSignup */}
      {state.success && state.message && (
        <div className="bg-green-50 border border-green-300 text-green-700 p-4 rounded-lg mb-4 text-center text-sm" role="alert">
          <span className="font-medium">{state.message}</span>
        </div>
      )}

      <form action={formAction} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="username">Nombre de usuario</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input id="username" name="username" type="text" placeholder="tusuario" required className="pl-10" />
          </div>
          {state?.errors?.username && <p className="text-sm text-red-500">{state.errors.username}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Correo Electrónico</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input id="email" name="email" type="email" placeholder="nombre@ejemplo.com" required className="pl-10" />
          </div>
          {state?.errors?.email && <p className="text-sm text-red-500">{state.errors.email}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input id="password" name="password" type="password" required className="pl-10" />
          </div>
          {state?.errors?.password && <p className="text-sm text-red-500">{state.errors.password}</p>}
        </div>

        <SubmitButton />

        <div className="relative my-6">
          <Separator />
          <span className="absolute left-1/2 -translate-x-1/2 top-[-0.75rem] bg-white px-3 text-sm text-gray-500 font-medium">O</span>
        </div>

        <GoogleButton />

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tienes una cuenta?{' '}
          <a href="/login" className="font-semibold text-blue-600 hover:underline transition-colors">
            Inicia sesión
          </a>
        </p>
      </form>
    </div>
  );
}

// Main component export (for single-file React structure)
export default function App() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
            <SignupForm />
        </div>
    );
}