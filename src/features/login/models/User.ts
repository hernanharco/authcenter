import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

// 1. Interfaz para tipado estricto
export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string; // Nota: Seleccionado solo si se pide explícitamente
  createdAt: Date;
  updatedAt: Date;
}

// 2. Definición del Esquema
const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: [true, 'El nombre de usuario es requerido.'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'El email es requerido.'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida.'],
    minlength: 6,
    // La clave para el login: por defecto, Mongoose no incluirá este campo en consultas.
    select: false, 
  },
}, {
  timestamps: true,
});


// 3. Middleware de Bcrypt (Hashear antes de guardar)
UserSchema.pre<UserDocument>('save', async function (next) {
  // Solo hashea si la contraseña ha sido modificada (o es nueva)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

// 4. Exportar el Modelo
// Usamos mongoose.models.User para evitar errores de re-compilación en Next.js
export default (mongoose.models.User as mongoose.Model<UserDocument>) || 
               mongoose.model<UserDocument>('User', UserSchema);

export type UserType = UserDocument; // Exportamos un tipo para facilitar el uso en Services