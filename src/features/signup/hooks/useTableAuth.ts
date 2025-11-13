// src/features/dashboard/hooks/useUserTableData.ts
'use client';

import { useState, useEffect } from "react";
// Importar la función de obtención de datos
import { fetchUsers } from '@/features/signup/services/SignupService'; 
// Importar la interfaz
import type { User } from "@/features/signup/lib/definitions"; 


// Definición del tipo de retorno del hook
interface UserTableData {
    users: User[];
    isLoading: boolean;
    error: string | null;
}

/**
 * Hook personalizado para manejar la lógica de obtención de datos de usuarios.
 * Realiza la llamada a la API, gestiona los estados de carga y error.
 * @returns Un objeto con la lista de usuarios, el estado de carga y el mensaje de error.
 */
export function useTableData(): UserTableData {
    // 1. Estados para manejar los datos, carga y errores
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 2. Efecto para llamar a la API al montar el componente (LÓGICA)
    useEffect(() => {
        async function loadUsers() {
            try {
                setIsLoading(true);
                setError(null);
                
                const data = await fetchUsers();
                
                if (Array.isArray(data)) {
                    setUsers(data); 
                } else {
                    throw new Error("La API devolvió un formato de datos inesperado.");
                }

            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Ocurrió un error desconocido al cargar los usuarios.");
                }
            } finally {
                setIsLoading(false);
            }
        }

        loadUsers();
    }, []); 

    // 3. Devolver los valores de estado para que el componente Contenedor los use
    return { users, isLoading, error };
}