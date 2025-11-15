// @ts-nocheck
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useEffect, useRef } from "react";
import { User, Mail, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/features/signup/lib/actions_signup";
import { cn } from "@/lib/utils";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Guardando...
        </>
      ) : (
        "Guardar Cambios"
      )}
    </Button>
  );
}

export function ProfileForm({
  user,
}: {
  user: { username: string; email: string };
}) {
  const [state, formAction] = useActionState(updateProfile, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.type === "success") {
      // Don't reset the form to keep showing the updated values.
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="username">Nombre de usuario</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="username"
            name="username"
            defaultValue={user.username}
            className="pl-10"
          />
        </div>
        {state?.errors?.username && (
          <p className="text-sm text-destructive">{state.errors.username[0]}</p>
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
            defaultValue={user.email}
            className="pl-10"
          />
        </div>
        {state?.errors?.email && (
          <p className="text-sm text-destructive">{state.errors.email[0]}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <SubmitButton />
        {state?.message && (
          <div
            className={cn(
              "flex items-center gap-2 text-sm",
              state.type === "success" ? "text-green-600" : "text-destructive"
            )}
          >
            {state.type === "success" ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            {state.message}
          </div>
        )}
      </div>
    </form>
  );
}
