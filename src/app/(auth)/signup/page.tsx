import { SignupForm } from '@/features/signup/components/signup-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function SignupPage() {
  return (
    <Card className="shadow-2xl shadow-primary/10">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl">Crear una Cuenta</CardTitle>
        <CardDescription>Únete a AuthCenter para administrar tus servicios</CardDescription>
      </CardHeader>
      <CardContent>
        <SignupForm />
      </CardContent>
    </Card>
  );
}
