// src/services/AuthService.ts

const API_BASE_URL = 'http://localhost:9002'; // Define tu URL base para reutilizarla

// Es mejor nombrar la función de forma explícita sobre lo que hace
export async function fetchAuthStatus() {
  const url = `${API_BASE_URL}/api/auth`;

  try {
    const res = await fetch(url, {
      cache: 'no-store' // Para peticiones dinámicas en Server Components
    }); 

    if (!res.ok) {
      // Lanzamos un error con más detalle si la API responde con un código 4xx/5xx
      const errorDetail = await res.json().catch(() => ({}));
      throw new Error(`Fallo al obtener estado de autenticación: ${res.status}. ${errorDetail.message || 'Error desconocido'}`);
    }

    return res.json(); // Retorna los datos de autenticación/usuario
    
  } catch (error) {
    // Relanza un error más genérico para que el componente lo capture
    console.error("Error en fetchAuthStatus:", error);
    throw new Error('Fallo en la comunicación con el servicio de autenticación.');
  }
}