// src/features/signup/lib/definitions.ts

export type User = {
  /** * ID simple aplanado desde el ObjectId de MongoDB. 
   * Esto lo debe hacer el servidor antes de responder.
   */
  id: string; 
  
  username: string;
  email: string;
  
  /** * Las fechas están en formato ISO 8601 (string).
   * Esto lo debe hacer el servidor si las fechas no vienen así.
   */
  createdAt: string; 
  updatedAt: string;
  
  // Nota: passwordHash y __v se omiten por seguridad y limpieza.
  
  // Campos adicionales que quizás necesites para la tabla:
  role: string;
  status: 'Activo' | 'Inactivo' | 'Pendiente'; 
  avatar: string;
};