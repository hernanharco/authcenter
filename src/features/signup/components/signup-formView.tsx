// @ts-nocheck
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { User, Mail, Lock, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GoogleIcon } from "@/components/google-icon";
import { signup, loginWithGoogle } from "@/features/signup/lib/actions_signup";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Crear Cuenta
    </Button>
  );
}

function GoogleButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      variant="outline"
      className="w-full"
      type="submit"
      formAction={loginWithGoogle}
      disabled={pending}
    >
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <GoogleIcon className="mr-2" />
      )}
      Continuar con Google
    </Button>
  );
}

export function SignupForm() {
  const [state, formAction] = useActionState(signup, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Nombre de usuario</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="tusuario"
            required
            className="pl-10"
          />
        </div>
        {state?.errors?.username && (
          <p className="text-sm text-destructive">{state.errors.username}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Correo Electrónico</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="nombre@ejemplo.com"
            required
            className="pl-10"
          />
        </div>
        {state?.errors?.email && (
          <p className="text-sm text-destructive">{state.errors.email}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            name="password"
            type="password"
            required
            className="pl-10"
          />
        </div>
        {state?.errors?.password && (
          <p className="text-sm text-destructive">{state.errors.password}</p>
        )}
      </div>

      <SubmitButton />

      <div className="relative my-4">
        <Separator />
        <span className="absolute left-1/2 -translate-x-1/2 top-[-0.75rem] bg-card px-2 text-sm text-muted-foreground">
          O
        </span>
      </div>

      <GoogleButton />

      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tienes una cuenta?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}
