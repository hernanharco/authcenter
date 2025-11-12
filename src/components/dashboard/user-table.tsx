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
import type { User } from "@/lib/definitions"

const users: User[] = [
    { id: "1", name: "Alice Johnson", email: "alice@example.com", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d", role: "Admin", status: "Activo" },
    { id: "2", name: "Bob Williams", email: "bob@example.com", avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d", role: "Miembro", status: "Activo" },
    { id: "3", name: "Charlie Brown", email: "charlie@example.com", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e", role: "Miembro", status: "Inactivo" },
    { id: "4", name: "Diana Prince", email: "diana@example.com", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f", role: "Miembro", status: "Pendiente" },
    { id: "5", name: "Ethan Hunt", email: "ethan@example.com", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704g", role: "Invitado", status: "Activo" },
];

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" } = {
    Activo: "default",
    Pendiente: "secondary",
    Inactivo: "destructive",
}

export function UserTable() {
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
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium">{user.name}</div>
                                    <div className="text-sm text-muted-foreground">{user.email}</div>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                            <Badge variant={statusVariant[user.status] || 'default'}>{user.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            {/* Action buttons (e.g., edit, delete) would go here */}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
