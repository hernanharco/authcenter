export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Admin' | 'Miembro' | 'Invitado';
  status: 'Activo' | 'Inactivo' | 'Pendiente';
};
