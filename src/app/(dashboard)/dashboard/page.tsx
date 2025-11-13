import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserTableSkeleton } from "@/features/dashboard/components/user-table-skeleton";
import { UserTableLoader } from "@/features/dashboard/components/user-table-loader";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold">Panel</h1>
        <p className="text-muted-foreground">
          Gestiona usuarios, roles y permisos.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Usuarios</CardTitle>
          <CardDescription>
            Una lista de todos los usuarios en el sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<UserTableSkeleton />}>
            <UserTableLoader />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
