'use client'; 

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User } from "@/features/signup/lib/definitions"
// Importa el Skeleton si lo vas a usar aquí o en el componente contenedor
// import { UserTableSkeleton } from "./user-table-skeleton"; 


// Definición de las props que el componente necesita
interface UserTableViewProps {
    users: User[];
    isLoading: boolean;
    error: string | null;
}

// Mapeo de estilos de estado (puede permanecer aquí o moverse a 'definitions' si es global)
const statusVariant: { [key: string]: "default" | "secondary" | "destructive" } = {
    Activo: "default",
    Pendiente: "secondary",
    Inactivo: "destructive",
}

export function UserTableView({ users, isLoading, error }: UserTableViewProps) {

    console.log("datos de users en tableView: ", users);

    // 3. Manejo de estados de UI (recibidos como props)
    if (isLoading) {
        // Aquí podrías usar el esqueleto real:
        // return <UserTableSkeleton />;
        return <div className="p-4 text-center">Cargando datos de usuarios...</div>; 
    }

    if (error) {
        return <div className="p-4 bg-red-100 text-red-700 rounded-md">Error al cargar: {error}</div>;
    }

    if (users.length === 0) {
        return <div className="p-4 text-center text-muted-foreground">No hay usuarios registrados.</div>;
    }

    // 4. Renderizado de la tabla con los datos
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    {/* Usamos '?' para manejo defensivo si 'avatar' puede ser nulo/undefined */}
                                    <AvatarImage src={user.id} alt={user.username} /> 
                                    <AvatarFallback>cap</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium">{user.username}</div>
                                    <div className="text-sm text-muted-foreground">{user.email}</div>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>{"user.role"}</TableCell>
                        <TableCell>
                            <Badge variant={statusVariant[user.status] || 'default'}>{user.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            {/* Actions */}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}