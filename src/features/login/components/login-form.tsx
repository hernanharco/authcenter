// @ts-nocheck
//src/features/login/components/login-form.tsx
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Mail, Lock, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GoogleIcon } from "@/components/google-icon";
import { login, loginWithGoogle } from "@/features/login/lib/actions_login"

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Iniciar Sesión
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

export function LoginForm() {
  const [state, formAction] = useActionState(login, undefined);

  return (
    <form action={formAction} className="space-y-4">
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

      {state?.message && (
        <p className="text-sm text-destructive text-center">{state.message}</p>
      )}

      <SubmitButton />

      <div className="relative my-4">
        <Separator />
        <span className="absolute left-1/2 -translate-x-1/2 top-[-0.75rem] bg-card px-2 text-sm text-muted-foreground">
          O
        </span>
      </div>

      <GoogleButton />

      <p className="text-center text-sm text-muted-foreground">
        ¿No tienes una cuenta?{" "}
        <Link
          href="/signup"
          className="font-semibold text-primary hover:underline"
        >
          Regístrate
        </Link>
      </p>
    </form>
  );
}
