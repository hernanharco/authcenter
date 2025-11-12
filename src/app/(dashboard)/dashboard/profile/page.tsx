import { ProfileForm } from '@/components/auth/profile-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfilePage() {
  // In a real app, you would fetch the current user's data here.
  const currentUser = {
    username: 'adminuser',
    email: 'admin@example.com',
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
        <div className="space-y-2">
            <h1 className="font-headline text-3xl font-bold">Perfil</h1>
            <p className="text-muted-foreground">Gestiona la configuración de tu cuenta y tu información personal.</p>
        </div>
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
          <CardDescription>Actualiza tu nombre de usuario y dirección de correo electrónico.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm user={currentUser} />
        </CardContent>
      </Card>
    </div>
  );
}
